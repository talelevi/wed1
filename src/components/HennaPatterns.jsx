import React from 'react';

// Decorative SVG borders inspired by traditional henna/mehndi.
// Used as ornaments around the invitation card in henna mode.
export function HennaBorder({ color = '#f0a04b', className = '' }) {
  return (
    <svg
      viewBox="0 0 800 80"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none" stroke={color} strokeWidth="1.2">
        <path d="M0 40 Q 50 10 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40" />
        <path d="M0 40 Q 50 70 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40" />
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 100}, 40)`}>
            <circle r="9" />
            <circle r="4" />
            <path d="M0 -18 q 5 9 0 18 q -5 9 0 18" />
            <path d="M-18 0 q 9 -5 18 0 q 9 5 18 0" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function HennaCorner({ color = '#f0a04b', size = 120, className = '', flip = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <g fill="none" stroke={color} strokeWidth="1.2" className="henna-stroke">
        <circle cx="20" cy="20" r="6" />
        <circle cx="20" cy="20" r="11" />
        <path d="M20 20 q 30 5 50 25 q 20 20 25 50" />
        <path d="M20 20 q 25 0 40 15 q 15 15 15 40" />
        <path d="M20 20 q 35 -2 60 18 q 20 20 18 60" />
        <path d="M30 30 q 8 -8 18 0 q 8 8 0 18 q -8 8 -18 0 q -8 -8 0 -18 z" />
        <path d="M55 55 q 8 -8 18 0 q 8 8 0 18 q -8 8 -18 0 q -8 -8 0 -18 z" />
        <path d="M85 85 q 8 -8 18 0 q 8 8 0 18 q -8 8 -18 0 q -8 -8 0 -18 z" />
      </g>
    </svg>
  );
}

export function Mandala({ color = '#f0a04b', size = 220, className = '' }) {
  const petals = 18;
  const elements = [];
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * 360;
    elements.push(
      <g key={i} transform={`rotate(${angle} 60 60)`}>
        <path d="M60 10 q 6 14 0 28 q -6 14 0 28" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="14" r="2" fill={color} />
      </g>
    );
  }
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <g opacity="0.75">
        <circle cx="60" cy="60" r="6" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="60" cy="60" r="14" fill="none" stroke={color} strokeWidth="0.6" />
        <circle cx="60" cy="60" r="24" fill="none" stroke={color} strokeWidth="0.6" />
        <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeWidth="0.6" />
        {elements}
      </g>
    </svg>
  );
}
