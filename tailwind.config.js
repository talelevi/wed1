/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        hebrew: ['"Heebo"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0a0612',
        gold: {
          50: '#fdf8ee',
          100: '#f8ecc8',
          300: '#e9c97a',
          500: '#c79a3a',
          700: '#8a6620',
        },
        rose: {
          glow: '#ff6fa3',
        },
        henna: {
          deep: '#5b1a1a',
          spice: '#a8431a',
          saffron: '#f0a04b',
          gold: '#d4a017',
        },
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.4)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-12px,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        nebula: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(40px,-30px,0) scale(1.08)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,180,120,0.6)' },
          '70%': { boxShadow: '0 0 0 28px rgba(255,180,120,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,180,120,0)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        twinkle: 'twinkle 3.5s ease-in-out infinite',
        drift: 'drift 7s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        nebula: 'nebula 18s ease-in-out infinite',
        pulseRing: 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        spinSlow: 'spinSlow 60s linear infinite',
      },
    },
  },
  plugins: [],
};
