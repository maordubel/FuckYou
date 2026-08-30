import pool from '@/lib/bot/names.json';
import { addEntry, voteEntry } from '@/lib/data';

type Pools = typeof pool;
type Lang = keyof Pools['pools'];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function between(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** English is the house language, so it wins the draw about half the time. */
function pickLanguage(): Lang {
  const weights = pool.weights as Record<string, number>;
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  let roll = Math.random() * total;
  for (const [lang, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) return lang as Lang;
  }
  return 'en' as Lang;
}

function pickName(lang: Lang): string {
  const group = pool.pools[lang];
  // Archetypes carry the joke; personal names keep the wall looking real.
  const useArchetype = Math.random() < (lang === ('en' as Lang) ? 0.55 : 0.4);
  const list = useArchetype ? group.archetypes : group.people;
  return pick(list as readonly string[]);
}

export type SeedResult = { name: string; lang: string; status: string; backing: number };

/**
 * One day's worth: two to four names, mixed languages, each landing with a
 * handful of backing so the wall reads as a place people already use.
 * Everything goes through fy_add / fy_vote like any visitor, so the duplicate
 * merge, the content guard and the rate limits all still apply.
 */
export async function seedDay(count = between(2, 4)): Promise<SeedResult[]> {
  const done: SeedResult[] = [];

  for (let i = 0; i < count; i += 1) {
    const lang = pickLanguage();
    const name = pickName(lang);
    const reason = pick(pool.reasons);

    const created = await addEntry(name, reason, crypto.randomUUID());
    if (!created.ok) {
      done.push({ name, lang: String(lang), status: created.error, backing: 0 });
      continue;
    }

    const id = created.id;
    const backers = between(1, 6);
    let backing = 0;

    if (id) {
      for (let b = 0; b < backers; b += 1) {
        const vote = await voteEntry(id, crypto.randomUUID());
        if (vote.ok && vote.status === 'signed') backing += 1;
      }
    }

    done.push({ name, lang: String(lang), status: created.status, backing });
  }

  return done;
}
