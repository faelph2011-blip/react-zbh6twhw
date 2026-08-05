-- ============================================================
-- MIGRAÇÃO → loja compartilhada
-- Rode este arquivo UMA vez no SQL Editor do Supabase se você já
-- tinha criado a tabela antiga "erp_state" (1 linha por usuário).
-- Ele cria a loja compartilhada e COPIA seus dados atuais pra ela,
-- sem apagar nada. Pode rodar sem medo.
-- ============================================================

create table if not exists public.loja_state (
  id         text        primary key default 'principal',
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

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

-- Copia os dados que já existiam (a linha mais recente) para a loja
-- compartilhada. Se a tabela antiga não existir, este passo é ignorado.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'erp_state') then
    insert into public.loja_state (id, data, updated_at)
    select 'principal', data, updated_at
      from public.erp_state
     order by updated_at desc
     limit 1
    on conflict (id) do update
      set data = excluded.data, updated_at = excluded.updated_at;
  end if;
end $$;
