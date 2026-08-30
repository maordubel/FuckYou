'use client';

import { useState, useTransition } from 'react';
import { reportAction, voteAction } from '@/app/actions';
import { flickPlusOne } from '@/components/MarkerMotion';
import { reactWitness } from '@/components/Witness';
import { t } from '@/lib/i18n';
import type { Entry } from '@/types/entry';

/** The one action on a name's own page: say it with them. */
export function BackIt({ entry, backed }: { entry: Entry; backed: boolean }) {
  const [pending, startTransition] = useTransition();
  const [mine, setMine] = useState(backed);
  const [reportArmed, setReportArmed] = useState(false);
  const [reported, setReported] = useState(false);

  function back(event: React.MouseEvent<HTMLButtonElement>) {
    if (mine || pending) return;
    const button = event.currentTarget;
    setMine(true);
    flickPlusOne(button);
    reactWitness('grin');
    startTransition(async () => {
      await voteAction(entry.id);
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
    <div className="mt-7">
      <div className="fy-land relative px-[22px] py-2" data-anim>
        <svg
          className="fy-draw absolute -inset-x-1.5 -inset-y-1 text-lime"
          viewBox="0 0 340 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M14 30 2 22M12 50H0M14 70 2 78M326 30l12-8M328 50h12M326 70l12 8"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
        <svg className="absolute inset-0 text-ink" viewBox="0 0 340 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M18 8c92-7 214-9 306-2 10 26 10 62 2 88-96 8-218 8-310 1C8 70 8 34 18 8Z" fill="currentColor" />
        </svg>
        <button
          type="button"
          onClick={back}
          disabled={mine || pending}
          aria-label={t('wall.metooAria', { name: entry.name })}
          className="fy-marker relative flex min-h-[68px] w-full items-center justify-center gap-3 px-2.5 py-5 text-[clamp(1.5rem,6.5vw,2rem)] text-lime transition-transform duration-(--duration-tap) active:scale-[0.97] disabled:opacity-80 motion-reduce:transition-none"
        >
          {mine ? t('wall.backed') : t('wall.metoo')}
          {mine ? null : (
            <svg className="h-5 w-[34px]" aria-hidden="true">
              <use href="#d-arrow" />
            </svg>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={report}
        disabled={reported}
        aria-label={t('wall.reportAria', { name: entry.name })}
        className="fy-type mt-2 min-h-11 px-1 text-[10px] text-ink-70 underline underline-offset-2"
      >
        {reported ? t('wall.reported') : reportArmed ? t('wall.reportConfirm') : t('wall.report')}
      </button>
    </div>
  );
}
