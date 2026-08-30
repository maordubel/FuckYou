import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isLive } from '@/lib/env';

let cached: SupabaseClient | null = null;

/**
 * Server-side anon client. Reads go through RLS (select on non-hidden rows only);
 * every write goes through a SECURITY DEFINER RPC. service_role is never used here.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isLive) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
