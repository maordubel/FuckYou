import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase/server';

export const ADMIN_COOKIE = 'fy_admin';

export type AdminRow = {
  id: string;
  name: string;
  reason: string | null;
  votes: number;
  reports: number;
  hidden: boolean;
  created_at: string;
};

export type AuditRow = {
  at: string;
  action: string;
  entry_id: string | null;
  before: string | null;
  after: string | null;
};

type Rpc = { ok: boolean; error?: string; token?: string; rows?: unknown };

async function call(fn: string, args: Record<string, unknown>): Promise<Rpc> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: 'offline' };

  const { data, error } = await supabase.rpc(fn, args);
  if (error) return { ok: false, error: 'generic' };
  return (data ?? { ok: false, error: 'generic' }) as Rpc;
}

export async function adminToken(): Promise<string> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? '';
}

/** The password is checked in Postgres and the session lives there too — the
 *  cookie only carries a token the database issued. */
export async function adminLogin(password: string): Promise<Rpc> {
  return call('fy_admin_login', { p_password: password });
}

export async function adminLogout(token: string): Promise<Rpc> {
  return call('fy_admin_logout', { p_token: token });
}

export async function adminList(token: string, query: string): Promise<{ ok: boolean; rows: AdminRow[]; error?: string }> {
  const result = await call('fy_admin_list', { p_token: token, p_query: query, p_limit: 300 });
  if (!result.ok) return { ok: false, rows: [], error: result.error };
  return { ok: true, rows: (result.rows ?? []) as AdminRow[] };
}

export async function adminAudit(token: string): Promise<AuditRow[]> {
  const result = await call('fy_admin_audit', { p_token: token, p_limit: 40 });
  if (!result.ok) return [];
  return (result.rows ?? []) as AuditRow[];
}

export async function adminUpdate(
  token: string,
  id: string,
  patch: { name?: string; reason?: string; votes?: number; hidden?: boolean },
): Promise<Rpc> {
  return call('fy_admin_update', {
    p_token: token,
    p_id: id,
    p_name: patch.name ?? null,
    p_reason: patch.reason ?? null,
    p_votes: patch.votes ?? null,
    p_hidden: patch.hidden ?? null,
  });
}

export async function adminDelete(token: string, id: string): Promise<Rpc> {
  return call('fy_admin_delete', { p_token: token, p_id: id });
}
