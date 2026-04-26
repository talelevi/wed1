// Unified RSVP store. Uses Supabase when env vars are set, otherwise
// falls back to localStorage. The component code is identical either way.
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const EVENT_ID = import.meta.env.VITE_DEFAULT_EVENT_ID || 'default';

let _client = null;
export function getClient() {
  if (_client) return _client;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  _client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });
  return _client;
}

export const isCloud = () => !!getClient();

const LS_KEY = 'luminara:rsvp';
const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
};
const writeLocal = (rows) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch { /* quota */ }
};

export async function listRsvps(eventId = EVENT_ID) {
  const client = getClient();
  if (!client) return readLocal();
  const { data, error } = await client
    .from('rsvps')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) {
    console.warn('[Luminara] cloud list failed, using local cache:', error.message);
    return readLocal();
  }
  return data.map(normalize);
}

export async function addRsvp(input, eventId = EVENT_ID) {
  const client = getClient();
  const row = {
    event_id: eventId,
    name: String(input.name || '').trim(),
    phone: String(input.phone || '').trim(),
    count: Number(input.count || 1),
    attending: input.attending || 'yes',
    note: String(input.note || '').trim(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
  if (!row.name) throw new Error('שם חסר');

  if (!client) {
    const next = [{ ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...readLocal()];
    writeLocal(next);
    return next[0];
  }

  const { data, error } = await client.from('rsvps').insert(row).select().single();
  if (error) {
    // Cloud failed — write locally so the guest never loses their response.
    console.warn('[Luminara] cloud insert failed, falling back local:', error.message);
    const next = [{ ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...readLocal()];
    writeLocal(next);
    return next[0];
  }
  return normalize(data);
}

export async function clearRsvps(eventId = EVENT_ID) {
  const client = getClient();
  if (!client) {
    writeLocal([]);
    return;
  }
  // Anon role can only clear by hitting RLS-allowed deletes. We just clear local cache;
  // wiping the cloud should be done from the Supabase dashboard.
  writeLocal([]);
}

export function subscribeRsvps(onChange, eventId = EVENT_ID) {
  const client = getClient();
  if (!client) return () => {};
  const ch = client
    .channel(`rsvps:${eventId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventId}` },
      () => onChange()
    )
    .subscribe();
  return () => {
    try { client.removeChannel(ch); } catch { /* ignore */ }
  };
}

function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || '',
    count: row.count ?? 1,
    attending: row.attending,
    note: row.note || '',
    ts: row.created_at || row.ts || new Date().toISOString(),
  };
}

export function useRsvps(eventId = EVENT_ID) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await listRsvps(eventId);
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await listRsvps(eventId);
      if (alive) {
        setRows(data);
        setLoading(false);
      }
    })();
    const unsub = subscribeRsvps(refresh, eventId);
    return () => {
      alive = false;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return { rows, loading, refresh, setRows };
}
