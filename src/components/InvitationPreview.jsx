import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Countdown from './Countdown';
import { HennaBorder, HennaCorner, Mandala } from './HennaPatterns';
import { THEMES, FONT_PAIRS, EVENT_TYPES } from '../lib/themes';
import { formatHebrewDate } from '../lib/state';

// Renders the live, customizable invitation card.
// All visuals respond to `state` so users can preview changes instantly.
export default function InvitationPreview({ state, compact = false }) {
  const theme = THEMES[state.theme] || THEMES.cosmos;
  const fonts = FONT_PAIRS[state.fontPair] || FONT_PAIRS.classicSerif;
  const ev = EVENT_TYPES[state.eventType] || EVENT_TYPES.wedding;
  const cardRef = useRef(null);
  const showHenna = state.showHennaPatterns || state.eventType === 'henna';

  // 3D tilt on hover/touch
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    };
    const onLeave = () => {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const couple = state.eventType === 'birthday'
    ? state.bride
    : `${state.bride} ${state.eventType === 'wedding' ? '&' : 'ו־'} ${state.groom}`;

  return (
    <div className={`relative w-full flex justify-center ${compact ? '' : 'py-6'}`}>
      <motion.div
        ref={cardRef}
        className="card-3d relative w-full max-w-[460px] aspect-[3/5] rounded-[28px] overflow-hidden ring-soft"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          background:
            `radial-gradient(ellipse at var(--gx,50%) var(--gy,40%), ${theme.accent}22, transparent 55%),
             linear-gradient(180deg, ${theme.bg[0]}, ${theme.bg[1]} 70%, ${theme.bg[2]})`,
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 80px ${theme.accent}26, inset 0 0 0 1px ${theme.accent}55`,
            borderRadius: 28,
          }}
        />

        {/* Mandala behind type for henna */}
        {showHenna && (
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <div className="animate-spinSlow">
              <Mandala color={theme.accent} size={460} />
            </div>
          </div>
        )}

        {/* Corner ornaments */}
        {showHenna ? (
          <>
            <HennaCorner color={theme.accent} className="absolute top-2 left-2" />
            <HennaCorner color={theme.accent} className="absolute top-2 right-2" flip />
            <HennaCorner color={theme.accent} className="absolute bottom-2 left-2" flip />
            <HennaCorner color={theme.accent} className="absolute bottom-2 right-2" />
          </>
        ) : (
          <CelestialCorners color={theme.accent} />
        )}

        {/* Top label */}
        <div className="absolute top-4 inset-x-0 flex justify-center">
          <div
            className="px-3 py-1 text-[10px] tracking-[0.4em] rounded-full"
            style={{ color: theme.accent, border: `1px solid ${theme.accent}55` }}
          >
            {ev.icon} &nbsp; {ev.label.toUpperCase()} &nbsp; {ev.icon}
          </div>
        </div>

        {/* Names */}
        <div className="absolute inset-x-0 top-[18%] text-center px-6">
          {state.eventType !== 'birthday' && state.parentsBride && state.parentsGroom && (
            <div className="text-[11px] sm:text-xs text-gold-50/70 mb-3 tracking-wider">
              {state.parentsBride} <span className="opacity-60">·</span> {state.parentsGroom}
            </div>
          )}

          <h1
            className={`${fonts.display} text-shimmer leading-[1.05] text-[34px] sm:text-[44px] font-bold drop-shadow`}
            style={{ textShadow: `0 0 30px ${theme.accent}55` }}
          >
            {state.bride}
          </h1>
          {state.eventType !== 'birthday' && (
            <>
              <div
                className={`${fonts.script} text-3xl sm:text-4xl my-2`}
                style={{ color: theme.accent }}
              >
                &amp;
              </div>
              <h1
                className={`${fonts.display} text-shimmer leading-[1.05] text-[34px] sm:text-[44px] font-bold`}
                style={{ textShadow: `0 0 30px ${theme.accent2}55` }}
              >
                {state.groom}
              </h1>
            </>
          )}
        </div>

        {/* Tagline */}
        <div className="absolute inset-x-0 top-[55%] text-center px-8">
          <p
            className="text-sm sm:text-base text-gold-50/85 italic leading-relaxed"
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.4)' }}
          >
            “{state.tagline}”
          </p>
        </div>

        {/* Date / time / venue */}
        <div className="absolute inset-x-0 bottom-[26%] text-center px-6">
          <div
            className="text-[12px] sm:text-sm uppercase tracking-[0.3em] mb-1"
            style={{ color: theme.accent }}
          >
            {formatHebrewDate(state.dateISO)}
          </div>
          <div className="text-xs text-gold-50/70">
            קבלת פנים {state.receptionTime} · חופה {state.ceremonyTime}
          </div>
          <div className="mt-2 text-sm text-gold-50/95">{state.venueName}</div>
          <div className="text-xs text-gold-50/60">{state.venueAddress}</div>
        </div>

        {/* Countdown */}
        {state.showCountdown && (
          <div className="absolute inset-x-0 bottom-6">
            <Countdown toISO={state.dateISO} accent={theme.accent} />
          </div>
        )}

        {/* Bottom ornament strip */}
        {showHenna ? (
          <div className="absolute inset-x-0 bottom-0 px-6 pb-2 opacity-90">
            <HennaBorder color={theme.accent} className="w-full h-6" />
          </div>
        ) : (
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
              filter: 'blur(0.6px)',
            }}
          />
        )}

        {/* Specular highlight following cursor */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60"
          style={{
            background:
              `radial-gradient(circle at var(--gx,50%) var(--gy,40%), ${theme.accent}33, transparent 35%)`,
          }}
        />
      </motion.div>
    </div>
  );
}

function CelestialCorners({ color }) {
  return (
    <>
      {[
        'top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3',
      ].map((pos, i) => (
        <svg
          key={i}
          className={`absolute ${pos} w-10 h-10 opacity-80`}
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <g fill="none" stroke={color} strokeWidth="0.8">
            <circle cx="20" cy="20" r="3" />
            <circle cx="20" cy="20" r="9" opacity="0.6" />
            <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z" fill={color} opacity="0.65" />
          </g>
        </svg>
      ))}
    </>
  );
}
