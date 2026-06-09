create table public.decisions (
  id          uuid primary key,
  creator     text not null,
  prompt      text not null,
  created_at  timestamptz not null default now()
);

create table public.opinions (
  id           uuid primary key default gen_random_uuid(),
  decision_id  uuid not null references public.decisions (id) on delete cascade,
  author       text not null,
  opinion      text not null,
  created_at   timestamptz not null default now()
)
