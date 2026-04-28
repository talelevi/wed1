import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES, FONT_PAIRS, EVENT_TYPES } from '../lib/themes';
import { STYLES } from '../lib/styles';

// Mobile-first builder. Sections are collapsible accordions; the most
// common one (Names) is open by default. Cosmic-only knobs are hidden
// when a static style is selected.
export default function BuilderPanel({ state, setState, onReset, onRandomize }) {
  const isCosmic = state.style === 'cosmos';

  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e;
    setState((s) => ({ ...s, [k]: v }));
  };
  const setNum = (k) => (e) =>
    setState((s) => ({ ...s, [k]: Number(e.target.value) }));

  return (
    <div className="space-y-3">
      <Section title="פרטי הזוג" defaultOpen icon="💞">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={state.eventType === 'birthday' ? 'שם החוגג/ת' : 'שם הכלה'}>
            <input className="field" value={state.bride} onChange={set('bride')} />
          </Field>
          {state.eventType !== 'birthday' && (
            <Field label="שם החתן">
              <input className="field" value={state.groom} onChange={set('groom')} />
            </Field>
          )}
          <Field label="משפחה (כלה)">
            <input className="field" value={state.parentsBride} onChange={set('parentsBride')} />
          </Field>
          {state.eventType !== 'birthday' && (
            <Field label="משפחה (חתן)">
              <input className="field" value={state.parentsGroom} onChange={set('parentsGroom')} />
            </Field>
          )}
          <Field label="פתיחה (מעל התאריך)" full>
            <input className="field" maxLength={140}
              value={state.intro || ''} onChange={set('intro')}
              placeholder="אנו שמחים להזמינכם לחגוג עמנו את יום נישואינו" />
          </Field>
          <Field label="ציטוט / שורת מחץ" full>
            <textarea className="field min-h-[60px]" maxLength={180}
              value={state.tagline} onChange={set('tagline')} />
          </Field>
          <Field label="חתימה (בתחתית, סטיילים מצוירים)" full>
            <input className="field" maxLength={60}
              value={state.closing || ''} onChange={set('closing')}
              placeholder="נשמח לראותכם!" />
          </Field>
        </div>
      </Section>

      <Section title="סוג האירוע" icon="🎊">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(EVENT_TYPES).map((et) => (
            <Pill key={et.id}
              active={state.eventType === et.id}
              onClick={() => setState((s) => ({ ...s, eventType: et.id }))}>
              <span className="ml-1">{et.icon}</span> {et.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="תאריך, שעה ומקום" icon="📍">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="תאריך ושעה" full>
            <input
              type="datetime-local"
              className="field"
              value={toLocalInputValue(state.dateISO)}
              onChange={(e) =>
                setState((s) => ({ ...s, dateISO: new Date(e.target.value).toISOString() }))
              }
            />
          </Field>
          <Field label="תאריך עברי (לסטיילים מצוירים)" full>
            <input className="field" value={state.hebrewDateLabel || ''}
              onChange={set('hebrewDateLabel')} placeholder='למשל: כ"ג באייר תשפ"ו' />
          </Field>
          <Field label="קבלת פנים">
            <input className="field" value={state.receptionTime} onChange={set('receptionTime')} />
          </Field>
          <Field label="חופה / טקס">
            <input className="field" value={state.ceremonyTime} onChange={set('ceremonyTime')} />
          </Field>
          <Field label="שם המקום">
            <input className="field" value={state.venueName} onChange={set('venueName')} />
          </Field>
          <Field label="כתובת">
            <input className="field" value={state.venueAddress} onChange={set('venueAddress')} />
          </Field>
          <Field label="קישור Google Maps" full>
            <input
              className="field"
              dir="ltr"
              value={state.venueMapsUrl}
              onChange={set('venueMapsUrl')}
              placeholder="https://maps.google.com/..."
            />
          </Field>
        </div>
      </Section>

      <Section title="פרטים נוספים" icon="✨">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="קוד לבוש">
            <input className="field" value={state.dressCode} onChange={set('dressCode')} />
          </Field>
          <Field label="קישור לרשימת מתנות">
            <input className="field" dir="ltr" value={state.giftRegistryUrl} onChange={set('giftRegistryUrl')} placeholder="https://..." />
          </Field>
          <Field label="קישור שידור חי" full>
            <input className="field" dir="ltr" value={state.liveStreamUrl} onChange={set('liveStreamUrl')} placeholder="https://..." />
          </Field>
        </div>
      </Section>

      {isCosmic && (
        <Section title="כיוון אווירה (סטייל קוסמי)" icon="🌌">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="ערכת צבעים פנימית">
              <select className="field" value={state.theme} onChange={set('theme')}>
                {Object.values(THEMES).map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="טיפוגרפיה">
              <select className="field" value={state.fontPair} onChange={set('fontPair')}>
                {Object.entries(FONT_PAIRS).map(([k, f]) => (
                  <option key={k} value={k}>{f.label}</option>
                ))}
              </select>
            </Field>
            <Field label={`עוצמת רקע: ${(state.intensity * 100).toFixed(0)}%`} full>
              <input type="range" min="0.1" max="1" step="0.05" value={state.intensity} onChange={setNum('intensity')} />
            </Field>
            <Field label={`עומק פרלקס: ${(state.parallax * 100).toFixed(0)}%`} full>
              <input type="range" min="0" max="1" step="0.05" value={state.parallax} onChange={setNum('parallax')} />
            </Field>
            <Toggle label="ספירה לאחור" checked={state.showCountdown} onChange={set('showCountdown')} />
            <Toggle label="קוד QR לשיתוף" checked={state.showQR} onChange={set('showQR')} />
            <Toggle label="עיטורי חינה" checked={state.showHennaPatterns} onChange={set('showHennaPatterns')} />
          </div>
        </Section>
      )}

      <Section title="הודעת שיתוף" icon="💬">
        <Field label="טוקנים: {names}, {dateHe}, {venue}, {url}">
          <textarea className="field min-h-[80px]" value={state.inviteMessage} onChange={set('inviteMessage')} />
        </Field>
      </Section>

      <div className="flex flex-wrap gap-2 pt-1">
        <button className="btn btn-ghost" onClick={onRandomize}>🎲 הפתיעו אותי</button>
        <button className="btn btn-ghost" onClick={onReset}>↺ איפוס</button>
        <span className="self-center text-[11px] text-gold-50/60 mr-auto">
          סטייל פעיל: <b>{STYLES[state.style]?.labelHe || '—'}</b>
        </span>
      </div>
    </div>
  );
}

function Section({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.04]"
      >
        <span className="flex items-center gap-2 text-sm font-bold tracking-widest text-gold-50/85">
          <span className="opacity-70">{icon}</span> {title}
        </span>
        <span className={`text-gold-50/60 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[11px] text-gold-50/70 mb-1 tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm border transition ${
        active
          ? 'border-gold-300 bg-white/10 text-gold-50'
          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-gold-50/85'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer">
      <span className="text-sm">{label}</span>
      <span className={`relative inline-block w-10 h-6 rounded-full transition ${checked ? 'bg-gold-500' : 'bg-white/15'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${checked ? 'right-0.5' : 'right-[18px]'}`} />
        <input type="checkbox" className="sr-only" checked={!!checked} onChange={onChange} />
      </span>
    </label>
  );
}

function toLocalInputValue(iso) {
  try {
    const d = new Date(iso);
    const tz = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tz * 60_000);
    return local.toISOString().slice(0, 16);
  } catch {
    return '';
  }
}
