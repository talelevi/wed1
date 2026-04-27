import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  buildEvent,
  downloadICS,
  googleCalendarUrl,
  outlookCalendarUrl,
  yahooCalendarUrl,
} from '../lib/calendar';
import { buildShareUrl, fillTemplate, formatHebrewDate } from '../lib/state';

export default function ShareBar({ state }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const url = useMemo(() => buildShareUrl(state), [state]);
  const ev = useMemo(
    () =>
      buildEvent({
        title: `${state.bride} & ${state.groom} — ${state.eventType === 'henna' ? 'חינה' : 'חתונה'}`,
        description: `${state.tagline}\n\nקבלת פנים ${state.receptionTime} · חופה ${state.ceremonyTime}\n${state.venueName}, ${state.venueAddress}\n\nפרטים: ${url}`,
        location: `${state.venueName}, ${state.venueAddress}`,
        startISO: state.dateISO,
        durationMinutes: state.durationMinutes,
      }),
    [state, url]
  );

  const message = fillTemplate(state.inviteMessage, {
    names: `${state.bride} ${state.groom ? '& ' + state.groom : ''}`.trim(),
    dateHe: formatHebrewDate(state.dateISO),
    venue: state.venueName,
    url,
  });

  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(message)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent('הזמנה לאירוע שלנו')}&body=${encodeURIComponent(message)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const onNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'הזמנה לאירוע', text: message, url });
      } catch { /* user cancelled */ }
    } else {
      onCopy();
    }
  };

  return (
    <div className="glass-strong rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold tracking-wide">שיתוף ויומן</h3>
        <span className="text-[11px] text-gold-50/60">לחיצה אחת ושלחת</span>
      </div>

      {/* Buttons size down + truncate gracefully on phones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 [&>*]:!px-2 [&>*]:!py-2 [&>*]:text-xs sm:[&>*]:text-sm [&>*]:min-w-0 [&>*]:truncate">
        <a className="btn btn-primary" href={googleCalendarUrl(ev)} target="_blank" rel="noreferrer">
          📅 Google
        </a>
        <button className="btn btn-ghost" onClick={() => downloadICS(ev, `${state.bride}-${state.groom || 'event'}.ics`)}>
          ⤓ Apple / Outlook
        </button>
        <a className="btn btn-ghost" href={outlookCalendarUrl(ev)} target="_blank" rel="noreferrer">
          🪟 Outlook Web
        </a>
        <a className="btn btn-ghost" href={yahooCalendarUrl(ev)} target="_blank" rel="noreferrer">
          🟣 Yahoo
        </a>
        <a className="btn btn-ghost" href={waUrl} target="_blank" rel="noreferrer">
          🟢 וואטסאפ
        </a>
        <a className="btn btn-ghost" href={tgUrl} target="_blank" rel="noreferrer">
          ✈️ טלגרם
        </a>
        <a className="btn btn-ghost" href={smsUrl}>💬 SMS</a>
        <a className="btn btn-ghost" href={mailUrl}>✉️ אימייל</a>
        <button className="btn btn-ghost" onClick={onNativeShare}>📤 שיתוף</button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
        <input
          readOnly
          className="field text-xs sm:text-sm font-mono ltr:text-left rtl:text-left"
          dir="ltr"
          value={url}
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={onCopy}>
            {copied ? '✓ הועתק' : '📋 העתקה'}
          </button>
          <button className="btn btn-ghost" onClick={() => setShowQR((s) => !s)}>
            {showQR ? '✕ סגור QR' : '🔳 קוד QR'}
          </button>
        </div>
      </div>

      {showQR && state.showQR && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="bg-white rounded-2xl p-3">
            <QRCodeSVG value={url || ' '} size={180} level="H" includeMargin={false} />
          </div>
          <p className="text-xs text-gold-50/60">סרקו במצלמת הטלפון לפתיחת ההזמנה</p>
        </div>
      )}
    </div>
  );
}
