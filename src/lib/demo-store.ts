import type { ActionResult, Entry, SortMode } from '@/types/entry';
import { nameKey } from '@/lib/text';

type DemoRow = Entry & { nameKey: string; reports: Set<string>; hidden: boolean };

type DemoStore = {
  rows: DemoRow[];
  votes: Map<string, Set<string>>;
};

const globalRef = globalThis as unknown as { __fyDemo?: DemoStore };

const SEED: Array<[string, string | null, number, number]> = [
  ['The guy on the 7:40 train', 'Ruined my day', 214, 9],
  ['Whoever says "we\'ll get back to you"', 'Lied to me', 187, 8],
  ['משה כהן', 'Annoying AF', 143, 6],
  ['My upstairs neighbour', 'Toxic', 96, 4],
  ['The one who read it and said nothing', 'Ghosted me', 74, 3],
  ['Whoever parked across two spaces', 'Just… fuck them', 51, 2],
];

function createStore(): DemoStore {
  const now = Date.now();
  const rows: DemoRow[] = SEED.map(([name, reason, votes, daysAgo], index) => ({
    id: `demo-${index + 1}`,
    name,
    reason,
    votes,
    createdAt: new Date(now - daysAgo * 86_400_000).toISOString(),
    nameKey: nameKey(name),
    reports: new Set<string>(),
    hidden: false,
  }));
  return { rows, votes: new Map() };
}

function store(): DemoStore {
  if (!globalRef.__fyDemo) globalRef.__fyDemo = createStore();
  return globalRef.__fyDemo;
}

function toEntry(row: DemoRow): Entry {
  return { id: row.id, name: row.name, reason: row.reason, votes: row.votes, createdAt: row.createdAt };
}

export function demoList(sort: SortMode, query: string, limit: number): Entry[] {
  const q = query.trim().toLowerCase();
  return store()
    .rows.filter((row) => !row.hidden && (q === '' || row.name.toLowerCase().includes(q)))
    .sort((a, b) =>
      sort === 'top'
        ? b.votes - a.votes || b.createdAt.localeCompare(a.createdAt)
        : b.createdAt.localeCompare(a.createdAt),
    )
    .slice(0, limit)
    .map(toEntry);
}

export function demoLookup(name: string): Entry | null {
  const key = nameKey(name);
  if (key.length < 2) return null;
  const row = store().rows.find((item) => item.nameKey === key && !item.hidden);
  return row ? toEntry(row) : null;
}

export function demoGet(id: string): Entry | null {
  const row = store().rows.find((item) => item.id === id && !item.hidden);
  return row ? toEntry(row) : null;
}

export function demoStats() {
  const rows = store().rows.filter((row) => !row.hidden);
  return { people: rows.length, signatures: rows.reduce((sum, row) => sum + row.votes, 0) };
}

export function demoSignedIds(voter: string): string[] {
  const signed: string[] = [];
  store().votes.forEach((voters, entryId) => {
    if (voters.has(voter)) signed.push(entryId);
  });
  return signed;
}

function sign(entryId: string, voter: string): boolean {
  const current = store().votes.get(entryId) ?? new Set<string>();
  if (current.has(voter)) return false;
  current.add(voter);
  store().votes.set(entryId, current);
  return true;
}

export function demoAdd(name: string, reason: string | null, voter: string): ActionResult {
  const key = nameKey(name);
  if (key.length < 2) return { ok: false, error: 'short' };
  if (name.trim().length > 40) return { ok: false, error: 'long' };
  if (reason && reason.length > 120) return { ok: false, error: 'reasonLong' };

  const existing = store().rows.find((row) => row.nameKey === key);
  if (existing) {
    const first = sign(existing.id, voter);
    if (first) existing.votes += 1;
    return { ok: true, status: first ? 'signed' : 'already', name: existing.name, id: existing.id, votes: existing.votes };
  }

  const row: DemoRow = {
    id: `demo-${Date.now().toString(36)}`,
    name: name.trim(),
    reason,
    votes: 1,
    createdAt: new Date().toISOString(),
    nameKey: key,
    reports: new Set<string>(),
    hidden: false,
  };
  store().rows.push(row);
  sign(row.id, voter);
  return { ok: true, status: 'created', name: row.name, id: row.id, votes: 1 };
}

export function demoVote(id: string, voter: string): ActionResult {
  const row = store().rows.find((item) => item.id === id && !item.hidden);
  if (!row) return { ok: false, error: 'notFound' };
  const first = sign(row.id, voter);
  if (first) row.votes += 1;
  return { ok: true, status: first ? 'signed' : 'already', id: row.id, name: row.name, votes: row.votes };
}

export function demoReport(id: string, voter: string): ActionResult {
  const row = store().rows.find((item) => item.id === id);
  if (!row) return { ok: false, error: 'notFound' };
  row.reports.add(voter);
  if (row.reports.size >= 3) row.hidden = true;
  return { ok: true, status: 'reported', id: row.id };
}
