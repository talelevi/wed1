import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// Bold, magazine-grade layout. Asymmetric grid, oversized type, accent color.
export default function Editorial({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft text-[#0e0e0e]"
        style={{ background: '#fafafa' }}
      >
        {/* Top metadata bar */}
        <div className="absolute top-0 inset-x-0 px-5 py-3 flex justify-between items-center text-[10px] tracking-[0.3em] uppercase">
          <span>vol. 01 · luminara</span>
          <span>№ {hashShort(state.bride + state.groom)}</span>
        </div>

        {/* Diagonal accent block */}
        <div
          className="absolute -left-20 top-[8%] w-[180%] h-32 -rotate-6"
          style={{ background: '#ff5436' }}
        />

        {/* Display name on accent */}
        <div className="absolute top-[11%] inset-x-0 px-6 -rotate-6">
          <div className="text-white font-display text-[44px] sm:text-[56px] leading-[0.95] tracking-tight">
            {state.bride}
          </div>
        </div>

        {/* "+" between */}
        {state.eventType !== 'birthday' && (
          <>
            <div className="absolute top-[32%] right-6 text-7xl font-display leading-none text-[#0e0e0e]">+</div>
            <div className="absolute top-[42%] inset-x-0 px-6">
              <div className="font-display text-[44px] sm:text-[56px] leading-[0.95] tracking-tight text-right">
                {state.groom}
              </div>
            </div>
          </>
        )}

        {/* Pull quote */}
        <div className="absolute top-[58%] inset-x-0 px-6">
          <div className="border-r-2 border-[#ff5436] pr-3 text-[13px] leading-relaxed text-[#0e0e0e]/85" dir="rtl">
            “{state.tagline}”
          </div>
        </div>

        {/* Bottom info grid */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-5 grid grid-cols-2 gap-3 text-[11px] leading-snug">
          <div>
            <div className="uppercase tracking-[0.25em] text-[10px] text-[#0e0e0e]/55 mb-0.5">תאריך</div>
            <div className="font-semibold">{formatHebrewDate(state.dateISO)}</div>
            <div className="opacity-70">{state.receptionTime} · {state.ceremonyTime}</div>
          </div>
          <div>
            <div className="uppercase tracking-[0.25em] text-[10px] text-[#0e0e0e]/55 mb-0.5">מיקום</div>
            <div className="font-semibold">{state.venueName}</div>
            <div className="opacity-70">{state.venueAddress}</div>
          </div>
        </div>

        {/* Hairline separator */}
        <div className="absolute bottom-[19%] inset-x-5 h-px bg-[#0e0e0e]/15" />
      </div>
    </div>
  );
}

function hashShort(s) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(Math.abs(h) % 9999).padStart(4, '0');
}
