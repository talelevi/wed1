import React from 'react';
import { OliveBranch } from '../illustrations/Botanicals';
import { formatHebrewDate } from '../../lib/state';

// "Olive" — sparse, minimal. A single curved olive branch arches across
// the top of the card; everything else is breathing room.
export default function OliveMinimal({ state, compact = false }) {
  return (
    <div className={`w-full flex justify-center ${compact ? '' : 'py-6'}`}>
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-[28px] overflow-hidden ring-soft"
        style={{
          background: 'linear-gradient(180deg, #fbf8ee 0%, #f1ead4 100%)',
          color: '#3f4c36',
        }}
      >
        {/* Top arching branch */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div style={{ transform: 'rotate(90deg)' }}>
            <OliveBranch size={420} density={14} hue="olive" />
          </div>
        </div>

        {/* Bottom mirror */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div style={{ transform: 'rotate(-90deg)' }}>
            <OliveBranch size={420} density={14} hue="olive" />
          </div>
        </div>

        <div className="relative h-full w-full flex flex-col items-center justify-center px-10 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#65794f] mb-4">
            {state.parentsBride} · {state.parentsGroom}
          </p>
          <h1
            className="font-display text-[#2f3a28] leading-[1.05]"
            style={{ fontSize: 'clamp(38px, 12vw, 56px)' }}
          >
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="font-script text-[#65794f] my-1" style={{ fontSize: 'clamp(22px, 6vw, 30px)' }}>
                &amp;
              </div>
              <h1
                className="font-display text-[#2f3a28] leading-[1.05]"
                style={{ fontSize: 'clamp(38px, 12vw, 56px)' }}
              >
                {state.groom}
              </h1>
            </>
          )}

          <div className="mt-5 mb-3 px-4 py-1 border-y border-[#65794f]/40">
            <p className="text-sm tracking-widest text-[#3f4c36]">
              {formatHebrewDate(state.dateISO)}
            </p>
          </div>

          <p className="text-xs italic text-[#3f4c36]/85 max-w-[80%] leading-relaxed">
            {state.tagline || '“אהבה ארוכה כענפי הזית — שורשים עמוקים, צל לדורות.”'}
          </p>

          <div className="mt-5 text-xs text-[#3f4c36]/85">
            <div>{state.venueName} · {state.venueAddress}</div>
            <div className="mt-1">קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
