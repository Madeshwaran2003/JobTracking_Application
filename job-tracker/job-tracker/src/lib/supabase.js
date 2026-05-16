import { createClient } from '@supabase/supabase-js';

// Read env vars - Vite embeds these at build time
// VITE_ prefix is required for Vite to expose them to the client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;

export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[Supabase] Not configured. VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.');
    return null;
  }
  if (!supabase) {
    console.log('[Supabase] Initializing client with URL:', SUPABASE_URL);
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

export function isSupabaseConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'Not set',
    key: SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 15)}...` : 'Not set',
    configured: isSupabaseConfigured(),
  };
}

export default getSupabase;
