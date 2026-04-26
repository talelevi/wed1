-- Run this in the Supabase SQL editor for your project.
-- It creates a single `rsvps` table that holds responses for all events
-- you ever build with Luminara, partitioned by `event_id`.

create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null,
  name        text not null,
  phone       text,
  count       int  not null default 1 check (count between 0 and 30),
  attending   text not null check (attending in ('yes','maybe','no')),
  note        text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists rsvps_event_id_created_at_idx
  on public.rsvps (event_id, created_at desc);

-- Row Level Security: anyone with the anon key can INSERT and SELECT
-- responses for their own event. Tighten this further by binding to
-- a custom claim if you publish per-couple links.
alter table public.rsvps enable row level security;

drop policy if exists "rsvps_insert_anon" on public.rsvps;
create policy "rsvps_insert_anon"
  on public.rsvps for insert
  to anon
  with check (true);

drop policy if exists "rsvps_select_anon" on public.rsvps;
create policy "rsvps_select_anon"
  on public.rsvps for select
  to anon
  using (true);

-- Optional: realtime channel so the RSVP panel updates as guests confirm.
-- Enable in Supabase dashboard → Database → Replication → `rsvps`.
