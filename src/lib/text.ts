import { numberLocale } from '@/lib/i18n';

/**
 * Mirrors public.fy_name_key() in supabase/migrations/0001_init.sql.
 * Keep the two in sync: the database is the authority, this is only for previews.
 */
export function nameKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .replace(/\s+/g, ' ');
}

/** Deterministic 32-bit FNV-1a. No random(), no clock: the same name always gets the same line. */
export function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function pickDeterministic<T>(items: readonly T[], seed: string): T {
  return items[hash(seed) % items.length];
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(numberLocale).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(numberLocale, { day: 'numeric', month: 'short' }).format(new Date(iso));
}
