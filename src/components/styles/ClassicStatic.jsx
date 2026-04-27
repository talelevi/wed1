import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// A traditional, paper-feeling invitation. No motion, no parallax — just
// a serene cream card with a gold double border, rule lines and serif type.
// This is the "regular static invitation" requested by users who don't
// want a cosmic experience.
export default function ClassicStatic({ state }) {
  const couple = state.eventType === 'birthday'
    ? state.bride
    : `${state.bride}  &  ${state.groom}`;
  const subtitle =
    state.eventType === 'henna' ? 'הזמנה לערב חינה' :
    state.eventType === 'engagement' ? 'הזמנה לערב אירוסין' :
    state.eventType === 'birthday' ? 'הזמנה ליום הולדת' :
    'הזמנה לחתונה';

  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #fffbe9 0%, #f5ecd9 60%, #ecdfba 100%)',
          color: '#1a1308',
        }}
      >
        {/* Double gold border */}
        <div className="absolute inset-3 border border-[#c9a75a]" />
        <div className="absolute inset-5 border border-[#c9a75a]/60" />

        {/* Top monogram */}
        <div className="absolute top-10 inset-x-0 flex justify-center">
          <Monogram brideInitial={(state.bride || ' ')[0]} groomInitial={(state.groom || ' ')[0]} />
        </div>

        {/* Title */}
        <div className="absolute top-[26%] inset-x-0 text-center px-6">
          <div className="text-[10px] tracking-[0.4em] text-[#7a5a20] mb-3">{subtitle}</div>
          <div className="text-[10px] tracking-[0.3em] text-[#7a5a20]/80">
            {state.parentsBride} <span className="opacity-50 mx-2">·</span> {state.parentsGroom}
          </div>
        </div>

        {/* Names */}
        <div className="absolute top-[36%] inset-x-0 text-center px-6">
          <h1
            className="font-display leading-[1.05] text-[42px] sm:text-[52px]"
            style={{ color: '#1a1308' }}
          >
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="my-2 font-script text-3xl text-[#c9a75a]">&amp;</div>
              <h1
                className="font-display leading-[1.05] text-[42px] sm:text-[52px]"
                style={{ color: '#1a1308' }}
              >
                {state.groom}
              </h1>
            </>
          )}
        </div>

        {/* Rule */}
        <div className="absolute top-[63%] inset-x-12 flex items-center gap-2">
          <span className="flex-1 h-px bg-[#c9a75a]/60" />
          <span className="text-[#c9a75a]">✦</span>
          <span className="flex-1 h-px bg-[#c9a75a]/60" />
        </div>

        {/* Date / time / venue */}
        <div className="absolute top-[66%] inset-x-0 text-center px-6 leading-relaxed">
          <div className="text-[12px] tracking-[0.25em] uppercase text-[#7a5a20] mb-1">
            {formatHebrewDate(state.dateISO)}
          </div>
          <div className="text-xs text-[#5a4318]/85">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm">{state.venueName}</div>
          <div className="text-xs text-[#5a4318]/80">{state.venueAddress}</div>
        </div>

        {/* Tagline (italic) */}
        <div className="absolute bottom-[10%] inset-x-0 text-center px-10">
          <p className="text-[12px] italic text-[#5a4318]/85 leading-relaxed">
            “{state.tagline}”
          </p>
        </div>

        {/* Corner ornaments */}
        {[
          'top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3',
        ].map((p) => (
          <svg key={p} className={`absolute ${p} w-7 h-7`} viewBox="0 0 28 28" aria-hidden="true">
            <g fill="none" stroke="#c9a75a" strokeWidth="0.7">
              <path d="M2 14 Q 14 2, 26 14" />
              <path d="M2 14 Q 14 26, 26 14" />
              <circle cx="14" cy="14" r="2" fill="#c9a75a" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}

function Monogram({ brideInitial, groomInitial }) {
  return (
    <svg width="84" height="56" viewBox="0 0 84 56" aria-hidden="true">
      <g fill="none" stroke="#c9a75a" strokeWidth="0.8">
        <ellipse cx="42" cy="28" rx="38" ry="22" />
        <ellipse cx="42" cy="28" rx="32" ry="17" opacity="0.6" />
      </g>
      <text
        x="26" y="36"
        fontSize="22"
        fontFamily="'Cormorant Garamond', serif"
        fill="#1a1308"
        textAnchor="middle"
      >
        {brideInitial}
      </text>
      <text
        x="58" y="36"
        fontSize="22"
        fontFamily="'Cormorant Garamond', serif"
        fill="#1a1308"
        textAnchor="middle"
      >
        {groomInitial}
      </text>
    </svg>
  );
}
