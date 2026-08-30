import { Suspense } from 'react';
import { AddForm } from '@/components/AddForm';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { SiteHead } from '@/components/SiteHead';
import { SortTabs } from '@/components/SortTabs';
import { Wall } from '@/components/Wall';
import { DemoNotice } from '@/components/DemoNotice';
import { getSignedIds, getStats, listEntries } from '@/lib/data';
import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import { getVoterId } from '@/lib/voter';
import type { SortMode } from '@/types/entry';

const PAGE = 12;

type HomeProps = {
  searchParams: Promise<{ q?: string | string[]; tab?: string | string[]; show?: string | string[] }>;
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

  // The wall grows every day, so a phone gets a page that ends. One request
  // over the limit is how we know whether there is more behind it.
  const requested = Number.parseInt(first(params.show), 10);
  const show = Number.isFinite(requested) ? Math.min(Math.max(requested, PAGE), 240) : PAGE;

  const [fetched, stats, backedIds] = await Promise.all([
    listEntries(sort, query, show + 1),
    getStats(),
    voter === '' ? Promise.resolve<string[]>([]) : getSignedIds(voter),
  ]);

  const entries = fetched.slice(0, show);
  const hasMore = fetched.length > show;
  const backed = new Set(backedIds);
  const searching = query.trim() !== '';

  const nextParams = new URLSearchParams();
  if (query) nextParams.set('q', query);
  if (sort === 'new') nextParams.set('tab', 'new');
  nextParams.set('show', String(show + PAGE));
  const moreHref = hasMore ? `/?${nextParams.toString()}#main` : undefined;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-[480px] px-[18px] pt-5 pb-8 lg:max-w-[940px] lg:px-10">
        <SiteHead />
        <DemoNotice />

        <div className="mt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-9">
          {/* The form is the first thing on every screen — no button in front
              of it. Desktop puts the wall beside it instead of below. */}
          <section>
            <AddForm idPrefix="vent" />
          </section>

          <main id="main" className="mt-10 lg:mt-0">
            <Wall
              entries={entries}
              backed={backed}
              stats={stats}
              ranked={!searching && sort === 'top'}
              emptyTitle={searching ? t('wall.searchEmpty') : t('wall.empty')}
              emptyBody={searching ? t('wall.sub') : t('wall.emptyBody')}
              moreHref={moreHref}
              remaining={Math.max(stats.people - entries.length, 0)}
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
