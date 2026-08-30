export type Entry = {
  id: string;
  name: string;
  reason: string | null;
  votes: number;
  createdAt: string;
};

export type Stats = {
  people: number;
  signatures: number;
};

export type SortMode = 'top' | 'new';

export type ActionStatus = 'created' | 'signed' | 'already' | 'reported';

export type ActionResult =
  | { ok: true; status: ActionStatus; name?: string; id?: string; votes?: number }
  | { ok: false; error: string };
