// ============================================================
// SINCRONIZAÇÃO DO ESTADO COM A NUVEM (loja compartilhada)
// O ERP inteiro é um único objeto JSON (db). Guardamos ele em UMA
// linha compartilhada (id = WORKSPACE_ID). Assim, todos os admins
// autorizados (Raphael, Vitoria...) veem e editam os mesmos dados.
// ============================================================
import { getSupabase } from "./client";
import { CLOUD_TABLE, WORKSPACE_ID } from "./config";

// Lê o estado da loja na nuvem.
// Retorna: { data } com o objeto, ou { data: null } se ainda não existe.
export async function puxarEstado() {
  const sb = getSupabase();
  if (!sb) return { data: null, erro: "Nuvem não configurada." };
  const { data, error } = await sb
    .from(CLOUD_TABLE)
    .select("data, updated_at")
    .eq("id", WORKSPACE_ID)
    .maybeSingle();
  if (error) return { data: null, erro: error.message };
  return { data: data ? data.data : null, updatedAt: data ? data.updated_at : null };
}

// Grava (upsert) o estado da loja na nuvem.
export async function gravarEstado(estado) {
  const sb = getSupabase();
  if (!sb) return { ok: false, erro: "Nuvem não configurada." };
  const { error } = await sb
    .from(CLOUD_TABLE)
    .upsert(
      { id: WORKSPACE_ID, data: estado, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}
