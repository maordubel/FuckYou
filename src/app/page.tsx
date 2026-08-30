import { Suspense } from 'react';
import { AddForm } from '@/components/AddForm';
import { AddSheet } from '@/components/AddSheet';
import { Footer } from '@/components/Footer';
import { Podium } from '@/components/Podium';
import { RageMeter } from '@/components/RageMeter';
import { SearchBar } from '@/components/SearchBar';
import { Stamp } from '@/components/Stamp';
import { Tabs } from '@/components/Tabs';
import { Tape } from '@/components/Tape';
import { Wall } from '@/components/Wall';
import { getSignedIds, getStats, listEntries } from '@/lib/data';
import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import { getVoterId } from '@/lib/voter';
import type { SortMode } from '@/types/entry';

type HomePageProps = {
  searchParams: Promise<{ q?: string | string[]; tab?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = firstValue(params.q).slice(0, 40);
  const sort: SortMode = firstValue(params.tab) === 'new' ? 'new' : 'top';
  const voter = await getVoterId();

  const [entries, stats, signedIds] = await Promise.all([
    listEntries(sort, query),
    getStats(),
    voter === '' ? Promise.resolve<string[]>([]) : getSignedIds(voter),
  ]);

  const signed = new Set(signedIds);
  const searching = query.trim() !== '';
  const showPodium = !searching && sort === 'top' && entries.length >= 3;
  const podium = showPodium ? entries.slice(0, 3) : [];
  const rest = showPodium ? entries.slice(3) : entries;

  return (
    <div className="flex min-h-dvh flex-col">
      <Tape text={t('hero.kicker')} />

      <header className="px-4 pt-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end gap-3 sm:gap-6">
            <h1
              className="max-w-[5ch] font-[family-name:var(--font-display)] text-[clamp(3.75rem,17vw,8rem)] leading-[0.78] sm:max-w-none"
            >
              {t('app.title')}
            </h1>
            <Stamp className="mb-2 shrink-0 text-xl sm:text-3xl lg:text-4xl">
              {t('hero.stampLabel')}
            </Stamp>
          </div>
          <p className="mt-3 max-w-prose text-base font-bold lg:text-lg">{t('app.tagline')}</p>
          <p className="mt-1 max-w-prose text-sm text-ink-70">{t('hero.sub')}</p>
        </div>
      </header>

      <div className="mx-auto mt-6 w-full max-w-6xl px-4 pb-32 sm:px-6 lg:grid lg:grid-cols-[340px_1fr] lg:gap-10 lg:px-10 lg:pb-10">
        <aside className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <div className="hidden lg:block">
            <AddForm idPrefix="side" />
          </div>
          <RageMeter stats={stats} />
        </aside>

        <main id="main" className="mt-6 flex min-w-0 flex-col gap-6 lg:mt-0">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>

          {searching ? (
            <p className="text-sm font-bold" aria-live="polite">
              {entries.length === 1
                ? t('search.resultsOne', { q: query })
                : t('search.results', { n: formatNumber(entries.length), q: query })}
            </p>
          ) : (
            <Suspense fallback={null}>
              <Tabs active={sort} />
            </Suspense>
          )}

          {showPodium ? <Podium entries={podium} signed={signed} /> : null}

          <Wall
            entries={rest}
            signed={signed}
            rankOffset={showPodium ? 3 : 0}
            ranked={!searching && sort === 'top'}
            emptyTitle={searching ? t('search.empty') : t('empty.title')}
            emptyBody={searching ? t('hero.sub') : t('empty.body')}
          />

          <p className="text-xs text-ink-70">{t('hero.disclaimer')}</p>
        </main>
      </div>

      <AddSheet />
      <Footer />
    </div>
  );
}
