// ============================================================
// FILA DE PEDIDOS DA LOJA ONLINE
// ------------------------------------------------------------
// O visitante NÃO está logado, então ele não pode gravar no estado
// compartilhado (loja_state) — as regras de segurança exigem login.
// Para o pedido chegar no painel, o visitante apenas INSERE uma linha
// nesta tabela append-only (pedidos_online). O painel do dono (logado)
// puxa esses pedidos e os absorve no ERP, marcando como processados.
// ============================================================
import { getSupabase } from "./client";

const TABELA = "pedidos_online";

// Visitante cria um pedido (único direito dele nesta tabela).
export async function enviarPedidoOnline(payload) {
  const sb = getSupabase();
  if (!sb) return { ok: false, erro: "offline" };
  const { data, error } = await sb
    .from(TABELA)
    .insert({ payload })
    .select("id")
    .maybeSingle();
  if (error) return { ok: false, erro: error.message };
  return { ok: true, id: data ? data.id : null };
}

// Painel (logado) lê os pedidos ainda não absorvidos.
export async function puxarPedidosOnline() {
  const sb = getSupabase();
  if (!sb) return { data: [] };
  const { data, error } = await sb
    .from(TABELA)
    .select("id, criado_at, payload")
    .eq("processado", false)
    .order("criado_at", { ascending: true });
  if (error) return { data: [], erro: error.message };
  return { data: data || [] };
}

// Marca os pedidos como já absorvidos no ERP.
export async function marcarPedidosProcessados(ids) {
  const sb = getSupabase();
  if (!sb || !ids || !ids.length) return { ok: true };
  const { error } = await sb.from(TABELA).update({ processado: true }).in("id", ids);
  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}
