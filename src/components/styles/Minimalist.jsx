import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// Pure whitespace. One thin line. Mono-display name. Typography does the work.
export default function Minimalist({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{ background: '#fafaf7', color: '#0a0a0a' }}
      >
        <div className="absolute top-10 inset-x-0 text-center text-[10px] tracking-[0.6em] uppercase opacity-60">
          {state.eventType === 'henna' ? 'henna night' :
           state.eventType === 'engagement' ? 'engagement' :
           state.eventType === 'birthday' ? 'birthday' : 'wedding'}
        </div>

        <div className="absolute top-[30%] inset-x-0 text-center px-8">
          <h1 className="font-mono text-[34px] sm:text-[44px] leading-[1.05] tracking-tight">
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="text-xl my-2 opacity-50">/</div>
              <h1 className="font-mono text-[34px] sm:text-[44px] leading-[1.05] tracking-tight">
                {state.groom}
              </h1>
            </>
          )}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-12 h-px bg-[#0a0a0a]" />

        <div className="absolute top-[60%] inset-x-0 text-center px-8 space-y-1">
          <div className="text-sm tracking-wide">{formatHebrewDate(state.dateISO)}</div>
          <div className="text-xs opacity-60">{state.receptionTime} · {state.ceremonyTime}</div>
          <div className="text-sm pt-2">{state.venueName}</div>
          <div className="text-xs opacity-60">{state.venueAddress}</div>
        </div>

        <div className="absolute bottom-10 inset-x-0 text-center px-12">
          <p className="text-xs opacity-65 leading-relaxed">{state.tagline}</p>
        </div>
      </div>
    </div>
  );
}
