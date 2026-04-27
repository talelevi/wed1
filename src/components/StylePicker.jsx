import React from 'react';
import { motion } from 'framer-motion';
import { STYLE_LIST } from '../lib/styles';
import { REGISTRY } from './styles';

// Gallery of style thumbnails. Clicking a card switches `state.style`.
export default function StylePicker({ state, setState }) {
  const setStyle = (id) => setState((s) => ({ ...s, style: id }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {STYLE_LIST.map((s) => (
        <StyleCard
          key={s.id}
          style={s}
          state={state}
          active={state.style === s.id}
          onSelect={() => setStyle(s.id)}
        />
      ))}
    </div>
  );
}

function StyleCard({ style, state, active, onSelect }) {
  const Comp = REGISTRY[style.id];
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative rounded-2xl overflow-hidden text-right border transition ${
        active
          ? 'border-gold-300 ring-2 ring-gold-300/60'
          : 'border-white/10 hover:border-white/25'
      }`}
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Live thumbnail — render the actual style at small scale */}
      <div className="relative w-full aspect-[3/5] overflow-hidden pointer-events-none">
        <div
          style={{
            transform: 'scale(0.45)',
            transformOrigin: 'top center',
            width: '222%',
            marginLeft: '-61%',
          }}
        >
          {Comp && <Comp state={state} />}
        </div>
      </div>

      {/* Footer label */}
      <div className="absolute bottom-0 inset-x-0 px-3 py-2 backdrop-blur-md bg-black/45 text-right">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-50/70">
            {style.family === 'animated' ? '✦ animated' : '◷ static'}
          </span>
          <span className="font-semibold text-sm text-gold-50">{style.labelHe}</span>
        </div>
        <div className="text-[10px] text-gold-50/60 truncate">{style.description}</div>
      </div>

      {/* Color swatch */}
      <div className="absolute top-2 right-2 flex gap-1">
        {style.swatch.map((c, i) => (
          <span
            key={i}
            className="block w-3 h-3 rounded-full ring-1 ring-white/30"
            style={{ background: c }}
          />
        ))}
      </div>

      {active && (
        <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-gold-300 text-ink font-bold">
          ✓ נבחר
        </div>
      )}
    </motion.button>
  );
}
