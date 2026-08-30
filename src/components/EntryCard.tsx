'use client';

import { useState, useTransition } from 'react';
import { reportAction, voteAction } from '@/app/actions';
import { Stamp } from '@/components/Stamp';
import { roastList, t } from '@/lib/i18n';
import { formatDate, formatNumber, pickDeterministic } from '@/lib/text';
import type { Entry } from '@/types/entry';

type EntryCardProps = {
  entry: Entry;
  rank: number | null;
  signed: boolean;
  tone?: 'hero' | 'row';
};

export function EntryCard({ entry, rank, signed, tone = 'row' }: EntryCardProps) {
  const [pending, startTransition] = useTransition();
  const [votes, setVotes] = useState(entry.votes);
  const [hasSigned, setHasSigned] = useState(signed);
  const [reportArmed, setReportArmed] = useState(false);
  const [reported, setReported] = useState(false);

  const isHero = tone === 'hero';
  const line = entry.reason ?? pickDeterministic(roastList(), entry.name);

  function sign() {
    if (hasSigned || pending) return;
    setHasSigned(true);
    setVotes((current) => current + 1);
    startTransition(async () => {
      const result = await voteAction(entry.id);
      if (result.ok && typeof result.votes === 'number') setVotes(result.votes);
    });
  }

  function report() {
    if (reported) return;
    if (!reportArmed) {
      setReportArmed(true);
      return;
    }
    setReported(true);
    startTransition(async () => {
      await reportAction(entry.id);
    });
  }

  return (
    <article
      className={`fy-block relative flex flex-col gap-3 p-4 sm:p-5 ${
        isHero ? 'bg-tar text-paper' : 'bg-paper text-ink'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {rank !== null ? (
            <p
              className={`font-[family-name:var(--font-display)] text-xl leading-none ${
                isHero ? 'text-acid' : 'text-ink-70'
              }`}
            >
              <span className="sr-only">{t('entry.rank', { n: rank })}</span>
              <span aria-hidden="true">#{rank}</span>
            </p>
          ) : null}
          <h3
            className={`font-[family-name:var(--font-display)] [overflow-wrap:anywhere] ${
              isHero ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'
            } leading-[0.95]`}
          >
            {entry.name}
          </h3>
          <p className={`mt-1 text-sm ${isHero ? 'text-paper/85' : 'text-ink-70'}`}>{line}</p>
        </div>

        {isHero && rank === 1 ? (
          <Stamp className="fy-stamp-light shrink-0 text-lg">{t('hero.stampLabel')}</Stamp>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className={`font-[family-name:var(--font-display)] tabular-nums leading-none ${
            isHero ? 'text-4xl text-acid' : 'text-3xl'
          }`}
        >
          {t('entry.votes', { n: formatNumber(votes) })}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <button
            type="button"
            onClick={sign}
            disabled={hasSigned || pending}
            aria-label={t('entry.voteAria', { name: entry.name })}
            className={`fy-block-sm inline-flex min-h-11 items-center whitespace-nowrap px-4 text-base font-bold transition-transform duration-(--duration-tap) active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none ${
              hasSigned ? 'bg-ink text-acid' : 'bg-acid text-ink'
            }`}
          >
            {hasSigned ? t('entry.voted') : t('entry.vote')}
          </button>

          <button
            type="button"
            onClick={report}
            disabled={reported}
            aria-label={t('entry.reportAria', { name: entry.name })}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-xs underline underline-offset-4 ${
              isHero ? 'text-paper/80' : 'text-ink-70'
            }`}
          >
            {reported ? t('entry.reported') : reportArmed ? t('entry.reportConfirm') : t('entry.report')}
          </button>
        </div>
      </div>

      <p className={`text-xs ${isHero ? 'text-paper/70' : 'text-ink-70'}`}>
        {t('entry.added')} · <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
      </p>
    </article>
  );
}
