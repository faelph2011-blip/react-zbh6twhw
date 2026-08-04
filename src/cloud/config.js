// ============================================================
// CONFIGURAÇÃO DA NUVEM (Supabase)
// ------------------------------------------------------------
// Aqui ficam as 2 chaves do seu projeto Supabase.
//
// COMO PREENCHER (quando criar a conta):
//   1. Entre em https://supabase.com  →  seu projeto
//   2. Menu: Project Settings (⚙️)  →  API
//   3. Copie:
//        • "Project URL"        → cole em SUPABASE_URL abaixo
//        • "anon public" key    → cole em SUPABASE_ANON_KEY abaixo
//
// Pode compartilhar esses 2 valores sem medo — a chave "anon"
// é pública por design (a segurança de verdade fica nas regras
// do banco, que já configuramos no arquivo supabase/schema.sql).
//
// Enquanto estiverem vazios, o sistema funciona normal salvando
// no próprio navegador (localStorage). Assim que você colar os
// valores, a nuvem liga sozinha. 👍
//
// Dica: no Vercel dá pra usar variáveis de ambiente
// (REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY) — se
// estiverem definidas, elas têm prioridade sobre o que está aqui.
// ============================================================

// 👇 COLE AQUI (ou deixe vazio e use variáveis de ambiente no Vercel)
// Projeto "Pudins da Lauren". A chave anon é pública por design — a
// segurança dos dados fica nas regras do banco (RLS em supabase/schema.sql).
const SUPABASE_URL_MANUAL = "https://cazltxrsvtjdnzzlrkhz.supabase.co";
const SUPABASE_ANON_KEY_MANUAL = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhemx0eHJzdnRqZG56emxya2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MjEwMzUsImV4cCI6MjEwMTM5NzAzNX0.oCt_rByHRbWh59T_8fNP7BShb445tw5MkUTVWUbHzmM";

// O Create React App troca "process.env.REACT_APP_*" pelo valor real
// na hora do build. Prioriza a variável de ambiente (Vercel); se não
// houver, usa o valor colado manualmente acima.
const ENV_URL = process.env.REACT_APP_SUPABASE_URL || "";
const ENV_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const SUPABASE_URL = ENV_URL || SUPABASE_URL_MANUAL || "";
export const SUPABASE_ANON_KEY = ENV_KEY || SUPABASE_ANON_KEY_MANUAL || "";

// Nome da tabela que guarda o estado do ERP (1 linha por usuário).
export const CLOUD_TABLE = "erp_state";

// A nuvem só liga quando as duas chaves existem.
export const cloudEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
