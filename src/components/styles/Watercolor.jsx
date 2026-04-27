import React from 'react';
import { motion } from 'framer-motion';
import { formatHebrewDate } from '../../lib/state';

// Soft watercolor washes that drift behind elegant script names.
export default function Watercolor({ state }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div
        className="relative w-full max-w-[460px] aspect-[3/5] rounded-sm overflow-hidden ring-soft"
        style={{ background: '#fef6f3', color: '#3a3340' }}
      >
        {/* Watercolor blobs */}
        <Blob color="#e7a3a3" className="-top-10 -left-10 w-[55%] aspect-square" delay={0} />
        <Blob color="#5a7a8a" className="top-[35%] -right-10 w-[60%] aspect-square" delay={1.4} />
        <Blob color="#d4a017" className="bottom-[-12%] left-[10%] w-[45%] aspect-square" delay={2.6} opacity={0.35} />
        <Blob color="#9aa6c8" className="top-[10%] right-[20%] w-[30%] aspect-square" delay={0.8} opacity={0.4} />

        <div className="absolute top-[14%] inset-x-0 text-center">
          <div className="font-script text-2xl text-[#5a7a8a]">— save the date —</div>
        </div>

        <div className="absolute top-[28%] inset-x-0 text-center px-6">
          <div className="text-[11px] tracking-[0.3em] text-[#5a7a8a] mb-3">
            {state.parentsBride} · {state.parentsGroom}
          </div>
          <h1 className="font-script text-[58px] sm:text-[72px] leading-[1] text-[#3a3340]">
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div className="font-script text-3xl text-[#e7a3a3] my-1">and</div>
              <h1 className="font-script text-[58px] sm:text-[72px] leading-[1] text-[#3a3340]">
                {state.groom}
              </h1>
            </>
          )}
        </div>

        <div className="absolute top-[68%] inset-x-0 text-center px-8 leading-relaxed">
          <div className="text-[12px] tracking-[0.2em] uppercase text-[#5a7a8a] mb-1">
            {formatHebrewDate(state.dateISO)}
          </div>
          <div className="text-xs opacity-75">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm">{state.venueName}</div>
          <div className="text-xs opacity-65">{state.venueAddress}</div>
        </div>

        <div className="absolute bottom-[8%] inset-x-0 text-center px-12">
          <p className="text-xs italic opacity-75 leading-relaxed">“{state.tagline}”</p>
        </div>
      </div>
    </div>
  );
}

function Blob({ color, className = '', delay = 0, opacity = 0.55 }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
        filter: 'blur(20px)',
        mixBlendMode: 'multiply',
        opacity,
      }}
      animate={{ x: [0, 10, -6, 0], y: [0, -8, 6, 0], scale: [1, 1.05, 0.97, 1] }}
      transition={{ duration: 14, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}
