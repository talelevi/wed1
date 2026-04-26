import React, { useState } from 'react';

// Local-first RSVP recorder. Saves responses to localStorage and offers a CSV export.
// (No backend required – pair with a real form service when shipped.)
export default function RsvpPanel({ state }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(2);
  const [attending, setAttending] = useState('yes');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [list, setList] = useState(() => readList());

  const submit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      count,
      attending,
      note: note.trim(),
      ts: new Date().toISOString(),
    };
    if (!entry.name) return;
    const next = [entry, ...list];
    setList(next);
    localStorage.setItem('luminara:rsvp', JSON.stringify(next));
    setDone(true);
    setName(''); setPhone(''); setCount(2); setAttending('yes'); setNote('');
    setTimeout(() => setDone(false), 2200);
  };

  const exportCsv = () => {
    const rows = [
      ['name', 'phone', 'count', 'attending', 'note', 'ts'],
      ...list.map((r) => [r.name, r.phone, r.count, r.attending, r.note, r.ts]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
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

  const clearAll = () => {
    if (!confirm('למחוק את כל ההרשמות מההתקן הזה?')) return;
    localStorage.removeItem('luminara:rsvp');
    setList([]);
  };

  const totalYes = list.filter((r) => r.attending === 'yes').reduce((acc, r) => acc + Number(r.count || 0), 0);

  return (
    <div className="glass-strong rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold tracking-wide">אישורי הגעה</h3>
        <span className="text-[11px] text-gold-50/60">נשמר בדפדפן · ייצוא CSV</span>
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
          <button className="btn btn-primary" type="submit">שליחת אישור</button>
        </div>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          סה"כ נרשמו: <b>{list.length}</b>{' '}
          <span className="text-gold-50/60">· מגיעים: <b className="text-emerald-300">{totalYes}</b></span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={exportCsv} disabled={!list.length}>⬇ CSV</button>
          <button className="btn btn-ghost" onClick={clearAll} disabled={!list.length}>נקה</button>
        </div>
      </div>

      {!!list.length && (
        <div className="mt-3 max-h-40 overflow-auto no-scrollbar text-xs space-y-1">
          {list.slice(0, 30).map((r) => (
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

function readList() {
  try {
    return JSON.parse(localStorage.getItem('luminara:rsvp') || '[]');
  } catch {
    return [];
  }
}
