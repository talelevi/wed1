import React from 'react';
import { formatHebrewDate } from '../../lib/state';

// Soft sage/cream paper with hand-drawn botanical sprigs.
export default function Botanical({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #faf6ec 0%, #efeadb 60%, #e2dcc6 100%)',
          color: '#2a3a2a',
        }}
      >
        <Sprig className="absolute -top-2 -left-3 w-40 h-40 opacity-90" rotation={-20} />
        <Sprig className="absolute -top-2 -right-3 w-40 h-40 opacity-90" rotation={200} flip />
        <Sprig className="absolute -bottom-2 -left-3 w-40 h-40 opacity-80" rotation={140} />
        <Sprig className="absolute -bottom-2 -right-3 w-40 h-40 opacity-80" rotation={40} flip />

        <div className="absolute top-[12%] inset-x-0 text-center">
          <div className="font-script text-3xl text-[#5a7a4a]">save the date</div>
        </div>

        <div className="absolute top-[28%] inset-x-0 text-center px-8">
          <div className="text-[10px] tracking-[0.35em] text-[#5a7a4a] mb-3">
            {state.parentsBride} · {state.parentsGroom}
          </div>
          <h1 className="font-display text-[40px] sm:text-[48px] leading-[1.05] text-[#2a3a2a]">
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="font-script text-3xl text-[#9a6f3f] my-1">&amp;</div>
              <h1 className="font-display text-[40px] sm:text-[48px] leading-[1.05] text-[#2a3a2a]">
                {state.groom}
              </h1>
            </>
          )}
        </div>

        <div className="absolute top-[60%] inset-x-12 flex items-center gap-2">
          <span className="flex-1 h-px bg-[#5a7a4a]/40" />
          <span className="text-[#5a7a4a]">❀</span>
          <span className="flex-1 h-px bg-[#5a7a4a]/40" />
        </div>

        <div className="absolute top-[64%] inset-x-0 text-center px-8 leading-relaxed">
          <div className="text-[12px] tracking-[0.2em] uppercase text-[#5a7a4a] mb-1">
            {formatHebrewDate(state.dateISO)}
          </div>
          <div className="text-xs text-[#3a4a3a]/85">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm">{state.venueName}</div>
          <div className="text-xs text-[#3a4a3a]/80">{state.venueAddress}</div>
        </div>

        <div className="absolute bottom-[8%] inset-x-0 text-center px-10">
          <p className="text-xs italic text-[#3a4a3a]/85 leading-relaxed">“{state.tagline}”</p>
        </div>
      </div>
    </div>
  );
}

function Sprig({ className, rotation = 0, flip = false }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}` }}
      aria-hidden="true"
    >
      <g fill="none" stroke="#5a7a4a" strokeWidth="1.1" strokeLinecap="round">
        <path d="M60 110 C 60 80, 40 50, 60 20" />
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 100 - i * 11;
          const len = 12 + (i % 3) * 4;
          return (
            <g key={i}>
              <path d={`M60 ${y} q -${len} -4 -${len + 4} -10`} />
              <path d={`M60 ${y - 3} q ${len} -4 ${len + 4} -10`} />
              <ellipse cx={60 - len - 6} cy={y - 12} rx="6" ry="3" fill="#7a9a5a" stroke="none" opacity="0.6" />
              <ellipse cx={60 + len + 6} cy={y - 13} rx="6" ry="3" fill="#7a9a5a" stroke="none" opacity="0.6" />
            </g>
          );
        })}
        <circle cx="60" cy="20" r="3" fill="#9a6f3f" stroke="none" />
      </g>
    </svg>
  );
}
