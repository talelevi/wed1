import React from 'react';
import { EucalyptusBranch, OliveBranch, WhitePeony } from '../illustrations/Botanicals';
import { formatHebrewDate } from '../../lib/state';

// "Wreath" — circular floral arrangement around the names. Same hand-drawn
// vocabulary as Greenery but composed as a frame instead of corners.
export default function Wreath({ state, compact = false }) {
  return (
    <div className={`w-full flex justify-center ${compact ? '' : 'py-6'}`}>
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-[28px] overflow-hidden ring-soft"
        style={{
          background: 'linear-gradient(180deg, #fdfaf0 0%, #f3ecd8 100%)',
          color: '#5a6a52',
        }}
      >
        {/* Wreath of branches around the centre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[78%] aspect-square">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className="absolute" style={{ top: '-8%', left: '50%', transform: 'translateX(-50%)' }}>
                  <EucalyptusBranch size={170} rotation={0} density={8} flip={i % 2 === 1} />
                </div>
              </div>
            ))}
            <div className="absolute" style={{ top: '6%', left: '0%' }}>
              <WhitePeony size={70} seed={1} />
            </div>
            <div className="absolute" style={{ bottom: '6%', right: '0%' }}>
              <WhitePeony size={70} seed={5} />
            </div>
            <div className="absolute" style={{ top: '40%', right: '-4%' }}>
              <WhitePeony size={48} seed={9} />
            </div>
            <div className="absolute" style={{ bottom: '40%', left: '-4%' }}>
              <WhitePeony size={48} seed={13} />
            </div>
          </div>
        </div>

        {/* Center text */}
        <div className="relative h-full w-full flex flex-col items-center justify-center px-12 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#7a8e6c] mb-3">
            {state.eventType === 'henna' ? 'henna night' : 'save the date'}
          </p>
          <h1
            className="font-script text-[#4a5a42] leading-[0.95]"
            style={{ fontSize: 'clamp(34px, 11vw, 54px)' }}
          >
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="font-display text-[#7a8e6c] my-0.5" style={{ fontSize: 'clamp(22px, 6vw, 30px)' }}>
                &amp;
              </div>
              <h1
                className="font-script text-[#4a5a42] leading-[0.95]"
                style={{ fontSize: 'clamp(34px, 11vw, 54px)' }}
              >
                {state.groom}
              </h1>
            </>
          )}
          <div className="my-3 h-px w-12 bg-[#9aab8a]" />
          <p className="text-sm text-[#5a6a52] tracking-wide">{formatHebrewDate(state.dateISO)}</p>
          <p className="text-xs text-[#6a7a5d]/85 mt-1">
            {state.venueName} · {state.ceremonyTime}
          </p>
        </div>
      </div>
    </div>
  );
}
