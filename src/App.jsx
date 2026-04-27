import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CosmicBackground from './components/CosmicBackground';
import StyleRenderer from './components/styles';
import StylePicker from './components/StylePicker';
import BuilderPanel from './components/BuilderPanel';
import ReferencePanel from './components/ReferencePanel';
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
import { STYLES } from './lib/styles';
import { useInstallPrompt, useOnlineStatus } from './lib/pwa';

const TAGLINES = [
  'בליל אחד, מתחת לאותו ירח, חיינו נחשפים',
  'התחלה חדשה שנכתבת בשמיים',
  'שני כוכבים שנפגשו בדיוק במקום הנכון',
  'תחת חופת הכוכבים, נשבעים לאהוב',
  'הסיפור שלנו רק התחיל — ואתם חלק ממנו',
];

const TABS = [
  { id: 'design', label: 'עיצוב', icon: '🎨' },
  { id: 'content', label: 'תוכן', icon: '✏️' },
  { id: 'reference', label: 'רפרנס', icon: '✨' },
  { id: 'share', label: 'שיתוף', icon: '🔗' },
  { id: 'guests', label: 'אורחים', icon: '👥' },
];

export default function App() {
  const [state, setState] = useState(() =>
    readStateFromUrl() || loadFromStorage() || DEFAULT_STATE
  );
  const initialMode = (() => {
    if (typeof window === 'undefined') return 'builder';
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'invitation' || v === 'guest' || v === 'builder') return v;
    return 'builder';
  })();
  const [mode, setMode] = useState(initialMode);
  const [tab, setTab] = useState('design');
  const [intro, setIntro] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false); // mobile preview drawer
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const online = useOnlineStatus();

  useEffect(() => {
    saveToStorage(state);
    const h = setTimeout(() => writeStateToUrl(state), 200);
    return () => clearTimeout(h);
  }, [state]);

  // Keep <title>, description and OG meta in sync with the current state so
  // share previews on WhatsApp / Telegram show the couple's names.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const couple =
      state.eventType === 'birthday'
        ? state.bride
        : `${state.bride} & ${state.groom}`;
    const desc =
      state.tagline?.slice(0, 160) ||
      'הזמנה לאירוע — לחצו לפתיחה ולהוספה ליומן.';
    document.title = `${couple} — Luminara`;
    setMeta('description', desc);
    setMeta('og:title', `${couple} — הזמנה`, true);
    setMeta('og:description', desc, true);
    setMeta('twitter:title', `${couple} — הזמנה`);
    setMeta('twitter:description', desc);
    setMeta('twitter:card', 'summary');
  }, [state]);

  // Auto-switch to guest only when this looks like a fresh visitor opening
  // a share link — not when the editor reloads their own URL (which always
  // contains their own state in the hash).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fromUrl = readStateFromUrl();
    if (!fromUrl) return;
    const stored = loadFromStorage();
    const isFirstVisit = !stored;
    const fromUrlIsDifferent =
      stored && (stored.bride !== fromUrl.bride || stored.dateISO !== fromUrl.dateISO);
    if (isFirstVisit || fromUrlIsDifferent) setMode('guest');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const url = useMemo(() => buildShareUrl(state), [state]);
  const isCosmic = state.style === 'cosmos';

  const onReset = () => setState({ ...DEFAULT_STATE });
  const onRandomize = () => {
    const styleIds = Object.keys(STYLES);
    const newStyle = styleIds[Math.floor(Math.random() * styleIds.length)];
    const themeIds = Object.keys(THEMES);
    const newTheme = themeIds[Math.floor(Math.random() * themeIds.length)];
    setState((s) => ({
      ...s,
      style: newStyle,
      theme: newTheme,
      tagline: TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
      intensity: 0.5 + Math.random() * 0.5,
      parallax: 0.3 + Math.random() * 0.7,
    }));
  };

  return (
    <>
      {/* Cosmic background only when the cosmic style is active. Other styles
          look better on a calm dark backdrop. */}
      {isCosmic ? (
        <CosmicBackground themeId={state.theme} intensity={state.intensity} parallax={state.parallax} />
      ) : (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 30% 0%, #1a1230 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #2a1a40 0%, transparent 60%), #07050d',
          }}
        />
      )}

      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIntro(false)}
          >
            <div className="text-center">
              <motion.h1
                className="text-shimmer font-display text-5xl sm:text-7xl tracking-widest"
                initial={{ letterSpacing: '0.5em', opacity: 0 }}
                animate={{ letterSpacing: '0.18em', opacity: 1 }}
                transition={{ duration: 1.0 }}
              >
                LUMINARA
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-gold-50/70 tracking-[0.4em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                INVITATION STUDIO
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 px-2 sm:px-6 py-2.5 flex items-center justify-between gap-2 glass">
        <div className="flex items-center gap-2 min-w-0 shrink">
          <Logo />
          <div className="leading-tight min-w-0 hidden min-[380px]:block">
            <div className="font-display text-shimmer text-lg leading-none">Luminara</div>
            <div className="text-[10px] tracking-[0.25em] text-gold-50/60 truncate">
              {STYLES[state.style]?.labelHe || '—'}
            </div>
          </div>
        </div>
        <nav className="flex gap-1 items-center shrink-0">
          {canInstall && !installed && (
            <button
              onClick={promptInstall}
              className="hidden md:inline-flex text-[11px] tracking-widest rounded-lg px-2.5 py-1.5 border border-gold-300/60 text-gold-50 hover:bg-white/10"
            >
              ⤓ התקנה
            </button>
          )}
          <SegBtn active={mode === 'builder'} onClick={() => setMode('builder')}>סטודיו</SegBtn>
          <SegBtn active={mode === 'invitation'} onClick={() => setMode('invitation')}>תצוגה</SegBtn>
          <SegBtn active={mode === 'guest'} onClick={() => setMode('guest')}>אורח</SegBtn>
        </nav>
      </header>

      {!online && (
        <div className="relative z-20 text-center text-xs py-1.5 bg-amber-300/15 border-y border-amber-300/30 text-amber-100">
          ⚠ אין חיבור לאינטרנט · ההזמנה ממשיכה לעבוד אופליין
        </div>
      )}

      <main className="relative z-10 min-h-[calc(100vh-60px)]">
        {mode === 'builder' && (
          <Studio
            state={state}
            setState={setState}
            tab={tab}
            setTab={setTab}
            onReset={onReset}
            onRandomize={onRandomize}
            previewOpen={previewOpen}
            setPreviewOpen={setPreviewOpen}
            url={url}
          />
        )}
        {mode === 'invitation' && <FullScreenInvitation state={state} />}
        {mode === 'guest' && <GuestExperience state={state} />}
      </main>

      <footer className="relative z-10 text-center text-[11px] text-gold-50/50 py-5 px-4">
        נבנה באהבה · קישור קבוע: <a className="underline decoration-dotted" dir="ltr" href={url}>{url.length > 60 ? url.slice(0, 60) + '…' : url}</a>
      </footer>

      {/* Mobile floating preview button — bottom-right for thumb reach in RTL */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-30 btn btn-primary shadow-2xl"
        aria-label="פתח תצוגה מקדימה"
      >
        👁 תצוגה
      </button>

      <PreviewDrawer state={state} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}

function Studio({ state, setState, tab, setTab, onReset, onRandomize, url }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_minmax(360px,1fr)] gap-5 px-3 sm:px-6 py-5 max-w-[1500px] mx-auto">
      <section className="space-y-4 min-w-0">
        {/* Tabs — horizontal scroll on narrow phones; never wraps. */}
        <div className="glass rounded-2xl p-1 sticky top-[60px] z-20 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition ${
                  tab === t.id
                    ? 'bg-white/10 text-gold-50 ring-1 ring-gold-300/40'
                    : 'text-gold-50/70 hover:text-gold-50 hover:bg-white/[0.05]'
                }`}
              >
                <span className="ml-1">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'design' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold tracking-wide">בחירת סטייל</h3>
                <span className="text-[11px] text-gold-50/60">8 סטיילים · רגיל ואנימטיבי</span>
              </div>
              <StylePicker state={state} setState={setState} />
            </div>
          </div>
        )}

        {tab === 'content' && (
          <BuilderPanel state={state} setState={setState} onReset={onReset} onRandomize={onRandomize} />
        )}

        {tab === 'reference' && (
          <ReferencePanel state={state} setState={setState} />
        )}

        {tab === 'share' && (
          <ShareBar state={state} />
        )}

        {tab === 'guests' && (
          <RsvpPanel state={state} />
        )}
      </section>

      {/* Sticky preview (desktop) */}
      <aside className="hidden lg:block lg:sticky lg:top-[80px] self-start">
        <div className="glass-strong rounded-3xl p-3 sm:p-5">
          <StyleRenderer state={state} />
        </div>
        <div className="mt-3 text-center text-[11px] text-gold-50/50">
          תצוגה מתעדכנת בזמן אמת
        </div>
      </aside>
    </div>
  );
}

function FullScreenInvitation({ state }) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[560px]">
        <StyleRenderer state={state} />
      </div>
    </div>
  );
}

function GuestExperience({ state }) {
  const mapsHref = state.venueMapsUrl
    || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.venueName + ' ' + state.venueAddress)}`;
  return (
    <div className="px-3 sm:px-6 py-5 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
      <div className="space-y-4">
        <StyleRenderer state={state} />
        <div className="grid grid-cols-2 gap-2">
          <a className="btn btn-primary" href={mapsHref} target="_blank" rel="noreferrer">🗺️ ניווט</a>
          {state.liveStreamUrl && <a className="btn btn-ghost" href={state.liveStreamUrl} target="_blank" rel="noreferrer">🎥 שידור חי</a>}
          {state.giftRegistryUrl && <a className="btn btn-ghost" href={state.giftRegistryUrl} target="_blank" rel="noreferrer">🎁 מתנות</a>}
          {state.dressCode && (
            <div className="rounded-xl px-3 py-2 bg-white/[0.04] border border-white/10 text-sm">
              <span className="text-gold-50/60 text-xs block">קוד לבוש</span>
              {state.dressCode}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <ShareBar state={state} />
        <RsvpPanel state={state} />
      </div>
    </div>
  );
}

function PreviewDrawer({ state, open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl glass-strong p-3"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 240, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-sm font-bold">תצוגה מקדימה</span>
              <button onClick={onClose} className="btn btn-ghost text-xs">✕ סגור</button>
            </div>
            <div className="max-h-[80vh] overflow-auto">
              <StyleRenderer state={state} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SegBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs sm:text-sm rounded-lg px-2.5 sm:px-3 py-1.5 transition border ${
        active
          ? 'border-gold-300 bg-white/10 text-gold-50'
          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-gold-50/85'
      }`}
    >
      {children}
    </button>
  );
}

function setMeta(name, content, isProperty = false) {
  if (typeof document === 'undefined') return;
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
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
