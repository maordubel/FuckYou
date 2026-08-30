import { Suspense } from 'react';
import { AddForm } from '@/components/AddForm';
import { AddSheet } from '@/components/AddSheet';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { SiteHead } from '@/components/SiteHead';
import { SortTabs } from '@/components/SortTabs';
import { Wall } from '@/components/Wall';
import { getSignedIds, getStats, listEntries } from '@/lib/data';
import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import { getVoterId } from '@/lib/voter';
import type { SortMode } from '@/types/entry';

type HomeProps = {
  searchParams: Promise<{ q?: string | string[]; tab?: string | string[] }>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = first(params.q).slice(0, 40);
  const sort: SortMode = first(params.tab) === 'new' ? 'new' : 'top';
  const voter = await getVoterId();

  const [entries, stats, backedIds] = await Promise.all([
    listEntries(sort, query),
    getStats(),
    voter === '' ? Promise.resolve<string[]>([]) : getSignedIds(voter),
  ]);

  const backed = new Set(backedIds);
  const searching = query.trim() !== '';

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-[480px] px-[18px] pt-5 pb-8 lg:max-w-[940px] lg:px-10">
        <SiteHead />

        <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-9">
          {/* Mobile keeps the form behind a thumb-zone sheet so the wall is the
              page. Desktop shows both at once. */}
          <section className="lg:hidden">
            <AddSheet />
          </section>

          <section className="hidden lg:block">
            <AddForm idPrefix="side" />
          </section>

          <main id="main" className="mt-8 lg:mt-0">
            <Wall
              entries={entries}
              backed={backed}
              stats={stats}
              ranked={!searching && sort === 'top'}
              emptyTitle={searching ? t('wall.searchEmpty') : t('wall.empty')}
              emptyBody={searching ? t('wall.sub') : t('wall.emptyBody')}
            />

            <div className="mt-4 flex flex-col gap-3">
              <Suspense fallback={null}>
                <SearchBar />
              </Suspense>

              {searching ? (
                <p className="fy-type text-[11px] text-ink-70" aria-live="polite">
                  {entries.length === 1
                    ? t('wall.resultsOne', { q: query })
                    : t('wall.results', { n: formatNumber(entries.length), q: query })}
                </p>
              ) : (
                <Suspense fallback={null}>
                  <SortTabs active={sort} />
                </Suspense>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
