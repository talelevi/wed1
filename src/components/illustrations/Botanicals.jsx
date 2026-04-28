import React from 'react';

// Hand-drawn watercolor-style illustrations used by the "drawn" invitation
// styles. Each component takes a uid prop so multiple instances on the same
// page don't collide on gradient IDs. All paths are coordinate-based, no
// raster art — invitations stay crisp at any zoom and any export size.

let _idSeed = 0;
const nextId = (prefix) => `${prefix}-${++_idSeed}`;

// ─── Eucalyptus branch ──────────────────────────────────────────
// Curved stem with paired round-to-oval leaves alternating along it.
// Direction prop flips the curve.
export function EucalyptusBranch({
  size = 180,
  rotation = 0,
  flip = false,
  density = 9,
  hue = 'sage',
}) {
  const palette = HUES[hue] || HUES.sage;
  const id = React.useMemo(() => nextId('euc'), []);
  const leaves = [];
  for (let i = 0; i < density; i++) {
    const t = i / (density - 1); // 0..1 along stem
    // Stem path: cubic from (90,170) to (90,10) bowed left
    const sx = bezierX(0.6, 0.3, 0.7, 0.4, t) * 90 + 30;
    const sy = 170 - 160 * t;
    const angle = -22 + (i % 2 === 0 ? -45 : 45) + Math.sin(i) * 8;
    const len = 18 + (i % 3) * 3 + (1 - Math.abs(t - 0.5)) * 5;
    const wid = 11 + (i % 2);
    const fill = i % 2 === 0 ? palette.leaf : palette.leafLight;
    leaves.push(
      <g key={i} transform={`translate(${sx} ${sy}) rotate(${angle})`}>
        <ellipse cx={len * 0.55} cy="0" rx={len} ry={wid} fill={fill} opacity="0.92" />
        <path d={`M 0 0 L ${len * 1.4} 0`} stroke={palette.stem} strokeWidth="0.6" opacity="0.6" />
      </g>
    );
    // mirror leaf on opposite side
    const angle2 = -angle - 180 + (Math.sin(i + 1) * 6);
    const fill2 = i % 2 === 1 ? palette.leaf : palette.leafLight;
    leaves.push(
      <g key={`m${i}`} transform={`translate(${sx} ${sy}) rotate(${angle2})`}>
        <ellipse cx={len * 0.55} cy="0" rx={len} ry={wid} fill={fill2} opacity="0.85" />
      </g>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      style={{ transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={palette.stem} />
          <stop offset="100%" stopColor={palette.stemDark} />
        </linearGradient>
      </defs>
      <path
        d="M 90 170 C 50 130, 60 80, 90 10"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {leaves}
    </svg>
  );
}

// ─── Olive branch ───────────────────────────────────────────────
// Narrower, longer leaves with sparser spacing — calmer than eucalyptus.
export function OliveBranch({ size = 180, rotation = 0, flip = false, density = 11, hue = 'olive' }) {
  const palette = HUES[hue] || HUES.olive;
  const leaves = [];
  for (let i = 0; i < density; i++) {
    const t = i / (density - 1);
    const sx = 90 - 8 * Math.sin(t * Math.PI * 1.4);
    const sy = 170 - 160 * t;
    const baseAngle = (i % 2 === 0 ? -50 : 50) + (Math.sin(i * 1.3) * 10);
    const len = 22 + (i % 4) * 2;
    const wid = 4.5;
    leaves.push(
      <g key={i} transform={`translate(${sx} ${sy}) rotate(${baseAngle})`}>
        <ellipse
          cx={len * 0.5}
          cy="0"
          rx={len}
          ry={wid}
          fill={i % 2 === 0 ? palette.leaf : palette.leafLight}
          opacity="0.9"
        />
      </g>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      style={{ transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}` }}
      aria-hidden="true"
    >
      <path
        d="M 90 170 C 70 130, 100 80, 90 10"
        fill="none"
        stroke={palette.stem}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves}
    </svg>
  );
}

// ─── White peony / rose ─────────────────────────────────────────
// Layered cream petals over a golden center. Slight asymmetry per
// instance via the seed prop.
export function WhitePeony({ size = 130, seed = 0, hue = 'cream' }) {
  const palette = HUES[hue] || HUES.cream;
  const id = React.useMemo(() => nextId('peony'), []);
  const idC = React.useMemo(() => nextId('peony-c'), []);
  const rng = mulberry32(seed * 9301 + 49297);
  const layers = [
    { count: 9, rx: 26, ry: 20, dist: 24, op: 0.85 },
    { count: 7, rx: 21, ry: 16, dist: 18, op: 0.92 },
    { count: 6, rx: 15, ry: 12, dist: 12, op: 0.97 },
    { count: 5, rx: 9,  ry: 8,  dist: 6,  op: 1.00 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0%"  stopColor={palette.petalLight} />
          <stop offset="55%" stopColor={palette.petal} />
          <stop offset="100%" stopColor={palette.petalShade} />
        </radialGradient>
        <radialGradient id={idC} cx="50%" cy="50%" r="55%">
          <stop offset="0%"  stopColor={palette.centerLight} />
          <stop offset="100%" stopColor={palette.centerDark} />
        </radialGradient>
      </defs>
      {layers.map((layer, li) => {
        const els = [];
        for (let i = 0; i < layer.count; i++) {
          const baseAngle = (i / layer.count) * 360 + li * 22;
          const jitter = (rng() - 0.5) * 14;
          const angle = baseAngle + jitter;
          const rJitter = 1 + (rng() - 0.5) * 0.18;
          els.push(
            <ellipse
              key={`${li}-${i}`}
              cx="65"
              cy="65"
              rx={layer.rx * rJitter}
              ry={layer.ry * rJitter}
              fill={`url(#${id})`}
              opacity={layer.op}
              stroke={palette.outline}
              strokeWidth="0.3"
              transform={`rotate(${angle} 65 65) translate(0 -${layer.dist})`}
            />
          );
        }
        return <g key={li}>{els}</g>;
      })}
      <circle cx="65" cy="65" r="6.5" fill={`url(#${idC})`} />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * 360;
        return (
          <line
            key={i}
            x1="65"
            y1="65"
            x2={65 + Math.cos((a * Math.PI) / 180) * 9}
            y2={65 + Math.sin((a * Math.PI) / 180) * 9}
            stroke={palette.centerDark}
            strokeWidth="0.8"
            opacity="0.55"
          />
        );
      })}
    </svg>
  );
}

