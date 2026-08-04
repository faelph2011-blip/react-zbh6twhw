-- ============================================================
-- Pudins da Lauren — estrutura do banco na nuvem (Supabase)
-- ------------------------------------------------------------
-- COMO USAR:
--   1. No painel do Supabase, abra "SQL Editor"
--   2. Clique em "New query"
--   3. Cole TODO este arquivo e clique em "Run"
--   Pronto — a tabela e as regras de segurança estarão criadas.
-- ============================================================

-- Uma linha por usuário guarda TODO o estado do ERP (vendas,
-- pedidos, estoque, financeiro...) como um objeto JSON.
create table if not exists public.erp_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Segurança em nível de linha: cada dono só enxerga e mexe nos
-- SEUS próprios dados. Ninguém acessa os dados de outra pessoa.
alter table public.erp_state enable row level security;

drop policy if exists "erp_state_select_own" on public.erp_state;
create policy "erp_state_select_own"
  on public.erp_state for select
  using (auth.uid() = user_id);

drop policy if exists "erp_state_insert_own" on public.erp_state;
create policy "erp_state_insert_own"
  on public.erp_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "erp_state_update_own" on public.erp_state;
create policy "erp_state_update_own"
  on public.erp_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
