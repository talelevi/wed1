import React, { useEffect, useMemo, useRef } from 'react';
import { THEMES } from '../lib/themes';

// A layered, parallax cosmic background that reacts to mouse / device tilt.
// Layers (back-to-front):
//   1) deep gradient (theme colors)
//   2) animated nebula blobs
//   3) starfield (canvas, twinkling)
//   4) ambient motif (aurora ribbons / petals / henna swirls / bubbles)
//   5) subtle grain
export default function CosmicBackground({ themeId = 'cosmos', intensity = 0.75, parallax = 0.6 }) {
  const theme = THEMES[themeId] || THEMES.cosmos;
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      pointer.current.tx = (e.clientX / w - 0.5) * 2;
      pointer.current.ty = (e.clientY / h - 0.5) * 2;
    };
    const handleTilt = (e) => {
      if (e.gamma == null || e.beta == null) return;
      pointer.current.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      pointer.current.ty = Math.max(-1, Math.min(1, e.beta / 45));
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('deviceorientation', handleTilt, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('deviceorientation', handleTilt);
    };
  }, []);

  // Parallax loop (lerp towards pointer)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.05;
      const wrap = wrapRef.current;
      if (wrap) {
        const px = pointer.current.x * 14 * parallax;
        const py = pointer.current.y * 14 * parallax;
        wrap.style.setProperty('--px', `${px}px`);
        wrap.style.setProperty('--py', `${py}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parallax]);

  // Starfield canvas
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const setSize = () => {
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = '100%';
      cvs.style.height = '100%';
      ctx.scale(dpr, dpr);
    };
    setSize();
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      setSize();
    };
    window.addEventListener('resize', onResize);

    const count = Math.floor(140 * intensity) + 60;
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.02 + 0.005,
      d: Math.random() * 0.8 + 0.2, // depth 0..1
      h: Math.random() < 0.07,      // shooting candidate
    }));

    let shoot = null;
    const maybeShoot = () => {
      if (shoot || Math.random() > 0.005) return;
      shoot = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.6,
        vx: -3 - Math.random() * 3,
        vy: 1.4 + Math.random() * 1.5,
        life: 1,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      // Subtle vignette dark overlay (additive on top of gradient)
      // Stars
      for (const s of stars) {
        s.tw += s.sp;
        const a = 0.45 + Math.sin(s.tw) * 0.45;
        const px = pointer.current.x * 6 * s.d;
        const py = pointer.current.y * 6 * s.d;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,238,200,${a.toFixed(3)})`;
        ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Shooting star
      maybeShoot();
      if (shoot) {
        ctx.strokeStyle = `rgba(255,238,200,${shoot.life})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(shoot.x - shoot.vx * 8, shoot.y - shoot.vy * 8);
        ctx.stroke();
        shoot.x += shoot.vx;
        shoot.y += shoot.vy;
        shoot.life -= 0.012;
        if (shoot.life <= 0) shoot = null;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [intensity, themeId]);

  const gradient = useMemo(() => {
    const [a, b, c] = theme.bg;
    return `radial-gradient(ellipse at 30% 20%, ${b} 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, ${c} 0%, transparent 55%),
            linear-gradient(180deg, ${a} 0%, #04020a 100%)`;
  }, [theme]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: gradient }}
    >
      {/* Nebula blobs */}
      <div className="absolute inset-0 cosmic-mask">
        <div
          className="absolute -top-32 -right-32 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-60 animate-nebula"
          style={{
            background: `radial-gradient(circle, ${theme.accent2}55, transparent 60%)`,
            transform: 'translate3d(var(--px,0), var(--py,0), 0)',
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[55vw] h-[55vw] rounded-full blur-3xl opacity-50 animate-nebula"
          style={{
            background: `radial-gradient(circle, ${theme.accent3}55, transparent 60%)`,
            animationDelay: '-6s',
            transform: 'translate3d(calc(var(--px,0)*-1), calc(var(--py,0)*-1), 0)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-[40vw] h-[40vw] -translate-x-1/2 rounded-full blur-3xl opacity-40 animate-nebula"
          style={{
            background: `radial-gradient(circle, ${theme.accent}40, transparent 60%)`,
            animationDelay: '-12s',
          }}
        />
      </div>

      {/* Stars canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Motif layers */}
      {theme.motif === 'aurora' && <AuroraRibbons accent={theme.accent} />}
      {theme.motif === 'petals' && <Petals accent={theme.accent} accent2={theme.accent2} />}
      {theme.motif === 'bubbles' && <Bubbles accent={theme.accent} />}
      {theme.motif === 'henna' && <HennaSwirls accent={theme.accent} />}

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

function AuroraRibbons({ accent }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ar" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="60%" stopColor="#9ad8ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9ad8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M -50 ${200 + i * 120} C 300 ${100 + i * 60}, 700 ${300 - i * 40}, 1300 ${180 + i * 80}`}
          stroke="url(#ar)"
          strokeWidth={60 - i * 12}
          fill="none"
          opacity={0.55 - i * 0.12}
          style={{ filter: 'blur(14px)' }}
        >
          <animate
            attributeName="d"
            dur={`${14 + i * 4}s`}
            repeatCount="indefinite"
            values={`
              M -50 ${200 + i * 120} C 300 ${100 + i * 60}, 700 ${300 - i * 40}, 1300 ${180 + i * 80};
              M -50 ${260 + i * 120} C 300 ${180 + i * 60}, 700 ${220 - i * 40}, 1300 ${260 + i * 80};
              M -50 ${200 + i * 120} C 300 ${100 + i * 60}, 700 ${300 - i * 40}, 1300 ${180 + i * 80}
            `}
          />
        </path>
      ))}
    </svg>
  );
}

function Petals({ accent }) {
  const items = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const delay = -Math.random() * 12;
        const dur = 12 + Math.random() * 10;
        const size = 8 + Math.random() * 10;
        return (
          <span
            key={i}
            className="absolute block rounded-full opacity-70"
            style={{
              left: `${left}%`,
              top: '-5%',
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, #ffd1d8, ${accent})`,
              animation: `fall ${dur}s linear ${delay}s infinite`,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.9; }
          100% { transform: translateY(110vh) translateX(40px) rotate(360deg); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

function Bubbles({ accent }) {
  const items = Array.from({ length: 22 });
  return (
    <div className="absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const delay = -Math.random() * 10;
        const dur = 10 + Math.random() * 12;
        const size = 6 + Math.random() * 18;
        return (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              left: `${left}%`,
              bottom: '-10%',
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, #ffffff80, ${accent}22)`,
              boxShadow: `0 0 12px ${accent}33`,
              animation: `rise ${dur}s ease-in ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes rise {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: 0.85; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function HennaSwirls({ accent }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <g stroke={accent} strokeWidth="1.2" fill="none" className="henna-stroke">
        <path d="M 100 400 Q 300 100, 600 400 T 1100 400" />
        <path d="M 50 500 Q 250 700, 600 500 T 1150 500" />
        <circle cx="200" cy="200" r="80" />
        <circle cx="200" cy="200" r="60" />
        <circle cx="1000" cy="600" r="100" />
        <circle cx="1000" cy="600" r="70" />
        <path d="M 600 100 q 40 60 0 120 q -40 60 0 120 q 40 60 0 120" />
      </g>
    </svg>
  );
}
