-- Migration: members (Isca 4 — Área de Membros / Curso Gratuito)
-- Rollback: drop table public.members;

-- Perfil mínimo do membro. A conta em si vive em auth.users (Supabase Auth).
create table if not exists public.members (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nome       text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS — usuário autenticado lê SÓ o próprio perfil.
-- Insert/update é feito pelo server (service_role) no endpoint de cadastro.
-- ---------------------------------------------------------------------------
alter table public.members enable row level security;

create policy "members_select_own"
  on public.members
  for select
  to authenticated
  using (user_id = auth.uid());
