'use client';

import { useCallback, useRef } from 'react';
import { AddForm } from '@/components/AddForm';
import { t } from '@/lib/i18n';

/** Mobile-only: a thumb-zone bar that opens the vent form as a sheet. */
export function AddSheet() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <>
      <div className="fy-land relative px-[22px] py-2" data-anim>
        <svg
          className="fy-sparks fy-draw absolute -inset-x-1.5 -inset-y-1 text-lime"
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
        <svg
          className="absolute inset-0 text-ink"
          viewBox="0 0 340 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M18 8c92-7 214-9 306-2 10 26 10 62 2 88-96 8-218 8-310 1C8 70 8 34 18 8Z" fill="currentColor" />
        </svg>
        <button
          type="button"
          onClick={open}
          className="fy-marker relative flex min-h-[68px] w-full items-center justify-center gap-3 px-2.5 py-5 text-[clamp(1.5rem,6.5vw,2rem)] text-lime transition-transform duration-(--duration-tap) active:scale-[0.97] motion-reduce:transition-none"
        >
          {t('vent.ask')}
          <svg className="h-5 w-[34px]" aria-hidden="true">
            <use href="#d-arrow" />
          </svg>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={t('vent.ask')}
        className="m-0 mt-auto max-h-[90dvh] w-full max-w-none border-t-[3px] border-ink bg-paper p-0 text-ink backdrop:bg-ink/70"
      >
        <div className="max-h-[90dvh] overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-ink px-3"
            >
              <svg className="h-4 w-4" aria-hidden="true">
                <use href="#d-x" />
              </svg>
              <span className="sr-only">{t('nav.wall')}</span>
            </button>
          </div>
          <AddForm idPrefix="sheet" onSent={close} />
        </div>
      </dialog>
    </>
  );
}
