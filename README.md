# ✨ Luminara — Invitations Not Of This World

> בילדר חי להזמנות חתונה וחינה. דינאמי, קוסמי, מותאם אישית — עם קישור ליומן, QR, וואטסאפ ו-RSVP.

Luminara is a single‑page React app that lets couples design a *living*,
animated invitation in real‑time and share it as a single link. The card
itself is a 3D, parallax, theme‑aware experience — not a static PDF — and
every change is reflected instantly in the preview.

![status](https://img.shields.io/badge/status-alpha-blueviolet)
![license](https://img.shields.io/badge/license-MIT-green)
![stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-0ea5e9)

## ✦ למה זה מיוחד

- 🌌 **רקע קוסמי חי** – שדה כוכבים, כוכבים נופלים, ערפיליות זוהרות, אורות צפוניים, פרחים נושרים, בועות, מנדלות חינה.
- 🎛️ **בילדר חי** – כל שינוי טקסט/צבע/תאריך משתקף מיד בהזמנה, כולל אפקט hover עם זווית 3D.
- 🌿 **מצב חינה** – מנדלה מסתובבת, קווי mehndi, וצמדי גופנים מותאמים.
- 🔗 **שיתוף בקישור אחד** – ה-state מקודד אל ה-URL Hash, אז כל שינוי = קישור חדש לשיתוף.
- 📅 **הוספה ליומן** – Google, Apple/Outlook (ICS), Outlook Web, Yahoo. כולל הזמנה עם תזכורת יום מראש.
- 💬 **שיתוף חכם** – וואטסאפ, טלגרם, SMS, מייל, Web Share API, וכפתור QR בקליק.
- ✅ **RSVP מקומי** – שמירת אישורי הגעה ב-localStorage עם ייצוא CSV (קל לחבר אחר כך לשירות אמיתי).
- 🌐 **עברית RTL מלא**, פונטים מ-Google Fonts, מהיר וזריז.

## ✦ הרצה מקומית

```bash
nvm use            # אופציונלי, מבוסס .nvmrc → Node 20
npm install
npm run dev        # http://localhost:5173
npm run build      # ייצוא סטטי לתיקיית dist/
npm run preview    # שירות מקומי לבדיקה של ה-build
```

## ✦ פריסה (Deploy)

האפליקציה היא 100% סטטית אחרי `npm run build`. הריפו מגיע עם הגדרות מוכנות:

| יעד            | קובץ                          | פעולה                                                          |
| -------------- | ----------------------------- | -------------------------------------------------------------- |
| **Vercel**     | `vercel.json`                 | "Import Project" → זה מזהה Vite אוטומטית, deploy בקליק.       |
| **Netlify**    | `netlify.toml`                | "Add new site → from Git", הקונפיג מגדיר build/publish/headers. |
| **GitHub Pages** | `.github/workflows/pages.yml` | Push ל-`main` → builds & deploys. הפעילו Pages במצב "GitHub Actions". |
| **Cloudflare Pages** / **Firebase Hosting** | (ללא קונפיג) | Build = `npm run build`, output dir = `dist`.       |

> אין שרת. ה-state של ההזמנה נשמר ב-URL Hash (`#inv=...`) כך שכל קישור ששלחת מכיל את ההזמנה כולה.

### Environment Variables (אופציונלי)

```bash
cp .env.example .env.local
```

| Variable                    | מטרה                                                  |
| --------------------------- | ---------------------------------------------------- |
| `VITE_SUPABASE_URL`         | URL של פרויקט ה-Supabase (לאחסון RSVP בענן)         |
| `VITE_SUPABASE_ANON_KEY`    | מפתח public anon                                     |
| `VITE_DEFAULT_EVENT_ID`     | מזהה האירוע (`dana-omer-2026` למשל)                  |

ב-Vercel/Netlify הוסיפו אותם תחת Project → Environment Variables.
ב-GitHub Actions: Repository → Settings → Secrets and variables → Actions.

## ✦ PWA (התקנה כאפליקציה)

- ✓ מניפסט מלא בעברית (`public/manifest.webmanifest`) עם shortcuts לתצוגת הזמנה ול-RSVP.
- ✓ Service Worker (`public/sw.js`): network-first ל-HTML, stale-while-revalidate לאסטים ולגופנים, אופליין-shell.
- ✓ זיהוי `beforeinstallprompt` והופעת כפתור "⤓ התקנה" בכותרת.
- ✓ באנר אופליין שמתריע כשהחיבור נופל.
- ✓ תמיכה ב-iOS דרך `apple-mobile-web-app-*` meta tags.

> בפיתוח (`npm run dev`) ה-SW לא נרשם — רק על הדומיין הסופי.

## ✦ אחסון RSVP בענן (Supabase)

מודול ה-RSVP מזהה אוטומטית אם יש משתני סביבה של Supabase:

- **יש env** → קריאה/כתיבה לטבלת `rsvps` עם **עדכון בזמן אמת** (Realtime channel).
- **אין env** → נופל ל-localStorage. החוויה זהה למשתמש; הנתונים פשוט לא משתפים בין מכשירים.

הסכמה והפוליסות המלאות נמצאות ב-[`supabase/schema.sql`](supabase/schema.sql).
הריצו אותה פעם אחת ב-Supabase SQL Editor ותקבלו:

- טבלת `rsvps` חדשה
- אינדקס לפי `event_id + created_at`
- RLS פעיל עם פוליסות שמרשות `INSERT` ו-`SELECT` ל-`anon`
- (אופציונלי) הפעילו Realtime על הטבלה לקבלת עדכונים חיים בפאנל

## ✦ מבנה הפרויקט

```
src/
├── App.jsx                 # שלוש חוויות: Builder | Invitation | Guest
├── components/
│   ├── CosmicBackground.jsx  # שדה כוכבים, ערפיליות, מוטיבים פר נושא
│   ├── InvitationPreview.jsx # כרטיס ההזמנה עם hover-3D
│   ├── Builder.jsx           # כל שדות העריכה
│   ├── ShareBar.jsx          # יומן, וואטסאפ, QR, copy
│   ├── RsvpPanel.jsx         # אישורי הגעה + CSV
│   ├── Countdown.jsx         # ספירה לאחור
│   └── HennaPatterns.jsx     # SVG mandala/border לחינה
├── lib/
│   ├── themes.js             # מאגר נושאים + צמדי פונטים + סוגי אירוע
│   ├── calendar.js           # ICS + Google/Outlook/Yahoo URLs
│   └── state.js              # ברירות מחדל, encode/decode ל-URL, פורמט עברי
└── index.css                 # Tailwind + helpers (glass, shimmer, etc.)
```

## ✦ ערכות נושא

| Theme         | Vibe                                 | Motif      |
| ------------- | ------------------------------------ | ---------- |
| Cosmos        | גלקסיה אבק כוכבים                    | כוכבים     |
| Aurora        | זוהר צפוני                           | סרטי אור   |
| Desert Henna  | מדבר זהוב + תבליני שוק              | חינה       |
| Rose Gold     | שמפניה ורוד-זהב                     | עלי כותרת  |
| Oceanic       | מעמקים זרחניים                      | בועות      |

קל מאוד להוסיף נושא חדש: ערכו את `src/lib/themes.js` והוסיפו אובייקט עם
שלושה צבעי רקע + 3 צבעי הדגשה + שם מוטיב מתוך `CosmicBackground.jsx`.

## ✦ קישור שיתוף — איך זה עובד

כל שינוי בבילדר מקודד את האובייקט המלא של ההזמנה ל-Base64 ומופיע ב-URL:

```
https://your-domain.example/#inv=<token>
```

כשמישהו פותח את הקישור, האפליקציה מזהה את ה-Token, טוענת ממנו את ההזמנה,
וקופצת אוטומטית למצב **חוויית אורח** עם כפתור הוספה ליומן, ניווט במפות,
ושידור חי (אם הגדרתם).

## ✦ מפת דרכים

- [x] PWA + שמירה לאופליין
- [x] אחסון RSVP בענן (Supabase) עם fallback ל-localStorage
- [x] קונפיגי deploy ל-Vercel / Netlify / GitHub Pages
- [ ] שמירת ההזמנות בענן עם ID קצר (במקום Hash ארוך) ושיתוף קצר
- [ ] גלריית תמונות / סרטון רקע בכרטיס
- [ ] עוד נושאים: "Botanical", "Mediterranean", "Glassmorphism Day"
- [ ] תרגום אנגלית/ערבית/רוסית
- [ ] שילוב WhatsApp Business API לשליחה אוטומטית לרשימת מוזמנים

## ✦ תרומה

PRs מבורכים. נסו לשמור על:
- קומפוננטות קטנות וקריאות
- אנימציות בלי לפגוע ב-CPU על מובייל (השתמשו ב-`will-change`, רענון rAF, וכו')
- עברית RTL מלא + נגישות בסיסית

## ✦ רישיון

MIT © Luminara Invitation Builder Contributors
