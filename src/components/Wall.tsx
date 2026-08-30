import { EntryRow } from '@/components/EntryRow';
import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import type { Entry, Stats } from '@/types/entry';

type Props = {
  entries: Entry[];
  backed: Set<string>;
  stats: Stats;
  ranked: boolean;
  emptyTitle: string;
  emptyBody: string;
};

export function Wall({ entries, backed, stats, ranked, emptyTitle, emptyBody }: Props) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-2.5">
        <h2 className="fy-poster text-[clamp(1.75rem,7vw,2.5rem)] leading-[0.95] normal-case">
          {t('wall.title')}
        </h2>
        <span className="fy-type text-[11px] text-ink-70 tabular-nums">
          {t('wall.tally', {
            names: formatNumber(stats.people),
            backing: formatNumber(stats.signatures),
          })}
        </span>
      </div>
      <p className="mt-0.5 font-medium text-ink-70">{t('wall.sub')}</p>
      <svg className="fy-draw mt-1 block h-4 w-[130px] text-ink" data-anim aria-hidden="true">
        <use href="#d-scribble" />
      </svg>

      {entries.length === 0 ? (
        <div className="fy-cut mt-3.5 p-6 text-center">
          <p className="fy-poster text-3xl normal-case">{emptyTitle}</p>
          <p className="mt-1 text-sm text-ink-70">{emptyBody}</p>
        </div>
      ) : (
        <ul className="mt-3.5 grid gap-3">
          {entries.map((entry, index) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              rank={ranked ? index + 1 : null}
              backed={backed.has(entry.id)}
              lead={ranked && index === 0}
            />
          ))}
        </ul>
      )}
    </>
  );
}
