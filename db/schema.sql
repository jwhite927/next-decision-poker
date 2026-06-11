create table public.decisions (
  id          uuid primary key,
  creator     text not null,
  prompt      text not null,
  created_at  timestamptz not null default now(),
  revealed    boolean not null default false,
  round       int not null default 1
);

create table public.opinions (
  id           uuid primary key default gen_random_uuid(),
  decision_id  uuid not null references public.decisions (id) on delete cascade,
  author       text not null,
  opinion      text not null,
  created_at   timestamptz not null default now(),
  round        int not null default 1
)

create table public.device_decisions (
    device_id   uuid not null,
    decision_id uuid not null references public.decisions (id) on delete cascade,
    last_seen   timestamptz not null default now(),
    primary key (device_id, decision_id)
);

create index device_decisions_recent_idx on public.device_decisions (device_id, last_seen desc);
