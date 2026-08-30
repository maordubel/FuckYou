'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/hq/actions';
import { t } from '@/lib/i18n';

/** No link points here. The password is checked in Postgres, counted against a
 *  15-minute window, and answered with a value rather than an exception. */
export function AdminGate({ reason }: { reason?: 'expired' | 'offline' }) {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-[18px] py-10">
      <h1 className="fy-poster text-[clamp(2rem,9vw,3rem)] leading-[0.9]">{t('hq.title')}</h1>
      <p className="fy-type mt-2 text-[11px] text-ink-70">{t('hq.sub')}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <label htmlFor="hq-password" className="text-sm font-bold">
          {t('hq.password')}
        </label>
        <input
          id="hq-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="fy-field !px-3.5"
        />
        <button
          type="submit"
          disabled={pending}
          className="fy-marker min-h-13 border-[2.5px] border-ink bg-ink px-4 py-3 text-lg text-lime disabled:opacity-70"
        >
          {pending ? t('hq.checking') : t('hq.enter')}
        </button>

        <p aria-live="polite" className="fy-marker min-h-6 text-[0.9375rem] text-pink-ink">
          {state === 'denied' ? t('hq.denied') : state === 'rate' ? t('hq.rate') : ''}
          {reason === 'expired' ? t('hq.expired') : reason === 'offline' ? t('hq.offline') : ''}
        </p>
      </form>
    </main>
  );
}
