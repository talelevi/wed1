import React from 'react';
import { FloralCorner, WatercolorWash } from '../illustrations/Botanicals';
import { formatHebrewDate } from '../../lib/state';

// "Greenery" — eucalyptus + white peonies on cream paper.
// Faithful re-creation of the classical Israeli floral wedding invitation.
export default function Greenery({ state, compact = false }) {
  const d = new Date(state.dateISO);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const time = state.ceremonyTime || `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  return (
    <div className={`w-full flex justify-center ${compact ? '' : 'py-6'}`}>
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-[28px] overflow-hidden ring-soft"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #fdfaf0 0%, #f5f0df 60%, #ece5cf 100%)',
          color: '#5a6a52',
          fontFeatureSettings: '"liga" 1',
        }}
      >
        {/* Watercolor washes — top-right and bottom-left */}
        <div className="absolute -top-10 -right-10 opacity-90 pointer-events-none">
          <WatercolorWash size={220} color="#c8d2bb" opacity={0.55} />
        </div>
        <div className="absolute -bottom-10 -left-10 opacity-90 pointer-events-none">
          <WatercolorWash size={220} color="#c8d2bb" opacity={0.5} />
        </div>

        {/* Floral arrangements — top-left and bottom-right */}
        <div className="absolute -top-3 -left-3 pointer-events-none">
          <FloralCorner orientation="tl" size={210} />
        </div>
        <div className="absolute -bottom-3 -right-3 pointer-events-none">
          <FloralCorner orientation="br" size={220} />
        </div>

        {/* Inner content column */}
        <div className="relative h-full w-full flex flex-col items-center justify-between px-8 py-12 text-center">
          {/* Top intro + date */}
          <div className="space-y-3 mt-6">
            <p className="text-[13px] sm:text-sm leading-relaxed text-[#6a7a5d]">
              {state.intro || 'אנו שמחים להזמינכם לחגוג עמנו'}
              <br />
              {state.eventType === 'henna' ? 'את ערב החינה שלנו'
                : state.eventType === 'engagement' ? 'את אירוסינו'
                : 'את יום נישואינו'}
            </p>
            <div
              className="font-display tracking-wider text-[#7a8e6c]"
              dir="ltr"
              style={{ fontSize: 'clamp(28px, 8vw, 38px)', letterSpacing: '0.08em' }}
            >
              {dd} <span className="opacity-50">|</span> {mm} <span className="opacity-50">|</span> {yyyy}
            </div>
            {state.hebrewDateLabel && (
              <p className="text-[12px] sm:text-sm text-[#6a7a5d] tracking-wide">
                {state.hebrewDateLabel}
              </p>
            )}
            <Divider />
          </div>

          {/* Names */}
          <div className="my-2">
            <h1 className="font-script text-[#4a5a42] leading-[0.9]"
                style={{ fontSize: 'clamp(40px, 13vw, 64px)' }}>
              {state.bride}
            </h1>
            {state.eventType !== 'birthday' && (
              <>
                <div className="font-display text-[#7a8e6c] my-1"
                     style={{ fontSize: 'clamp(28px, 8vw, 40px)' }}>&amp;</div>
                <h1 className="font-script text-[#4a5a42] leading-[0.9]"
                    style={{ fontSize: 'clamp(40px, 13vw, 64px)' }}>
                  {state.groom}
                </h1>
              </>
            )}
          </div>

          {/* Tagline + venue */}
          <div className="space-y-3 mb-2">
            <p className="text-[12px] sm:text-sm leading-relaxed text-[#6a7a5d] max-w-[78%] mx-auto">
              {state.tagline || 'נשמח לראותכם חוגגים איתנו יום מלא באהבה ואושר'}
            </p>
            <LeafDivider />
            <div className="flex items-center justify-center gap-3 text-[#5a6a52]" dir="rtl">
              <span className="text-sm">{state.venueName}</span>
              <span className="opacity-40">|</span>
              <span className="font-mono text-sm" dir="ltr">{time}</span>
            </div>
            <p className="font-script text-[#7a8e6c] text-xl mt-2">
              {state.closing || 'נשמח לראותכם!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 mt-1" aria-hidden="true">
      <span className="block h-px w-12 bg-[#9aab8a]" />
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M7 11 C 3 8, 1 5, 3.5 3 C 5 2, 6.5 3, 7 4.2 C 7.5 3, 9 2, 10.5 3 C 13 5, 11 8, 7 11 Z"
          fill="#9aab8a"
        />
      </svg>
      <span className="block h-px w-12 bg-[#9aab8a]" />
    </div>
  );
}

function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <span className="block h-px w-14 bg-[#9aab8a]" />
      <svg width="32" height="14" viewBox="0 0 32 14">
        <g fill="none" stroke="#7a8e6c" strokeWidth="0.9" strokeLinecap="round">
          <path d="M16 1 L 16 13" />
          <path d="M16 4 q 6 -1 10 1 q -3 4 -10 1" fill="#9aab8a" stroke="none" />
          <path d="M16 7 q -6 -1 -10 1 q 3 4 10 1" fill="#9aab8a" stroke="none" />
          <path d="M16 10 q 5 0 9 1.6 q -2.5 3 -9 1" fill="#9aab8a" stroke="none" />
        </g>
      </svg>
      <span className="block h-px w-14 bg-[#9aab8a]" />
    </div>
  );
}
