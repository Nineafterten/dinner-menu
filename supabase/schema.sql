-- Dinner Menu — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

create table if not exists meals (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  ingredients text[] not null default '{}',
  notes       text not null default '',
  ready       boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Keep updated_at fresh on every change.
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists meals_set_updated_at on meals;
create trigger meals_set_updated_at
  before update on meals
  for each row execute function set_updated_at();

-- This is a trusted household tool with no auth (soft edit lock in the UI).
-- RLS is enabled but a permissive policy lets the anon key read/write.
-- If you later want to lock it down, tighten these policies.
alter table meals enable row level security;

drop policy if exists "anon full access" on meals;
create policy "anon full access" on meals
  for all using (true) with check (true);

-- Realtime: broadcast changes so other devices update live.
alter publication supabase_realtime add table meals;
