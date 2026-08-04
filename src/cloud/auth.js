// ============================================================
// AUTENTICAÇÃO NA NUVEM (e-mail + senha via Supabase Auth)
// Substitui o PIN quando a nuvem está ligada. Protege os dados
// do negócio e dos clientes (LGPD) e permite acesso de qualquer
// aparelho com o mesmo login.
// ============================================================
import { getSupabase } from "./client";

// Traduz mensagens comuns do Supabase para português amigável.
function traduzErro(msg = "") {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (m.includes("user already registered")) return "Esse e-mail já tem conta. Faça login normalmente.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email")) return "E-mail inválido.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Aguarde um instante e tente de novo.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Sem conexão com a nuvem. Verifique sua internet.";
  return msg || "Não foi possível concluir. Tente novamente.";
}

export async function entrar(email, senha) {
  const sb = getSupabase();
  if (!sb) return { ok: false, erro: "Nuvem não configurada." };
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password: senha });
  if (error) return { ok: false, erro: traduzErro(error.message) };
  return { ok: true, session: data.session, user: data.user };
}

export async function criarConta(email, senha) {
  const sb = getSupabase();
  if (!sb) return { ok: false, erro: "Nuvem não configurada." };
  const { data, error } = await sb.auth.signUp({ email: email.trim(), password: senha });
  if (error) return { ok: false, erro: traduzErro(error.message) };
  // Se a confirmação de e-mail estiver desligada, já vem sessão.
  return { ok: true, session: data.session, user: data.user, precisaConfirmar: !data.session };
}

export async function sair() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
}

export async function sessaoAtual() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

// Recebe uma função e é chamada sempre que o login muda (entrar/sair).
// Retorna uma função para cancelar a inscrição.
export function aoMudarAuth(callback) {
  const sb = getSupabase();
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
