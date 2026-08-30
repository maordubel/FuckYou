export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fuckyou.dubelteam.com';
export const SITE_HOST = 'fuckyou.dubelteam.com';

export function entryUrl(id: string): string {
  return `${SITE_URL}/n/${id}`;
}

export function storyUrl(id: string): string {
  return `${SITE_URL}/n/${id}/story`;
}
