import { cookies } from 'next/headers';

export const VOTER_COOKIE = 'fy_voter';

/** Anonymous, per-browser signature identity. Set by middleware, never tied to a person. */
export async function getVoterId(): Promise<string> {
  const store = await cookies();
  return store.get(VOTER_COOKIE)?.value ?? '';
}
