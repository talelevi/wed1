// Encode/decode invitation state to a sharable URL hash.
// We compress JSON to URL-safe base64 to keep links short-ish.

export const DEFAULT_STATE = {
  eventType: 'wedding',
  style: 'greenery',        // hand-drawn cream-and-sage default, matches the brief
  theme: 'cosmos',          // palette variant (only used inside cosmic style)
  fontPair: 'classicSerif',
  bride: 'ענבל ויינודצקי',
  groom: 'טל אלוי',
  parentsBride: 'משפחת ויינודצקי',
  parentsGroom: 'משפחת אלוי',
  intro: 'אנו שמחים להזמינכם לחגוג עמנו את יום נישואינו',
  closing: 'נשמח לראותכם!',
  tagline: 'נשמח לראותכם חוגגים איתנו יום מלא באהבה ואושר',
  dateISO: weddingDateISO(),
  hebrewDateLabel: 'כ"ג באייר תשפ"ו',
  durationMinutes: 360,
  receptionTime: '19:30',
  ceremonyTime: '19:30',
  venueName: 'גן הפקאן',
  venueAddress: '',
  venueMapsUrl: '',
  rsvpName: '',
  rsvpPhone: '',
  // Visual knobs
  intensity: 0.75,        // 0..1 background intensity
  parallax: 0.6,          // 0..1 parallax depth
  showCountdown: true,
  showQR: true,
  showHennaPatterns: false, // auto-true when eventType=henna
  giftRegistryUrl: '',
  liveStreamUrl: '',
  dressCode: 'אלגנטי קוסמי – גוונים שחורים, סגולים וזהב',
  // Whatsapp message template tokens: {names}, {dateHe}, {venue}, {url}
  inviteMessage:
    'שלום! 💫 הוזמנתם לחגוג איתנו את החתונה של {names} בתאריך {dateHe} ב{venue}. פרטים והוספה ליומן בקישור: {url}',
};

function nextSaturdayISO() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7) + 21);
  d.setHours(20, 0, 0, 0);
  return d.toISOString();
}

function weddingDateISO() {
  // 09/06/2026 19:30 local time (Israel)
  return new Date(2026, 5, 9, 19, 30, 0, 0).toISOString();
}

const toUrlSafe = (b64) => b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromUrlSafe = (s) => {
  let v = s.replace(/-/g, '+').replace(/_/g, '/');
  while (v.length % 4) v += '=';
  return v;
};

export function encodeState(state) {
  try {
    const json = JSON.stringify(state);
    const b64 = typeof btoa !== 'undefined'
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, 'utf8').toString('base64');
    return toUrlSafe(b64);
  } catch (e) {
    return '';
  }
}

export function decodeState(token) {
  if (!token) return null;
  try {
    const b64 = fromUrlSafe(token);
    const json = typeof atob !== 'undefined'
      ? decodeURIComponent(escape(atob(b64)))
      : Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function readStateFromUrl() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash.startsWith('inv=')) return null;
  return decodeState(hash.slice(4));
}

export function writeStateToUrl(state, { replace = true } = {}) {
  if (typeof window === 'undefined') return;
  const token = encodeState(state);
  const url = `${window.location.origin}${window.location.pathname}#inv=${token}`;
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  return url;
}

export function buildShareUrl(state) {
  if (typeof window === 'undefined') return '';
  const token = encodeState(state);
  return `${window.location.origin}${window.location.pathname}#inv=${token}`;
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem('luminara:state');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveToStorage(state) {
  try {
    localStorage.setItem('luminara:state', JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

const HE_MONTHS = [
  'בינואר', 'בפברואר', 'במרץ', 'באפריל', 'במאי', 'ביוני',
  'ביולי', 'באוגוסט', 'בספטמבר', 'באוקטובר', 'בנובמבר', 'בדצמבר',
];
const HE_DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

export function formatHebrewDate(iso) {
  const d = new Date(iso);
  return `יום ${HE_DAYS[d.getDay()]}, ${d.getDate()} ${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatHebrewTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function fillTemplate(tpl, vars) {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, v ?? ''),
    tpl || ''
  );
}
