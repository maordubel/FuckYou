'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { addAction } from '@/app/actions';
import { Stamp } from '@/components/Stamp';
import { t } from '@/lib/i18n';
import type { ActionResult } from '@/types/entry';

const NAME_MAX = 40;
const REASON_MAX = 120;
const KNOWN_ERRORS = ['short', 'long', 'reasonLong', 'rate', 'notFound', 'generic'];

function messageFor(result: ActionResult | null): { text: string; tone: 'ok' | 'bad' } | null {
  if (!result) return null;
  if (!result.ok) {
    const key = KNOWN_ERRORS.includes(result.error) ? result.error : 'generic';
    return { text: t(`error.${key}`), tone: 'bad' };
  }
  if (result.status === 'created') return { text: t('result.created', { name: result.name ?? '' }), tone: 'ok' };
  if (result.status === 'signed') return { text: t('result.voted'), tone: 'ok' };
  return { text: t('result.already'), tone: 'ok' };
}

export function AddForm({ idPrefix, onDone }: { idPrefix: string; onDone?: () => void }) {
  const reactId = useId();
  const nameId = `${idPrefix}-name-${reactId}`;
  const reasonId = `${idPrefix}-reason-${reactId}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addAction, null);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (state?.ok) {
      setName('');
      setReason('');
      formRef.current?.reset();
      onDone?.();
    }
  }, [state, onDone]);

  const message = messageFor(state);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <h2 className="font-[family-name:var(--font-display)] text-4xl leading-none">
        {t('form.legend')}
      </h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="text-sm font-bold">
          {t('form.nameLabel')}
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          required
          maxLength={NAME_MAX}
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t('form.namePlaceholder')}
          className="min-h-12 w-full border-2 border-ink bg-paper px-3 py-2 text-base placeholder:text-ink-70"
        />
        <p className="text-xs text-ink-70 tabular-nums">{t('form.nameCounter', { n: name.length })}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={reasonId} className="text-sm font-bold">
          {t('form.reasonLabel')}
        </label>
        <textarea
          id={reasonId}
          name="reason"
          rows={2}
          maxLength={REASON_MAX}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('form.reasonPlaceholder')}
          className="w-full resize-none border-2 border-ink bg-paper px-3 py-2 text-base placeholder:text-ink-70"
        />
        <p className="text-xs text-ink-70 tabular-nums">{t('form.reasonCounter', { n: reason.length })}</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="fy-block-sm min-h-14 w-full bg-blood-ink px-4 font-[family-name:var(--font-display)] text-3xl leading-none text-paper transition-transform duration-(--duration-tap) active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-70 motion-reduce:transition-none"
      >
        {pending ? t('form.submitting') : t('form.submit')}
      </button>

      <p aria-live="polite" className="min-h-6">
        {message ? (
          message.tone === 'ok' ? (
            <Stamp slam className="text-lg">
              {message.text}
            </Stamp>
          ) : (
            <span className="fy-shake inline-block border-2 border-ink bg-ink px-2 py-1 text-sm font-bold text-paper">
              {message.text}
            </span>
          )
        ) : null}
      </p>
    </form>
  );
}
