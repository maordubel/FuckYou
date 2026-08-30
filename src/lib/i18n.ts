import messages from '@/messages/en.json';

export const locale = 'en';
export const direction = 'ltr';
export const numberLocale = 'en-US';

type Vars = Record<string, string | number>;

function resolve(path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
}

/** Every user-facing string goes through here. Never hard-code copy in a component. */
export function t(key: string, vars?: Vars): string {
  const value = resolve(key);
  if (typeof value !== 'string') return key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function roastList(): readonly string[] {
  return messages.roasts;
}

/** Read a list out of the catalogue — reasons, moods, rotating placeholders. */
export function list<T>(key: string): T[] {
  const value = resolve(key);
  return Array.isArray(value) ? (value as T[]) : [];
}
