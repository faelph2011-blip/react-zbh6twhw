// ============================================================
// ESPELHO PÚBLICO DO CATÁLOGO (estoque + preço)
// ------------------------------------------------------------
// A loja do cliente (visitante, sem login) não pode ler o estado
// completo (loja_state é privado). Para a vitrine refletir o estoque
// real do painel, o dono publica aqui um snapshot enxuto e público —
// só id, estoque e preço de cada produto (nada sensível). O visitante
// lê este snapshot e a vitrine passa a mostrar o estoque de verdade.
// ============================================================
import { getSupabase } from "./client";

const TABELA = "loja_publica";
const ID = "catalogo";

// Dono (logado) publica o snapshot do catálogo.
export async function gravarPublico(produtos) {
  const sb = getSupabase();
  if (!sb) return { ok: false };
  const data = {
    produtos: (produtos || []).map((p) => ({
      id: p.id, estoque: p.estoque, preco: p.preco, promo: p.promo, promoUnit: p.promoUnit,
    })),
    atualizado: new Date().toISOString(),
  };
  const { error } = await sb.from(TABELA).upsert({ id: ID, data, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}

// Visitante lê o snapshot público (estoque/preço ao vivo).
export async function puxarPublico() {
  const sb = getSupabase();
  if (!sb) return { data: null };
  const { data, error } = await sb.from(TABELA).select("data").eq("id", ID).maybeSingle();
  if (error) return { data: null, erro: error.message };
  return { data: data ? data.data : null };
}