// ─── Wildflower (small, multi-color) ────────────────────────────
export function Wildflower({ size = 80, color = '#d6a3b8', seed = 0 }) {
  const rng = mulberry32(seed * 31 + 7);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * 360 + rng() * 10;
        return (
          <ellipse
            key={i}
            cx="40"
            cy="40"
            rx="13"
            ry="9"
            fill={color}
            opacity="0.85"
            transform={`rotate(${a} 40 40) translate(0 -10)`}
          />
        );
      })}
      <circle cx="40" cy="40" r="4.5" fill="#d4b15c" />
    </svg>
  );
}

// ─── Watercolor wash ────────────────────────────────────────────
export function WatercolorWash({ size = 240, color = '#cbd6c0', opacity = 0.6 }) {
  const id = React.useMemo(() => nextId('wash'), []);
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0%"  stopColor={color} stopOpacity={opacity} />
          <stop offset="60%" stopColor={color} stopOpacity={opacity * 0.6} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path
        d="M 60 30 C 110 10, 200 30, 215 90 C 230 160, 170 200, 110 200 C 50 200, 10 150, 30 90 C 35 60, 50 40, 60 30 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

// ─── Composed corner arrangement ────────────────────────────────
// A hand-tuned bouquet that combines a peony, eucalyptus, olive
// and a tiny filler bud. Pass orientation = "tl" | "tr" | "bl" | "br".
export function FloralCorner({ size = 240, orientation = 'tl' }) {
  const flipX = orientation === 'tr' || orientation === 'br';
  const flipY = orientation === 'bl' || orientation === 'br';
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`,
        position: 'relative',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <div style={{ position: 'absolute', top: -size * 0.15, left: -size * 0.15 }}>
        <EucalyptusBranch size={size * 1.05} rotation={-25} density={10} />
      </div>
      <div style={{ position: 'absolute', top: size * 0.05, left: size * 0.18 }}>
        <OliveBranch size={size * 0.85} rotation={-45} density={9} />
      </div>
      <div style={{ position: 'absolute', top: size * 0.3, left: size * 0.05 }}>
        <WhitePeony size={size * 0.55} seed={orientation.charCodeAt(0)} />
      </div>
      <div style={{ position: 'absolute', top: size * 0.55, left: size * 0.32 }}>
        <WhitePeony size={size * 0.32} seed={orientation.charCodeAt(0) + 3} />
      </div>
    </div>
  );
}

// ─── Color palettes ─────────────────────────────────────────────
const HUES = {
  sage: {
    leaf: '#9fb59a',
    leafLight: '#bfd1b4',
    stem: '#7d937a',
    stemDark: '#5a7058',
  },
  olive: {
    leaf: '#7e9268',
    leafLight: '#a3b88a',
    stem: '#65794f',
    stemDark: '#4d5e3a',
  },
  dusty: {
    leaf: '#8a9c83',
    leafLight: '#b4c2a8',
    stem: '#6d7e64',
    stemDark: '#52624a',
  },
  cream: {
    petal: '#f7f1df',
    petalLight: '#fffefa',
    petalShade: '#d8d6c2',
    centerLight: '#f0d683',
    centerDark: '#a48b3a',
    outline: '#b8b8a4',
  },
  blush: {
    petal: '#f5e0d6',
    petalLight: '#fff5ee',
    petalShade: '#dcc1b3',
    centerLight: '#f0d683',
    centerDark: '#a48b3a',
    outline: '#c2a89c',
  },
};

// Bezier helper — value of cubic bezier at t for a single coordinate.
function bezierX(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

// Tiny seedable RNG so peony asymmetry is stable across renders.
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
