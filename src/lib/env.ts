export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Without credentials the app runs on the in-memory demo store (local dev, CI, preview builds). */
export const isLive = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
