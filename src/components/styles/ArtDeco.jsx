import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// 1920s glamour. Geometric gold sunbursts, ink navy, champagne accents.
export default function ArtDeco({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{
          background:
            'linear-gradient(180deg, #0a1a2a 0%, #0e1f33 60%, #0a1a2a 100%)',
          color: '#f5e6b3',
        }}
      >
        {/* Top fan */}
        <Fan className="absolute -top-12 left-1/2 -translate-x-1/2" size={280} />
        {/* Bottom fan */}
        <Fan className="absolute -bottom-12 left-1/2 -translate-x-1/2 rotate-180" size={280} />

        {/* Inner gold border with notched corners */}
        <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]" viewBox="0 0 380 600" preserveAspectRatio="none">
          <g fill="none" stroke="#d4a017" strokeWidth="1.2">
            <path d="M20 4 L 376 4 L 376 596 L 20 596 Z" />
            <path d="M30 14 L 366 14 L 366 586 L 30 586 Z" opacity="0.55" />
          </g>
        </svg>

        {/* Names */}
        <div className="absolute top-[28%] inset-x-0 text-center px-6">
          <div className="text-[10px] tracking-[0.5em] text-[#d4a017] mb-3">— THE GREAT —</div>
          <h1 className="font-display text-[42px] sm:text-[54px] leading-[1.05]">{state.bride}</h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="my-2 tracking-[0.6em] text-[#d4a017]">&amp;</div>
              <h1 className="font-display text-[42px] sm:text-[54px] leading-[1.05]">{state.groom}</h1>
            </>
          )}
        </div>

        {/* Date plate */}
        <div className="absolute top-[60%] inset-x-0 flex justify-center">
          <div className="px-5 py-2 border border-[#d4a017]/70 text-[12px] tracking-[0.25em] uppercase">
            {formatHebrewDate(state.dateISO)}
          </div>
        </div>

        <div className="absolute top-[68%] inset-x-0 text-center px-6 leading-relaxed">
          <div className="text-xs text-[#f5e6b3]/85">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm">{state.venueName}</div>
          <div className="text-xs text-[#f5e6b3]/70">{state.venueAddress}</div>
        </div>

        <div className="absolute bottom-[10%] inset-x-0 text-center px-12">
          <p className="text-[12px] italic text-[#f5e6b3]/85 leading-relaxed">“{state.tagline}”</p>
        </div>
      </div>
    </div>
  );
}

function Fan({ className = '', size = 240 }) {
  const rays = 21;
  return (
    <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`} className={className} aria-hidden="true">
      {Array.from({ length: rays }).map((_, i) => {
        const t = (i / (rays - 1)) * Math.PI;
        const x = size / 2 + Math.cos(t - Math.PI) * (size / 2);
        const y = size / 2 + Math.sin(t - Math.PI) * (size / 2);
        return (
          <line
            key={i}
            x1={size / 2}
            y1={size / 2}
            x2={x}
            y2={y}
            stroke="#d4a017"
            strokeWidth={i % 2 === 0 ? 1.4 : 0.6}
            opacity={i % 2 === 0 ? 0.9 : 0.5}
          />
        );
      })}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.55" />
    </svg>
  );
}
