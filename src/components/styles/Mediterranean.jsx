import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// Warm terracotta + sage. Inspired by Andalusian/Levantine arches.
export default function Mediterranean({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #f7e8c8 0%, #f0d9b0 60%, #e0bf90 100%)',
          color: '#3a2418',
        }}
      >
        {/* Arch frame */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="arch" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c0633a" />
              <stop offset="100%" stopColor="#8a3a1a" />
            </linearGradient>
          </defs>
          {/* Outer arch */}
          <path
            d="M 60 560 L 60 250 Q 60 80 200 80 Q 340 80 340 250 L 340 560 Z"
            fill="none"
            stroke="url(#arch)"
            strokeWidth="3"
          />
          {/* Inner arch */}
          <path
            d="M 78 560 L 78 256 Q 78 96 200 96 Q 322 96 322 256 L 322 560 Z"
            fill="none"
            stroke="#c0633a"
            strokeWidth="1"
            opacity="0.55"
          />
        </svg>

        {/* Tile pattern bottom */}
        <div className="absolute bottom-0 inset-x-0 h-12 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #c0633a 0 8px, transparent 8px 16px)',
          }}
        />

        {/* Names */}
        <div className="absolute top-[26%] inset-x-0 text-center px-10">
          <div className="text-[10px] tracking-[0.4em] text-[#8a3a1a] mb-3">{state.parentsBride} · {state.parentsGroom}</div>
          <h1 className="font-display text-[40px] sm:text-[50px] leading-[1.05]">
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="font-script text-3xl text-[#c0633a] my-1">&amp;</div>
              <h1 className="font-display text-[40px] sm:text-[50px] leading-[1.05]">
                {state.groom}
              </h1>
            </>
          )}
        </div>

        {/* Date band */}
        <div className="absolute top-[60%] inset-x-0 text-center px-10">
          <div className="inline-block px-4 py-1.5 border border-[#8a3a1a]/60 text-[12px] tracking-[0.25em] uppercase rounded-sm">
            {formatHebrewDate(state.dateISO)}
          </div>
        </div>

        <div className="absolute top-[68%] inset-x-0 text-center px-10 leading-relaxed">
          <div className="text-xs text-[#5a3018]/85">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm">{state.venueName}</div>
          <div className="text-xs text-[#5a3018]/80">{state.venueAddress}</div>
        </div>

        <div className="absolute bottom-[14%] inset-x-0 text-center px-12">
          <p className="text-xs italic text-[#5a3018]/85 leading-relaxed">“{state.tagline}”</p>
        </div>
      </div>
    </div>
  );
}
