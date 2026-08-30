import { EntryCard } from '@/components/EntryCard';
import { t } from '@/lib/i18n';
import type { Entry } from '@/types/entry';

/**
 * Mobile: a vertical poster — #1 full width, then #2 and #3 beneath it.
 * Desktop: a three-across podium with #1 in the lead column.
 */
export function Podium({ entries, signed }: { entries: Entry[]; signed: Set<string> }) {
  if (entries.length === 0) return null;

  return (
    <section aria-label={t('entry.podium')} className="flex flex-col gap-4 lg:grid lg:grid-cols-[1.35fr_1fr_1fr] lg:items-start">
      {entries.map((entry, index) => (
        <div key={entry.id} className="min-w-0">
          <EntryCard
            entry={entry}
            rank={index + 1}
            signed={signed.has(entry.id)}
            tone={index === 0 ? 'hero' : 'row'}
          />
        </div>
      ))}
    </section>
  );
}
