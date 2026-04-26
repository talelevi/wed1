import React from 'react';
import { THEMES, FONT_PAIRS, EVENT_TYPES } from '../lib/themes';

// All editable knobs for the invitation. Updates state on every input.
export default function Builder({ state, setState, onReset, onRandomize }) {
  const set = (k) => (e) => {
    const v = e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value ?? e;
    setState((s) => ({ ...s, [k]: v }));
  };

  const setNum = (k) => (e) =>
    setState((s) => ({ ...s, [k]: Number(e.target.value) }));

  const dateLocal = toLocalInputValue(state.dateISO);

  return (
    <div className="space-y-5">
      <Section title="סוג האירוע">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(EVENT_TYPES).map((et) => (
            <Pill
              key={et.id}
              active={state.eventType === et.id}
              onClick={() => setState((s) => ({ ...s, eventType: et.id }))}
            >
              <span className="ml-1">{et.icon}</span> {et.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="ערכת נושא">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => setState((s) => ({ ...s, theme: t.id }))}
              className={`text-right rounded-xl p-3 border transition ${
                state.theme === t.id
                  ? 'border-gold-300 bg-white/10'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${t.bg[1]}, ${t.accent})` }}
                />
                <span className="font-semibold">{t.label}</span>
              </div>
              <div className="text-xs text-gold-50/70">{t.description}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="טיפוגרפיה">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(FONT_PAIRS).map(([k, f]) => (
            <Pill
              key={k}
              active={state.fontPair === k}
              onClick={() => setState((s) => ({ ...s, fontPair: k }))}
            >
              <span className={f.display}>{f.label}</span>
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="שמות הזוג">
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
        </div>
      </Section>

      <Section title="טקסט אישי">
        <Field label="שורת מחץ / ציטוט">
          <textarea
            className="field min-h-[64px]"
            value={state.tagline}
            onChange={set('tagline')}
            maxLength={180}
          />
        </Field>
      </Section>

      <Section title="תאריך ושעה">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="תאריך ושעת אירוע">
            <input
              type="datetime-local"
              className="field"
              value={dateLocal}
              onChange={(e) =>
                setState((s) => ({ ...s, dateISO: new Date(e.target.value).toISOString() }))
              }
            />
          </Field>
          <Field label="קבלת פנים">
            <input className="field" value={state.receptionTime} onChange={set('receptionTime')} />
          </Field>
          <Field label="חופה / טקס">
            <input className="field" value={state.ceremonyTime} onChange={set('ceremonyTime')} />
          </Field>
        </div>
      </Section>

      <Section title="מיקום">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="שם המקום">
            <input className="field" value={state.venueName} onChange={set('venueName')} />
          </Field>
          <Field label="כתובת">
            <input className="field" value={state.venueAddress} onChange={set('venueAddress')} />
          </Field>
          <Field label="קישור Google Maps (אופציונלי)" full>
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

      <Section title="פרטים נוספים">
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

      <Section title="אווירה ויזואלית">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={`עוצמת רקע: ${(state.intensity * 100).toFixed(0)}%`}>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={state.intensity}
              onChange={setNum('intensity')}
            />
          </Field>
          <Field label={`עומק פרלקס: ${(state.parallax * 100).toFixed(0)}%`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.parallax}
              onChange={setNum('parallax')}
            />
          </Field>
          <Toggle label="הצגת ספירה לאחור" checked={state.showCountdown} onChange={set('showCountdown')} />
          <Toggle label="הצגת קוד QR לשיתוף" checked={state.showQR} onChange={set('showQR')} />
          <Toggle label="עיטורי חינה (מנדלות וקווים)" checked={state.showHennaPatterns} onChange={set('showHennaPatterns')} />
        </div>
      </Section>

      <Section title="הודעת שיתוף (וואטסאפ/SMS)">
        <Field label="טוקנים זמינים: {names}, {dateHe}, {venue}, {url}">
          <textarea
            className="field min-h-[90px]"
            value={state.inviteMessage}
            onChange={set('inviteMessage')}
          />
        </Field>
      </Section>

      <div className="flex flex-wrap gap-2 pt-2">
        <button className="btn btn-ghost" onClick={onRandomize}>🎲 הפתיעו אותי</button>
        <button className="btn btn-ghost" onClick={onReset}>↺ איפוס</button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <h3 className="text-sm font-bold tracking-widest text-gold-50/85 mb-3">{title}</h3>
      {children}
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
      <span
        className={`relative inline-block w-10 h-6 rounded-full transition ${
          checked ? 'bg-gold-500' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
            checked ? 'right-0.5' : 'right-[18px]'
          }`}
        />
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
