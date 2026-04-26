import React, { useState } from 'react';
import { addRsvp, clearRsvps, isCloud, useRsvps } from '../lib/rsvp';

// RSVP recorder. Uses Supabase if configured, otherwise localStorage.
// Behavior is identical for guests; only the storage backend differs.
export default function RsvpPanel({ state }) {
  const { rows, loading, refresh } = useRsvps();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(2);
  const [attending, setAttending] = useState('yes');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const cloud = isCloud();

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await addRsvp({ name, phone, count, attending, note });
      await refresh();
      setDone(true);
      setName(''); setPhone(''); setCount(2); setAttending('yes'); setNote('');
      setTimeout(() => setDone(false), 2200);
    } catch (err) {
      alert(err?.message || 'שמירה נכשלה');
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    const r = [
      ['name', 'phone', 'count', 'attending', 'note', 'ts'],
      ...rows.map((x) => [x.name, x.phone, x.count, x.attending, x.note, x.ts]),
    ];
    const csv = r
      .map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.bride}-${state.groom || 'event'}-rsvp.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const clearLocal = async () => {
    if (!confirm('למחוק את ההרשמות (מהמכשיר הזה בלבד)?')) return;
    await clearRsvps();
    refresh();
  };

  const totalYes = rows.filter((r) => r.attending === 'yes').reduce((acc, r) => acc + Number(r.count || 0), 0);

  return (
    <div className="glass-strong rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold tracking-wide">אישורי הגעה</h3>
        <span className="text-[11px] text-gold-50/60">
          {cloud ? '☁️ ענן (Supabase) · עדכון חי' : '📱 שמירה מקומית בדפדפן'}
        </span>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input className="field" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="field" placeholder="טלפון" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
        <select className="field" value={attending} onChange={(e) => setAttending(e.target.value)}>
          <option value="yes">מגיע/ה ✓</option>
          <option value="maybe">אולי</option>
          <option value="no">לא מגיע/ה</option>
        </select>
        <input
          className="field"
          type="number"
          min="0"
          max="20"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          placeholder="כמות אורחים"
        />
        <textarea
          className="field sm:col-span-2 min-h-[60px]"
          placeholder="הערה (אלרגיות, צמחוני וכו')"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="sm:col-span-2 flex flex-wrap gap-2 justify-end">
          {done && <span className="text-sm text-emerald-300 self-center">נרשם בתודה ✨</span>}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? 'שולח…' : 'שליחת אישור'}
          </button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          סה"כ נרשמו: <b>{loading ? '…' : rows.length}</b>{' '}
          <span className="text-gold-50/60">· מגיעים: <b className="text-emerald-300">{totalYes}</b></span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={exportCsv} disabled={!rows.length}>⬇ CSV</button>
          <button className="btn btn-ghost" onClick={clearLocal} disabled={!rows.length}>נקה</button>
        </div>
      </div>

      {!!rows.length && (
        <div className="mt-3 max-h-40 overflow-auto no-scrollbar text-xs space-y-1">
          {rows.slice(0, 30).map((r) => (
            <div key={r.id} className="flex justify-between gap-2 border-b border-white/5 py-1">
              <span>{r.name} ({r.count})</span>
              <span className={r.attending === 'yes' ? 'text-emerald-300' : r.attending === 'no' ? 'text-rose-300' : 'text-amber-200'}>
                {r.attending === 'yes' ? 'מגיע/ה' : r.attending === 'no' ? 'לא' : 'אולי'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
