'use server';

import { revalidatePath } from 'next/cache';
import { addEntry, lookupEntry, reportEntry, voteEntry } from '@/lib/data';
import { verifyTurnstile } from '@/lib/turnstile';
import { getVoterId } from '@/lib/voter';
import type { ActionResult, Entry } from '@/types/entry';

export async function addAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const voter = await getVoterId();
  if (!voter) return { ok: false, error: 'generic' };

  const human = await verifyTurnstile(String(formData.get('cf-turnstile-response') ?? ''));
  if (!human) return { ok: false, error: 'robot' };

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

/** Live duplicate check while the name is being typed. Read-only, no side effects. */
export async function lookupAction(name: string): Promise<Entry | null> {
  return lookupEntry(name);
}
