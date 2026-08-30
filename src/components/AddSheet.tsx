'use client';

import { useCallback, useRef } from 'react';
import { AddForm } from '@/components/AddForm';
import { t } from '@/lib/i18n';

/** Mobile-only entry point: a thumb-zone bar that opens a bottom sheet. */
export function AddSheet() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper-2 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <button
          type="button"
          onClick={open}
          className="fy-block-sm min-h-14 w-full bg-blood-ink px-4 font-[family-name:var(--font-display)] text-3xl leading-none text-paper"
        >
          {t('form.openSheet')}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={t('form.legend')}
        className="m-0 mt-auto max-h-[88dvh] w-full max-w-none border-t-4 border-ink bg-paper p-0 text-ink backdrop:bg-ink/70 lg:hidden"
      >
        <div className="max-h-[88dvh] overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-ink bg-ink px-3 text-paper"
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">{t('form.closeSheet')}</span>
            </button>
          </div>
          <AddForm idPrefix="sheet" onDone={close} />
        </div>
      </dialog>
    </>
  );
}
