// ============================================================
// SINCRONIZAÇÃO DO ESTADO COM A NUVEM
// O ERP inteiro é um único objeto JSON (db). Guardamos ele em
// UMA linha por usuário na tabela erp_state. Aqui ficam as
// funções de ler (pull) e gravar (push) esse estado.
// ============================================================
import { getSupabase } from "./client";
import { CLOUD_TABLE } from "./config";

// Lê o estado salvo na nuvem para o usuário logado.
// Retorna: { data } com o objeto, ou { data: null } se ainda não existe.
export async function puxarEstado(userId) {
  const sb = getSupabase();
  if (!sb) return { data: null, erro: "Nuvem não configurada." };
  const { data, error } = await sb
    .from(CLOUD_TABLE)
    .select("data, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return { data: null, erro: error.message };
  return { data: data ? data.data : null, updatedAt: data ? data.updated_at : null };
}

// Grava (upsert) o estado na nuvem para o usuário logado.
export async function gravarEstado(userId, estado) {
  const sb = getSupabase();
  if (!sb) return { ok: false, erro: "Nuvem não configurada." };
  const { error } = await sb
    .from(CLOUD_TABLE)
    .upsert(
      { user_id: userId, data: estado, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}
