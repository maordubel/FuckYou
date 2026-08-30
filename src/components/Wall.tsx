import { EntryCard } from '@/components/EntryCard';
import { t } from '@/lib/i18n';
import type { Entry } from '@/types/entry';

type WallProps = {
  entries: Entry[];
  signed: Set<string>;
  rankOffset: number;
  ranked: boolean;
  emptyTitle: string;
  emptyBody: string;
};

export function Wall({ entries, signed, rankOffset, ranked, emptyTitle, emptyBody }: WallProps) {
  if (entries.length === 0) {
    return (
      <div className="fy-block bg-paper-2 p-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-4xl leading-none">{emptyTitle}</p>
        <p className="mt-2 text-sm text-ink-70">{emptyBody}</p>
      </div>
    );
  }

  return (
    <ul className="fy-ledger grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label={t('tabs.label')}>
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <EntryCard
            entry={entry}
            rank={ranked ? rankOffset + index + 1 : null}
            signed={signed.has(entry.id)}
          />
        </li>
      ))}
    </ul>
  );
}
