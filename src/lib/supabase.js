import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
====================================================
  SUPABASE SQL SCHEMA — à exécuter dans l'éditeur SQL
====================================================

-- 1. TABLE BETS
create table public.bets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  creator     text not null,
  gain        text not null,
  end_date    date not null,
  created_at  timestamptz default now()
);

-- 2. TABLE CHOICES
create table public.choices (
  id      uuid primary key default gen_random_uuid(),
  bet_id  uuid references public.bets(id) on delete cascade,
  label   text not null,
  position int default 0
);

-- 3. TABLE VOTES
create table public.votes (
  id           uuid primary key default gen_random_uuid(),
  bet_id       uuid references public.bets(id) on delete cascade,
  choice_id    uuid references public.choices(id) on delete cascade,
  voter_name   text not null,
  voter_token  text not null,
  created_at   timestamptz default now(),
  unique(bet_id, voter_token)
);

-- 4. RLS — lecture publique, écriture libre (pas d'auth requise)
alter table public.bets    enable row level security;
alter table public.choices enable row level security;
alter table public.votes   enable row level security;

create policy "bets_read"   on public.bets    for select using (true);
create policy "bets_insert" on public.bets    for insert with check (true);

create policy "choices_read"   on public.choices for select using (true);
create policy "choices_insert" on public.choices for insert with check (true);

create policy "votes_read"   on public.votes for select using (true);
create policy "votes_insert" on public.votes for insert with check (true);

-- 5. Vue pratique : nombre de votes par choice
create view public.vote_counts as
  select choice_id, count(*) as total
  from public.votes
  group by choice_id;

====================================================
*/
