create table public.decisions (
  id          uuid primary key,
  creator     text not null,
  prompt      text not null,
  created_at  timestamptz not null default now()
);
