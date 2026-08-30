import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import type { Stats } from '@/types/entry';

const FULL_SCALE = 2000;

export function RageMeter({ stats }: { stats: Stats }) {
  const level = Math.min(100, Math.round((stats.signatures / FULL_SCALE) * 100));

  return (
    <section className="fy-block-sm bg-tar p-4 text-paper" aria-label={t('stats.meter')}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-2xl leading-none text-acid">
          {t('stats.meter')}
        </h2>
        <p className="text-sm font-bold tabular-nums">{formatNumber(level)}%</p>
      </div>

      <div
        className="mt-3 h-3 w-full border-2 border-paper/70"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('stats.meter')}
      >
        <div className="h-full bg-acid" style={{ width: `${level}%` }} />
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="sr-only">{t('stats.people', { n: '' })}</dt>
          <dd className="font-bold tabular-nums">{t('stats.people', { n: formatNumber(stats.people) })}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">{t('stats.rage', { n: '' })}</dt>
          <dd className="font-bold tabular-nums">{t('stats.rage', { n: formatNumber(stats.signatures) })}</dd>
        </div>
      </dl>
    </section>
  );
}
