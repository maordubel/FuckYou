'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, adminDelete, adminLogin, adminLogout, adminToken, adminUpdate } from '@/lib/admin';

const TWELVE_HOURS = 60 * 60 * 12;

export async function loginAction(_prev: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get('password') ?? '');
  const result = await adminLogin(password);

  if (!result.ok || !result.token) {
    return result.error === 'rate' ? 'rate' : 'denied';
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, result.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/hq',
    maxAge: TWELVE_HOURS,
  });

  redirect('/hq');
}

export async function logoutAction(): Promise<void> {
  const token = await adminToken();
  if (token) await adminLogout(token);
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect('/hq');
}

export async function saveAction(formData: FormData): Promise<void> {
  const token = await adminToken();
  if (!token) return;

  const id = String(formData.get('id') ?? '');
  const votes = Number(formData.get('votes'));

  await adminUpdate(token, id, {
    name: String(formData.get('name') ?? ''),
    reason: String(formData.get('reason') ?? ''),
    votes: Number.isFinite(votes) ? votes : undefined,
    hidden: formData.get('hidden') === 'on',
  });

  revalidatePath('/hq');
  revalidatePath('/');
}

export async function deleteAction(formData: FormData): Promise<void> {
  const token = await adminToken();
  if (!token) return;

  await adminDelete(token, String(formData.get('id') ?? ''));
  revalidatePath('/hq');
  revalidatePath('/');
}
