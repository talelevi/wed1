import React from 'react';
import { Wildflower, OliveBranch, EucalyptusBranch } from '../illustrations/Botanicals';
import { formatHebrewDate } from '../../lib/state';

// "Wildflowers" — colourful tossed bouquet with mixed pinks, lavenders
// and greens. Looser, more romantic than Greenery.
export default function Wildflowers({ state, compact = false }) {
  return (
    <div className={`w-full flex justify-center ${compact ? '' : 'py-6'}`}>
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-[28px] overflow-hidden ring-soft"
        style={{
          background:
            'radial-gradient(ellipse at 30% 0%, #fff8f4 0%, #f7ecde 60%, #e7d6c0 100%)',
          color: '#5a4a40',
        }}
      >
        {/* Top-left bouquet */}
        <div className="absolute -top-2 -left-4 pointer-events-none">
          <EucalyptusBranch size={170} rotation={-20} density={9} hue="dusty" />
        </div>
        <div className="absolute top-2 left-6 pointer-events-none">
          <Wildflower size={70} color="#d6a3b8" seed={1} />
        </div>
        <div className="absolute top-12 left-20 pointer-events-none">
          <Wildflower size={48} color="#c8b2d8" seed={2} />
        </div>
        <div className="absolute top-28 left-2 pointer-events-none">
          <Wildflower size={42} color="#e8c19b" seed={3} />
        </div>

        {/* Bottom-right bouquet */}
        <div className="absolute -bottom-2 -right-4 pointer-events-none">
          <OliveBranch size={170} rotation={160} density={11} hue="olive" />
        </div>
        <div className="absolute bottom-4 right-8 pointer-events-none">
          <Wildflower size={64} color="#d6a3b8" seed={4} />
        </div>
        <div className="absolute bottom-16 right-20 pointer-events-none">
          <Wildflower size={42} color="#c8b2d8" seed={5} />
        </div>

        <div className="relative h-full w-full flex flex-col items-center justify-center px-10 text-center">
          <p className="font-script text-3xl text-[#a87a8b] mb-2">save the date</p>
          <h1
            className="font-script text-[#5a4a40] leading-[0.95]"
            style={{ fontSize: 'clamp(40px, 12vw, 60px)' }}
          >
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <p className="font-script text-2xl text-[#a87a8b] my-1">and</p>
              <h1
                className="font-script text-[#5a4a40] leading-[0.95]"
                style={{ fontSize: 'clamp(40px, 12vw, 60px)' }}
              >
                {state.groom}
              </h1>
            </>
          )}

          <div className="my-4 flex items-center gap-3">
            <span className="block h-px w-12 bg-[#a87a8b]/60" />
            <span className="text-[#a87a8b]">❀</span>
            <span className="block h-px w-12 bg-[#a87a8b]/60" />
          </div>

          <p className="text-sm tracking-wide text-[#5a4a40]">{formatHebrewDate(state.dateISO)}</p>
          <p className="text-xs text-[#5a4a40]/80 mt-1">
            {state.venueName} · {state.venueAddress}
          </p>
          <p className="text-xs text-[#5a4a40]/70 mt-1">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </p>
          <p className="text-xs italic text-[#5a4a40]/85 mt-3 max-w-[78%]">
            “{state.tagline}”
          </p>
        </div>
      </div>
    </div>
  );
}
