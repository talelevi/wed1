import React, { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

function diff(toISO) {
  const target = new Date(toISO).getTime();
  const now = Date.now();
  let s = Math.max(0, Math.floor((target - now) / 1000));
  const days = Math.floor(s / 86400); s -= days * 86400;
  const hours = Math.floor(s / 3600); s -= hours * 3600;
  const minutes = Math.floor(s / 60); s -= minutes * 60;
  return { days, hours, minutes, seconds: s, done: target - now <= 0 };
}

export default function Countdown({ toISO, accent = '#e9c97a' }) {
  const [t, setT] = useState(() => diff(toISO));
  useEffect(() => {
    const id = setInterval(() => setT(diff(toISO)), 1000);
    return () => clearInterval(id);
  }, [toISO]);

  if (t.done) {
    return (
      <div
        className="text-center text-2xl font-display tracking-widest"
        style={{ color: accent }}
      >
        ✦ הלילה הגדול הגיע ✦
      </div>
    );
  }
  const cells = [
    { v: t.days, label: 'ימים' },
    { v: t.hours, label: 'שעות' },
    { v: t.minutes, label: 'דקות' },
    { v: t.seconds, label: 'שניות' },
  ];
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5" dir="ltr">
      {cells.map((c, i) => (
        <div key={i} className="text-center">
          <div
            className="glass-strong rounded-2xl ring-soft px-3 py-2 sm:px-5 sm:py-3 min-w-[58px] sm:min-w-[78px]"
            style={{ boxShadow: `0 0 30px -10px ${accent}66, inset 0 0 0 1px rgba(255,255,255,0.08)` }}
          >
            <div
              className="font-mono text-2xl sm:text-4xl tabular-nums"
              style={{ color: accent }}
            >
              {pad(c.v)}
            </div>
          </div>
          <div className="mt-1 text-[10px] sm:text-xs text-gold-50/70 tracking-widest">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
