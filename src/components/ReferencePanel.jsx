import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  styleFromImage, styleFromText, styleFromUrl,
  hasApiKey, getApiKey, setApiKey, sanitizeSuggestion,
} from '../lib/ai';
import { STYLES } from '../lib/styles';

// Reference-based generation. Offers three input modes:
//   1) Image upload (we send it to Claude vision)
//   2) URL (textual hint only)
//   3) Free-text description
// On success we apply the validated suggestion to state and surface the rationale.
export default function ReferencePanel({ state, setState }) {
  const [mode, setMode] = useState('image');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [last, setLast] = useState(null);
  const [keyEdit, setKeyEdit] = useState(false);
  const [keyDraft, setKeyDraft] = useState('');
  const keyOk = hasApiKey();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const apply = (s) => {
    const safe = sanitizeSuggestion(s);
    if (!safe) {
      setError('המודל החזיר תוצאה לא תקפה.');
      return;
    }
    setState((cur) => ({ ...cur, ...safe }));
    setLast(safe);
  };

  const run = async () => {
    setError('');
    setLoading(true);
    try {
      let suggestion;
      if (mode === 'image') {
        if (!file) throw new Error('בחרו קובץ תמונה.');
        suggestion = await styleFromImage(file);
      } else if (mode === 'url') {
        if (!url.trim()) throw new Error('הדביקו קישור.');
        suggestion = await styleFromUrl(url.trim());
      } else {
        if (!text.trim()) throw new Error('כתבו תיאור קצר.');
        suggestion = await styleFromText(text.trim());
      }
      apply(suggestion);
    } catch (err) {
      setError(err?.message || 'משהו השתבש.');
    } finally {
      setLoading(false);
    }
  };

  const saveKey = () => {
    setApiKey(keyDraft.trim());
    setKeyDraft('');
    setKeyEdit(false);
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold tracking-wide">השראה מרפרנס</h3>
        <button
          className="text-[11px] text-gold-50/70 underline decoration-dotted"
          onClick={() => { setKeyEdit((v) => !v); setKeyDraft(getApiKey()); }}
        >
          {keyOk ? '🔑 מפתח מוגדר' : '🔑 הגדרת מפתח Claude'}
        </button>
      </div>

      {keyEdit && (
        <div className="rounded-xl border border-amber-300/30 bg-amber-300/5 p-3 space-y-2 text-xs">
          <div>הדביקו מפתח Anthropic API. הוא נשמר רק בדפדפן הזה ונשלח ישירות ל-api.anthropic.com.</div>
          <input
            type="password"
            className="field text-xs"
            dir="ltr"
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            placeholder="sk-ant-..."
          />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={saveKey}>שמירה</button>
            {keyOk && (
              <button className="btn btn-ghost" onClick={() => { setApiKey(''); setKeyDraft(''); setKeyEdit(false); }}>
                הסרה
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Tab active={mode === 'image'} onClick={() => setMode('image')}>📸 תמונה</Tab>
        <Tab active={mode === 'url'} onClick={() => setMode('url')}>🔗 קישור</Tab>
        <Tab active={mode === 'text'} onClick={() => setMode('text')}>✍️ תיאור</Tab>
      </div>

      {mode === 'image' && (
        <div className="space-y-2">
          <label className="block">
            <input type="file" accept="image/*" onChange={onFile} className="block w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-gold-50 hover:file:bg-white/15" />
          </label>
          {preview && (
            <div className="rounded-xl overflow-hidden border border-white/10">
              <img src={preview} alt="reference" className="w-full max-h-48 object-cover" />
            </div>
          )}
        </div>
      )}
      {mode === 'url' && (
        <input className="field text-sm" dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)}
               placeholder="https://pinterest.com/pin/..." />
      )}
      {mode === 'text' && (
        <textarea className="field text-sm min-h-[90px]" value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="לדוגמה: הזמנה ירושלמית בגוונים של טרקוטה, קשתות, גופן ערבי-עברי, כתב ידני…" />
      )}

      <div className="flex items-center gap-2">
        <button className="btn btn-primary" disabled={loading} onClick={run}>
          {loading ? 'מנתחת…' : '✨ התאם סטייל מהרפרנס'}
        </button>
        {!keyOk && (
          <span className="text-[11px] text-amber-200/85">דרוש מפתח Claude כדי שזה יעבוד.</span>
        )}
      </div>

      {error && <div className="text-xs text-rose-300">{error}</div>}

      {last && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-300/30 bg-emerald-300/5 p-3 text-xs space-y-1"
        >
          <div className="font-semibold text-emerald-200">הוחל:</div>
          <ul className="list-disc pr-4">
            {last.style && <li>סטייל: <b>{STYLES[last.style]?.labelHe || last.style}</b></li>}
            {last.theme && <li>פלטה פנימית: <b>{last.theme}</b></li>}
            {last.fontPair && <li>טיפוגרפיה: <b>{last.fontPair}</b></li>}
            {last.tagline && <li>ציטוט מוצע: “{last.tagline}”</li>}
          </ul>
          {last.rationale && <div className="text-gold-50/80 italic">{last.rationale}</div>}
        </motion.div>
      )}
    </div>
  );
}

function Tab({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl py-2 text-sm border transition ${
        active
          ? 'border-gold-300 bg-white/10 text-gold-50'
          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-gold-50/85'
      }`}
    >
      {children}
    </button>
  );
}
