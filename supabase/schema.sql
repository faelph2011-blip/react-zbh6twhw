-- ============================================================
-- Pudins da Lauren — estrutura do banco na nuvem (Supabase)
-- Modelo: LOJA COMPARTILHADA — todos os admins autorizados
-- (Raphael, Vitoria...) veem e editam os MESMOS dados.
-- ------------------------------------------------------------
-- COMO USAR (instalação nova): cole tudo no SQL Editor e Run.
-- (Se você já tinha rodado a versão antiga com "erp_state",
--  use o arquivo supabase/migracao-loja-compartilhada.sql.)
-- ============================================================

-- Uma única linha guarda TODO o estado do ERP (vendas, pedidos,
-- estoque, financeiro...) como um objeto JSON.
create table if not exists public.loja_state (
  id         text        primary key default 'principal',
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Segurança: qualquer admin logado acessa a loja; quem não está
-- logado não vê nada. (Controle de quem pode entrar é feito
-- desligando o cadastro público no Supabase após criar as contas.)
alter table public.loja_state enable row level security;

drop policy if exists "loja_read" on public.loja_state;
create policy "loja_read"
  on public.loja_state for select
  using (auth.uid() is not null);

drop policy if exists "loja_insert" on public.loja_state;
create policy "loja_insert"
  on public.loja_state for insert
  with check (auth.uid() is not null);

drop policy if exists "loja_update" on public.loja_state;
create policy "loja_update"
  on public.loja_state for update
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- ============================================================
-- FILA DE PEDIDOS DA LOJA ONLINE (pedidos_online)
-- ------------------------------------------------------------
-- O cliente da loja NÃO está logado, então ele não pode gravar no
-- estado compartilhado. Para o pedido chegar no painel, ele apenas
-- INSERE uma linha aqui. O painel do dono (logado) lê, absorve no ERP
-- e marca como processado.
-- ============================================================
create table if not exists public.pedidos_online (
  id         uuid        primary key default gen_random_uuid(),
  criado_at  timestamptz not null default now(),
  payload    jsonb       not null,
  processado boolean     not null default false
);

alter table public.pedidos_online enable row level security;

-- Qualquer visitante pode CRIAR um pedido (apenas inserir).
drop policy if exists "pedido_online_insert" on public.pedidos_online;
create policy "pedido_online_insert"
  on public.pedidos_online for insert
  to anon, authenticated
  with check (true);

-- Só admin logado LÊ os pedidos.
drop policy if exists "pedido_online_select" on public.pedidos_online;
create policy "pedido_online_select"
  on public.pedidos_online for select
  to authenticated
  using (true);

-- Só admin logado MARCA como processado.
drop policy if exists "pedido_online_update" on public.pedidos_online;
create policy "pedido_online_update"
  on public.pedidos_online for update
  to authenticated
  using (true)
  with check (true);
