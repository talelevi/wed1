// Optional Claude-powered helpers. The API key is BYO (bring-your-own):
// it's stored only in localStorage on the user's device and sent
// directly from the browser to api.anthropic.com.
//
// We rely on `anthropic-dangerous-direct-browser-access: true`. That's
// fine for this app because the key never leaves the user's machine,
// but anyone shipping this publicly should proxy through their own
// backend instead.

const KEY_STORAGE = 'luminara:anthropic-key';
const MODEL = 'claude-opus-4-7';

export function getApiKey() {
  try { return localStorage.getItem(KEY_STORAGE) || ''; }
  catch { return ''; }
}
export function setApiKey(k) {
  try {
    if (k) localStorage.setItem(KEY_STORAGE, k);
    else localStorage.removeItem(KEY_STORAGE);
  } catch { /* quota */ }
}
export function hasApiKey() { return !!getApiKey(); }

const STYLE_IDS = ['cosmos', 'classic', 'botanical', 'editorial', 'artdeco', 'minimalist', 'mediterranean', 'watercolor'];
const THEME_IDS = ['cosmos', 'aurora', 'desertHenna', 'rosegold', 'oceanic'];
const FONT_IDS  = ['classicSerif', 'modernHebrew', 'romantic', 'minimal'];

const SYSTEM_PROMPT = `You are a senior designer for Hebrew wedding invitations.
You help match the user's reference (image / URL / description) to one of these
internal styles and pick complementary tweaks.

Available "style" values: ${STYLE_IDS.join(', ')}.
Available "theme" values (only meaningful when style="cosmos"): ${THEME_IDS.join(', ')}.
Available "fontPair" values: ${FONT_IDS.join(', ')}.

Always respond as a single JSON object inside <answer>...</answer> tags. Schema:
{
  "style": "<one of the style ids>",
  "theme": "<one of the theme ids; optional>",
  "fontPair": "<one of the fontPair ids; optional>",
  "tagline": "<a short Hebrew quote (max 18 words) inspired by the reference; optional>",
  "rationale": "<1–2 short sentences in Hebrew explaining your choice>"
}
Pick "classic" for traditional paper invitations, "editorial" for bold magazine
typography, "artdeco" for gold geometric glamour, "botanical" for greenery,
"mediterranean" for terracotta arches, "watercolor" for soft paint, "minimalist"
for stark whitespace, and "cosmos" only when the reference is dark/celestial/3D.`;

function extractJson(text) {
  // Prefer <answer>…</answer>, fall back to first {...} block.
  const m = text.match(/<answer>([\s\S]*?)<\/answer>/i);
  const raw = (m ? m[1] : text).trim();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start < 0 || end < 0) return null;
  try { return JSON.parse(raw.slice(start, end + 1)); }
  catch { return null; }
}

async function callClaude(content, { signal } = {}) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('לא הוגדר מפתח API. אפשר להוסיף אותו בהגדרות AI.');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Claude API שגיאה ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = (json.content || []).map((b) => b.text || '').join('\n').trim();
  const parsed = extractJson(text);
  if (!parsed) throw new Error('המודל לא החזיר JSON תקין.');
  return parsed;
}

export async function styleFromImage(file, opts) {
  const dataUrl = await fileToDataUrl(file);
  const { mediaType, data } = parseDataUrl(dataUrl);
  return callClaude(
    [
      { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
      { type: 'text', text: 'זיהי לי את סגנון ההזמנה הזו והמליצי על הסטייל הקרוב ביותר מהרשימה, צבעים ופונט מתאימים. החזירי JSON.' },
    ],
    opts
  );
}

export async function styleFromText(description, opts) {
  return callClaude(
    [{ type: 'text', text: `הזמנה רצויה: ${description}\nהמליצי על הסטייל הקרוב ביותר וחבילת התאמות. החזירי JSON.` }],
    opts
  );
}

export async function styleFromUrl(url, opts) {
  // Claude can't fetch the URL itself in a browser-direct call.
  // We convert it to text-only context and let the model reason about the description.
  return callClaude(
    [{ type: 'text', text: `הזוג שלח קישור לדוגמה: ${url}\nאם השם או ההקשר רומזים על סגנון מסוים, השתמשי בזה. אחרת בחרי "classic".` }],
    opts
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
function parseDataUrl(dataUrl) {
  const m = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!m) throw new Error('Invalid data URL');
  return { mediaType: m[1], data: m[2] };
}

// Sanity checks – validate values from the model before applying.
export function sanitizeSuggestion(suggestion) {
  if (!suggestion || typeof suggestion !== 'object') return null;
  const out = {};
  if (STYLE_IDS.includes(suggestion.style)) out.style = suggestion.style;
  if (THEME_IDS.includes(suggestion.theme)) out.theme = suggestion.theme;
  if (FONT_IDS.includes(suggestion.fontPair)) out.fontPair = suggestion.fontPair;
  if (typeof suggestion.tagline === 'string' && suggestion.tagline.length <= 240) out.tagline = suggestion.tagline.trim();
  if (typeof suggestion.rationale === 'string') out.rationale = suggestion.rationale.trim();
  return Object.keys(out).length ? out : null;
}
