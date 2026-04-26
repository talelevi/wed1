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

האפליקציה היא 100% סטטית אחרי `npm run build` ולכן מתאימה ל:
- **Vercel** / **Netlify** / **Cloudflare Pages** – חברו את הריפו, הם יזהו `vite` אוטומטית.
- **GitHub Pages** – העלו את התיקייה `dist/` לסניף `gh-pages`.
- **Firebase Hosting** / **S3 + CloudFront**.

> אין שרת. הכל רץ בדפדפן. ה-state של ההזמנה נשמר ב-URL Hash (`#inv=...`) כך
> שכל קישור ששלחת מכיל את ההזמנה כולה.

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

- [ ] שמירת ההזמנות בענן (Supabase / Firebase) עם ID קצר במקום Hash ארוך.
- [ ] גלריית תמונות / סרטון רקע בכרטיס.
- [ ] עוד נושאים: "Botanical", "Mediterranean", "Glassmorphism Day".
- [ ] תרגום אנגלית/ערבית/רוסית.
- [ ] PWA + שמירה לאופליין.
- [ ] שילוב WhatsApp Business API לשליחה אוטומטית לרשימת מוזמנים.

## ✦ תרומה

PRs מבורכים. נסו לשמור על:
- קומפוננטות קטנות וקריאות
- אנימציות בלי לפגוע ב-CPU על מובייל (השתמשו ב-`will-change`, רענון rAF, וכו')
- עברית RTL מלא + נגישות בסיסית

## ✦ רישיון

MIT © Luminara Invitation Builder Contributors
