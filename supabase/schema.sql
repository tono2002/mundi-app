-- Bares registrados por sus dueños
create table bars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  address text,
  lat double precision,
  lng double precision,
  phone text,
  website text,
  photos text[] default '{}',
  created_at timestamptz default now()
);

-- Partidos del Mundial 2026
create table matches (
  id uuid primary key default gen_random_uuid(),
  home_team text not null,
  away_team text not null,
  match_date timestamptz not null,
  round text not null,          -- 'Fase de grupos', 'Octavos', etc.
  group_stage text              -- 'Grupo A', null si es eliminatoria
);

-- Qué partidos emite cada bar
create table bar_matches (
  id uuid primary key default gen_random_uuid(),
  bar_id uuid references bars(id) on delete cascade not null,
  match_id uuid references matches(id) on delete cascade not null,
  comments text,
  special_offer text,
  unique(bar_id, match_id)
);

-- RLS: solo el dueño puede editar su bar
alter table bars enable row level security;
create policy "Dueño puede leer y editar su bar"
  on bars for all
  using (auth.uid() = owner_id);
create policy "Cualquiera puede leer bares"
  on bars for select
  using (true);

-- RLS: partidos son públicos
alter table matches enable row level security;
create policy "Partidos son públicos"
  on matches for select
  using (true);

-- RLS: bar_matches
alter table bar_matches enable row level security;
create policy "Cualquiera puede leer bar_matches"
  on bar_matches for select
  using (true);
create policy "Dueño puede gestionar sus bar_matches"
  on bar_matches for all
  using (
    auth.uid() = (select owner_id from bars where id = bar_id)
  );
