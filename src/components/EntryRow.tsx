'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { voteAction } from '@/app/actions';
import { flickPlusOne } from '@/components/MarkerMotion';
import { reactWitness } from '@/components/Witness';
import { roastList, t } from '@/lib/i18n';
import { formatNumber, pickDeterministic } from '@/lib/text';
import type { Entry } from '@/types/entry';

type Props = {
  entry: Entry;
  rank: number | null;
  backed: boolean;
  lead?: boolean;
  fresh?: boolean;
};

/** One cut-out strip on the wall. */
export function EntryRow({ entry, rank, backed, lead = false, fresh = false }: Props) {
  const [pending, startTransition] = useTransition();
  const [count, setCount] = useState(entry.votes);
  const [mine, setMine] = useState(backed);
  const [bumping, setBumping] = useState(false);

  const line = entry.reason ?? pickDeterministic(roastList(), entry.name);
  const tilt = (((entry.id.charCodeAt(0) + entry.id.length * 7) % 200) / 100 - 1).toFixed(2);

  function back(event: React.MouseEvent<HTMLButtonElement>) {
    if (mine || pending) return;
    const button = event.currentTarget;
    setMine(true);
    setCount((value) => value + 1);
    setBumping(true);
    flickPlusOne(button);
    reactWitness('grin');
    window.setTimeout(() => setBumping(false), 340);

    startTransition(async () => {
      const result = await voteAction(entry.id);
      if (result.ok && typeof result.votes === 'number') setCount(result.votes);
    });
  }

  return (
    <li
      className={`fy-cut ${lead ? 'fy-cut-lead' : ''} ${bumping ? 'fy-bump' : ''} ${
        fresh ? 'fy-row-in' : ''
      } flex items-center gap-3 p-3.5`}
      style={{ rotate: `${tilt}deg` }}
    >
      <span className={`fy-poster w-8 shrink-0 text-2xl leading-none ${lead ? 'opacity-75' : 'opacity-35'}`}>
        {rank === null ? '' : rank}
        <span className="sr-only">{rank === null ? '' : t('wall.rank', { n: rank })}</span>
      </span>

      <span className="min-w-0 flex-1">
        <Link
          href={`/n/${entry.id}`}
          className="flex min-h-11 flex-col justify-center py-1"
          aria-label={t('wall.open', { name: entry.name })}
        >
          <bdi
            dir="auto"
            className={`fy-name block leading-[1.1] font-bold ${
              lead ? 'fy-poster text-2xl font-normal' : 'text-[1.1875rem]'
            }`}
          >
            {entry.name}
          </bdi>
          <span className={`fy-type mt-0.5 block text-[10.5px] ${lead ? 'text-[#4a5108]' : 'text-ink-70'}`}>
            {lead ? t('wall.worst') : line}
          </span>
        </Link>
      </span>

      <span className="fy-poster shrink-0 text-[1.75rem] leading-none tabular-nums">
        {formatNumber(count)}
      </span>

      <span className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={back}
          disabled={mine || pending}
          data-done={mine}
          aria-label={t('wall.metooAria', { name: entry.name })}
          className="fy-metoo"
        >
          {mine ? t('wall.backed') : t('wall.metoo')}
        </button>
      </span>
    </li>
  );
}
