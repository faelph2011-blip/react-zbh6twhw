// ============================================================
// CLIENTE SUPABASE (singleton)
// Cria o cliente só quando a nuvem está configurada.
// Se não houver chaves, retorna null e o app segue offline
// (salvando no navegador, como antes).
// ============================================================
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, cloudEnabled } from "./config";

let _client = null;

export function getSupabase() {
  if (!cloudEnabled) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}
