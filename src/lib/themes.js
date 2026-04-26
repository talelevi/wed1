// Visual themes – each has a distinct cosmic palette and motif.
// Themes affect background, ornaments, type accents and ambient particles.

export const THEMES = {
  cosmos: {
    id: 'cosmos',
    label: 'קוסמוס',
    description: 'גלקסיה של אבק כוכבים וערפילית בוערת',
    bg: ['#0a0612', '#1b0d3a', '#2a0a4a'],
    accent: '#e9c97a',
    accent2: '#a78bfa',
    accent3: '#ff6fa3',
    motif: 'stars',
  },
  aurora: {
    id: 'aurora',
    label: 'זוהר הצפון',
    description: 'אורות רכים שזורמים על שמיים שחורים',
    bg: ['#04101a', '#072a4f', '#0a4a3f'],
    accent: '#7df9c9',
    accent2: '#9ad8ff',
    accent3: '#c8a6ff',
    motif: 'aurora',
  },
  desertHenna: {
    id: 'desertHenna',
    label: 'חינה במדבר',
    description: 'זריחה זהובה, דקלים סגולים ותבליני שוק',
    bg: ['#160604', '#3a0b08', '#7a2a0a'],
    accent: '#f0a04b',
    accent2: '#d4a017',
    accent3: '#ff7a59',
    motif: 'henna',
  },
  rosegold: {
    id: 'rosegold',
    label: 'זהב ורוד',
    description: 'שזרים שמיימיים בגווני שמפניה',
    bg: ['#1b0a14', '#3a1426', '#5a1f3a'],
    accent: '#ffd1b3',
    accent2: '#ffb6c1',
    accent3: '#e9c97a',
    motif: 'petals',
  },
  oceanic: {
    id: 'oceanic',
    label: 'אוקיינוס שקט',
    description: 'מעמקים כחולים עם זרחנים זוהרים',
    bg: ['#04101a', '#062a3f', '#073a5a'],
    accent: '#9ad8ff',
    accent2: '#7df9c9',
    accent3: '#ffeaa1',
    motif: 'bubbles',
  },
};

export const FONT_PAIRS = {
  classicSerif: { display: 'font-display', script: 'font-script', label: 'קלאסי מלכותי' },
  modernHebrew: { display: 'font-hebrew', script: 'font-hebrew', label: 'מודרני עברי' },
  romantic:    { display: 'font-script',  script: 'font-script', label: 'רומנטי' },
  minimal:     { display: 'font-mono',    script: 'font-display', label: 'מינימליסטי' },
};

export const EVENT_TYPES = {
  wedding: { id: 'wedding', label: 'חתונה', icon: '💍' },
  henna:   { id: 'henna',   label: 'חינה',   icon: '🌿' },
  engagement: { id: 'engagement', label: 'אירוסין', icon: '✨' },
  birthday: { id: 'birthday', label: 'יום הולדת', icon: '🎂' },
};
