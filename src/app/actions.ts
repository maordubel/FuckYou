'use server';

import { revalidatePath } from 'next/cache';
import { addEntry, reportEntry, voteEntry } from '@/lib/data';
import { getVoterId } from '@/lib/voter';
import type { ActionResult } from '@/types/entry';

export async function addAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const voter = await getVoterId();
  if (!voter) return { ok: false, error: 'generic' };

  const name = String(formData.get('name') ?? '');
  const rawReason = String(formData.get('reason') ?? '').trim();
  const result = await addEntry(name, rawReason === '' ? null : rawReason, voter);

  if (result.ok) revalidatePath('/');
  return result;
}

export async function voteAction(id: string): Promise<ActionResult> {
  const voter = await getVoterId();
  if (!voter) return { ok: false, error: 'generic' };

  const result = await voteEntry(id, voter);
  if (result.ok) revalidatePath('/');
  return result;
}

export async function reportAction(id: string): Promise<ActionResult> {
  const voter = await getVoterId();
  if (!voter) return { ok: false, error: 'generic' };

  const result = await reportEntry(id, voter);
  if (result.ok) revalidatePath('/');
  return result;
}
