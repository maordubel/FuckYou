import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BackIt } from '@/components/BackIt';
import { Footer } from '@/components/Footer';
import { ShareRow } from '@/components/ShareRow';
import { SiteHead } from '@/components/SiteHead';
import { getEntry, getSignedIds } from '@/lib/data';
import { roastList, t } from '@/lib/i18n';
import { entryUrl } from '@/lib/site';
import { formatNumber, pickDeterministic } from '@/lib/text';
import { getVoterId } from '@/lib/voter';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) return { title: t('entry.gone') };

  const description = t('entry.backingMeta', { n: formatNumber(entry.votes) });

  return {
    title: entry.name,
    description,
    alternates: { canonical: `/n/${entry.id}` },
    openGraph: {
      title: entry.name,
      description,
      url: entryUrl(entry.id),
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: entry.name, description },
  };
}

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  const voter = await getVoterId();
  const backedIds = voter === '' ? [] : await getSignedIds(voter);
  const line = entry.reason ?? pickDeterministic(roastList(), entry.name);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-[560px] px-[18px] pt-5 pb-10 lg:px-10">
        <SiteHead compact />

        <main id="main" className="mt-8">
          <p className="fy-type text-[11px] text-ink-70">{line}</p>

          <h1 className="fy-name mt-2 text-[clamp(2rem,10vw,3.25rem)] leading-[0.98] font-bold">
            <bdi dir="auto">{entry.name}</bdi>
          </h1>

          <div className="mt-4 flex items-end gap-3">
            <span className="fy-poster text-[clamp(3rem,16vw,5rem)] leading-[0.82] tabular-nums">
              {formatNumber(entry.votes)}
            </span>
            <span className="fy-marker mb-2 text-lg text-pink-ink">
              {entry.votes === 1 ? t('entry.backingOne') : t('entry.backingMany')}
            </span>
          </div>

          <svg className="fy-draw mt-2 block h-4 w-[130px] text-ink" data-anim aria-hidden="true">
            <use href="#d-scribble" />
          </svg>

          <BackIt entry={entry} backed={backedIds.includes(entry.id)} />

          <ShareRow entry={entry} />

          <Link
            href="/"
            className="fy-type mt-8 inline-flex min-h-11 items-center gap-2 border-2 border-ink px-4 text-[11px] font-bold"
          >
            <svg className="h-4 w-6 rotate-180" aria-hidden="true">
              <use href="#d-arrow" />
            </svg>
            {t('entry.back')}
          </Link>
        </main>
      </div>

      <Footer />
    </div>
  );
}
