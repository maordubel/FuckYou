import { getSupabase } from '@/lib/supabase/server';
import {
  demoAdd,
  demoList,
  demoGet,
  demoLookup,
  demoReport,
  demoSignedIds,
  demoStats,
  demoVote,
} from '@/lib/demo-store';
import type { ActionResult, Entry, SortMode, Stats } from '@/types/entry';

type EntryRow = {
  id: string;
  name: string;
  reason: string | null;
  votes: number;
  created_at: string;
};

function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    name: row.name,
    reason: row.reason,
    votes: row.votes,
    createdAt: row.created_at,
  };
}

function asResult(payload: unknown): ActionResult {
  if (payload && typeof payload === 'object' && 'ok' in payload) {
    return payload as ActionResult;
  }
  return { ok: false, error: 'generic' };
}

export async function listEntries(
  sort: SortMode,
  query: string,
  limit = 60,
): Promise<Entry[]> {
  const supabase = getSupabase();
  if (!supabase) return demoList(sort, query, limit);

  let request = supabase.from('fy_entries').select('id,name,reason,votes,created_at').limit(limit);
  const trimmed = query.trim();
  if (trimmed !== '') {
    request = request.ilike('name', `%${trimmed.replace(/[%_]/g, '')}%`);
  }
  request =
    sort === 'top'
      ? request.order('votes', { ascending: false }).order('last_signed_at', { ascending: false })
      : request.order('created_at', { ascending: false });

  const { data, error } = await request;
  if (error || !data) return [];
  return (data as EntryRow[]).map(toEntry);
}

export async function lookupEntry(name: string): Promise<Entry | null> {
  if (name.trim().length < 2) return null;

  const supabase = getSupabase();
  if (!supabase) return demoLookup(name);

  const { data, error } = await supabase.rpc('fy_lookup', { p_name: name });
  if (error || !data) return null;
  return toEntry(data as EntryRow);
}

export async function getEntry(id: string): Promise<Entry | null> {
  const supabase = getSupabase();
  if (!supabase) return demoGet(id);

  const { data, error } = await supabase
    .from('fy_entries')
    .select('id,name,reason,votes,created_at')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return toEntry(data as EntryRow);
}

export async function getStats(): Promise<Stats> {
  const supabase = getSupabase();
  if (!supabase) return demoStats();

  const { data, error } = await supabase.rpc('fy_stats');
  if (error || !data) return { people: 0, signatures: 0 };
  const row = data as { people: number; signatures: number };
  return { people: Number(row.people ?? 0), signatures: Number(row.signatures ?? 0) };
}

export async function getSignedIds(voter: string): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return demoSignedIds(voter);

  const { data, error } = await supabase.rpc('fy_signed', { p_voter: voter });
  if (error || !Array.isArray(data)) return [];
  return data as string[];
}

export async function addEntry(
  name: string,
  reason: string | null,
  voter: string,
): Promise<ActionResult> {
  const supabase = getSupabase();
  if (!supabase) return demoAdd(name, reason, voter);

  const { data, error } = await supabase.rpc('fy_add', {
    p_name: name,
    p_reason: reason,
    p_voter: voter,
  });
  if (error) return { ok: false, error: 'generic' };
  return asResult(data);
}

export async function voteEntry(id: string, voter: string): Promise<ActionResult> {
  const supabase = getSupabase();
  if (!supabase) return demoVote(id, voter);

  const { data, error } = await supabase.rpc('fy_vote', { p_id: id, p_voter: voter });
  if (error) return { ok: false, error: 'generic' };
  return asResult(data);
}

export async function reportEntry(id: string, voter: string): Promise<ActionResult> {
  const supabase = getSupabase();
  if (!supabase) return demoReport(id, voter);

  const { data, error } = await supabase.rpc('fy_report', { p_id: id, p_voter: voter });
  if (error) return { ok: false, error: 'generic' };
  return asResult(data);
}
