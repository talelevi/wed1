// Calendar helpers: ICS file blob + Google/Outlook/Yahoo URLs.

const pad = (n) => String(n).padStart(2, '0');

const toUtcStamp = (iso) => {
  const d = new Date(iso);
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
};

const escapeIcs = (s = '') =>
  String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

export function buildEvent({ title, description, location, startISO, durationMinutes = 240 }) {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return { title, description, location, start, end };
}

export function buildICS(ev) {
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@luminara.invites`;
  const dtstamp = toUtcStamp(new Date().toISOString());
  const dtstart = toUtcStamp(ev.start.toISOString());
  const dtend = toUtcStamp(ev.end.toISOString());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Luminara//Invitation Builder//HE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeIcs(ev.title)}`,
    `DESCRIPTION:${escapeIcs(ev.description)}`,
    `LOCATION:${escapeIcs(ev.location)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(ev, filename = 'invitation.ics') {
  const ics = buildICS(ev);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function googleCalendarUrl(ev) {
  const fmt = (d) =>
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title || '',
    dates: `${fmt(ev.start)}/${fmt(ev.end)}`,
    details: ev.description || '',
    location: ev.location || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(ev) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: ev.title || '',
    body: ev.description || '',
    location: ev.location || '',
    startdt: ev.start.toISOString(),
    enddt: ev.end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function yahooCalendarUrl(ev) {
  const fmt = (d) =>
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z';
  const params = new URLSearchParams({
    v: '60',
    title: ev.title || '',
    st: fmt(ev.start),
    et: fmt(ev.end),
    desc: ev.description || '',
    in_loc: ev.location || '',
  });
  return `https://calendar.yahoo.com/?${params.toString()}`;
}
