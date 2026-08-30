'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isLive } from '@/lib/env';

let cached: SupabaseClient | null = null;

/** Read-only in the browser, and only used to listen for changes. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isLive) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return cached;
}
