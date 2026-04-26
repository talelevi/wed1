import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CosmicBackground from './components/CosmicBackground';
import InvitationPreview from './components/InvitationPreview';
import Builder from './components/Builder';
import ShareBar from './components/ShareBar';
import RsvpPanel from './components/RsvpPanel';
import {
  DEFAULT_STATE,
  readStateFromUrl,
  writeStateToUrl,
  loadFromStorage,
  saveToStorage,
  buildShareUrl,
} from './lib/state';
import { THEMES } from './lib/themes';

const TAGLINES = [
  'בליל אחד, מתחת לאותו ירח, חיינו נחשפים',
  'התחלה חדשה שנכתבת בשמיים',
  'שני כוכבים שנפגשו בדיוק במקום הנכון',
  'תחת חופת הכוכבים, נשבעים לאהוב',
  'הסיפור שלנו רק התחיל — ואתם חלק ממנו',
];

export default function App() {
  const [state, setState] = useState(() => {
    return readStateFromUrl() || loadFromStorage() || DEFAULT_STATE;
  });
  const [mode, setMode] = useState('builder'); // builder | invitation | guest
  const [intro, setIntro] = useState(true);

  // Persist + sync URL hash on every change.
  useEffect(() => {
    saveToStorage(state);
    const h = setTimeout(() => writeStateToUrl(state), 200);
    return () => clearTimeout(h);
  }, [state]);

  // Auto guest mode if URL contained an invitation token (someone opened a share link).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromHash = readStateFromUrl();
    if (fromHash) setMode('guest');
  }, []);

  // Skip the intro after a few seconds, or on click.
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const url = useMemo(() => buildShareUrl(state), [state]);

  const onReset = () => setState({ ...DEFAULT_STATE });
  const onRandomize = () => {
    const themes = Object.keys(THEMES);
    const newTheme = themes[Math.floor(Math.random() * themes.length)];
    setState((s) => ({
      ...s,
      theme: newTheme,
      tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
      intensity: 0.5 + Math.random() * 0.5,
      parallax: 0.3 + Math.random() * 0.7,
    }));
  };

  return (
    <>
      <CosmicBackground themeId={state.theme} intensity={state.intensity} parallax={state.parallax} />

      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setIntro(false)}
          >
            <div className="text-center">
              <motion.h1
                className="text-shimmer font-display text-5xl sm:text-7xl tracking-widest"
                initial={{ letterSpacing: '0.5em', opacity: 0 }}
                animate={{ letterSpacing: '0.18em', opacity: 1 }}
                transition={{ duration: 1.2 }}
              >
                LUMINARA
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gold-50/70 tracking-[0.4em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                INVITATIONS · NOT OF THIS WORLD
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between glass">
        <div className="flex items-center gap-2">
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-shimmer text-lg">Luminara</div>
            <div className="text-[10px] tracking-[0.3em] text-gold-50/60">בילדר הזמנות קוסמי</div>
          </div>
        </div>
        <nav className="flex gap-1.5">
          <TabBtn active={mode === 'builder'} onClick={() => setMode('builder')}>בילדר</TabBtn>
          <TabBtn active={mode === 'invitation'} onClick={() => setMode('invitation')}>תצוגה מלאה</TabBtn>
          <TabBtn active={mode === 'guest'} onClick={() => setMode('guest')}>חוויית אורח</TabBtn>
        </nav>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-60px)]">
        {mode === 'builder' && (
          <BuilderLayout state={state} setState={setState} onReset={onReset} onRandomize={onRandomize} url={url} />
        )}
        {mode === 'invitation' && <FullScreenInvitation state={state} />}
        {mode === 'guest' && <GuestExperience state={state} />}
      </main>

      <footer className="relative z-10 text-center text-[11px] text-gold-50/50 py-6">
        נבנה באהבה ✨ · שתפו את הקישור: <span className="font-mono ltr:inline-block" dir="ltr">{url}</span>
      </footer>
    </>
  );
}

function BuilderLayout({ state, setState, onReset, onRandomize, url }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 px-4 sm:px-8 py-6 max-w-[1400px] mx-auto">
      <section className="space-y-5">
        <Builder state={state} setState={setState} onReset={onReset} onRandomize={onRandomize} />
      </section>
      <aside className="space-y-5 lg:sticky lg:top-[80px] self-start">
        <div className="glass-strong rounded-3xl p-3 sm:p-5">
          <InvitationPreview state={state} />
        </div>
        <ShareBar state={state} />
        <div className="text-center text-[11px] text-gold-50/50">
          הקישור הקבוע שלכם: <a href={url} className="underline decoration-dotted" dir="ltr">{url}</a>
        </div>
      </aside>
    </div>
  );
}

function FullScreenInvitation({ state }) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[560px]">
        <InvitationPreview state={state} />
      </div>
    </div>
  );
}

function GuestExperience({ state }) {
  const mapsHref = state.venueMapsUrl
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.venueName + ' ' + state.venueAddress)}`;

  return (
    <div className="px-4 sm:px-8 py-6 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
      <div className="space-y-5">
        <InvitationPreview state={state} />
        <div className="grid grid-cols-2 gap-2">
          <a className="btn btn-primary" href={mapsHref} target="_blank" rel="noreferrer">🗺️ ניווט אל המקום</a>
          {state.liveStreamUrl && (
            <a className="btn btn-ghost" href={state.liveStreamUrl} target="_blank" rel="noreferrer">🎥 שידור חי</a>
          )}
          {state.giftRegistryUrl && (
            <a className="btn btn-ghost" href={state.giftRegistryUrl} target="_blank" rel="noreferrer">🎁 רשימת מתנות</a>
          )}
          {state.dressCode && (
            <div className="rounded-xl px-3 py-2 bg-white/[0.04] border border-white/10 text-sm">
              <span className="text-gold-50/60 text-xs block">קוד לבוש</span>
              {state.dressCode}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-5">
        <ShareBar state={state} />
        <RsvpPanel state={state} />
      </div>
    </div>
  );
}

function TabBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs sm:text-sm rounded-lg px-3 py-1.5 transition border ${
        active
          ? 'border-gold-300 bg-white/10 text-gold-50'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-gold-50/85'
      }`}
    >
      {children}
    </button>
  );
}

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="lg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fde7a8" />
          <stop offset="55%" stopColor="#c79a3a" />
          <stop offset="100%" stopColor="#0a0612" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#lg)" />
      <path d="M32 14 L36 28 L50 30 L38 38 L42 52 L32 44 L22 52 L26 38 L14 30 L28 28 Z" fill="#0a0612" opacity="0.85" />
    </svg>
  );
}
