'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addAction, lookupAction, voteAction } from '@/app/actions';
import { flickPlusOne } from '@/components/MarkerMotion';
import { Tape } from '@/components/Tape';
import { reactWitness } from '@/components/Witness';
import { list, t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';
import type { ActionResult, Entry } from '@/types/entry';

const NAME_MAX = 40;
const REASON_MAX = 120;
const LOOKUP_DEBOUNCE_MS = 350;
const VIBE_ROTATE_MS = 4200;
const KNOWN_ERRORS = ['short', 'long', 'reasonLong', 'rate', 'notFound', 'generic'];

type Reason = { id: string; label: string };
type Mood = { id: string; label: string };

function messageFor(result: ActionResult | null, name: string): string {
  if (!result) return '';
  if (!result.ok) {
    const key = KNOWN_ERRORS.includes(result.error) ? result.error : 'generic';
    return t(`error.${key}`);
  }
  if (result.status === 'created') return t('result.created').replace('%s', name);
  if (result.status === 'signed') {
    const lines = list<string>('result.backed');
    const n = result.votes ?? 1;
    return lines[n % lines.length].replace('{n}', formatNumber(n));
  }
  return t('result.already');
}

export function AddForm({ idPrefix, onSent }: { idPrefix: string; onSent?: () => void }) {
  const router = useRouter();
  const reactId = useId();
  const nameId = `${idPrefix}-name-${reactId}`;
  const otherId = `${idPrefix}-other-${reactId}`;
  const formRef = useRef<HTMLFormElement>(null);
  const smashRef = useRef<HTMLDivElement>(null);

  const reasons: Reason[] = list<Reason>('reasons');
  const moods: Mood[] = list<Mood>('moods');

  const [pending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const [reasonId, setReasonId] = useState('');
  const [other, setOther] = useState('');
  const [mood, setMood] = useState('m4');
  const [existing, setExisting] = useState<Entry | null>(null);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');
  const [vibe, setVibe] = useState(0);

  const vibes: string[] = list<string>('vent.vibes');
  const usingOther = reasonId === 'other';

  // The placeholder keeps changing its mind while you are not using it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setVibe((v) => (v + 1) % vibes.length), VIBE_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [vibes.length]);

  // Live duplicate check. The database owns the normalisation, so "Moshe!" and
  // "moshe" resolve to the same entry here exactly as they would on submit.
  useEffect(() => {
    const candidate = name.trim();
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      const match = candidate.length < 2 ? null : await lookupAction(candidate);
      if (cancelled) return;
      setExisting(match);
      setChecking(false);
    }, LOOKUP_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [name]);

  function reset() {
    formRef.current?.reset();
    setName('');
    setOther('');
    setReasonId('');
    setExisting(null);
    onSent?.();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const sent = name.trim();
    const chosen = reasons.find((item: Reason) => item.id === reasonId);
    const reason = usingOther ? other.trim() : (chosen?.label ?? '');

    const data = new FormData();
    data.set('name', sent);
    data.set('reason', reason);

    const wrap = smashRef.current;
    if (wrap) {
      wrap.classList.add('fy-hit');
      window.setTimeout(() => wrap.classList.remove('fy-hit'), 460);
    }

    startTransition(async () => {
      const result = await addAction(null, data);
      setNote(messageFor(result, sent));
      if (result.ok) {
        reactWitness('shock');
        reset();
        router.refresh();
      }
    });
  }

  function backExisting(event: React.MouseEvent<HTMLButtonElement>) {
    if (!existing || pending) return;
    const button = event.currentTarget;
    startTransition(async () => {
      const result = await voteAction(existing.id);
      setNote(messageFor(result, existing.name));
      if (result.ok) {
        flickPlusOne(button);
        reactWitness('grin');
        reset();
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <h2 className="fy-poster text-[clamp(1.75rem,7vw,2.5rem)] leading-[0.95] normal-case">
        {t('vent.ask')}
      </h2>
      <p className="mt-0.5 font-medium text-ink-70">{t('vent.sub')}</p>
      <svg className="fy-draw mt-1 block h-4 w-[130px] text-ink" data-anim aria-hidden="true">
        <use href="#d-scribble" />
      </svg>

      <div className="relative mt-3.5">
        <svg className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink" aria-hidden="true">
          <use href="#d-person" />
        </svg>
        <label htmlFor={nameId} className="sr-only">
          {t('vent.nameLabel')}
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          required
          maxLength={NAME_MAX}
          autoComplete="off"
          dir="auto"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setExisting(null);
            setChecking(event.target.value.trim().length >= 2);
          }}
          placeholder={vibes[vibe]}
          aria-describedby={existing ? `${nameId}-dupe` : undefined}
          className="fy-field"
        />
        <svg
          className="fy-draw pointer-events-none absolute end-3 top-1/2 h-[18px] w-[26px] -translate-y-1/2 text-ink opacity-55"
          data-anim
          aria-hidden="true"
        >
          <use href="#d-scrawl" />
        </svg>
      </div>

      <p className="fy-type mt-1 text-[11px] text-ink-70">
        {checking ? t('duplicate.checking') : t('vent.counter', { n: name.length })}
      </p>

      {existing ? (
        <section
          id={`${nameId}-dupe`}
          aria-live="polite"
          className="mt-3 flex flex-wrap items-center gap-2.5 border-[2.5px] border-ink bg-lime p-3 shadow-[5px_5px_0_0_var(--color-ink)] -rotate-[0.8deg]"
        >
          <div className="min-w-0">
            <span className="fy-marker block text-[0.9375rem]">{t('duplicate.title')}</span>
            <bdi dir="auto" className="fy-name block text-lg font-bold">
              {existing.name}
            </bdi>
          </div>
          <button
            type="button"
            onClick={backExisting}
            disabled={pending}
            className="fy-marker ms-auto min-h-11 border-2 border-ink bg-ink px-3.5 py-2 text-sm whitespace-nowrap text-lime disabled:opacity-70"
          >
            {t('duplicate.cta', { n: formatNumber(existing.votes) })}
          </button>
        </section>
      ) : null}

      <div className="mt-[18px] flex items-center gap-2.5">
        <Tape width={260}>{t('vent.whyLabel')}</Tape>
        <svg className="fy-draw h-5 w-[34px] rotate-[160deg] text-ink" data-anim aria-hidden="true">
          <use href="#d-arrow" />
        </svg>
      </div>

      <div className="fy-stagger mt-3 grid grid-cols-3 gap-[7px]" data-anim>
        {reasons.map((reason: Reason) => (
          <button
            key={reason.id}
            type="button"
            className="fy-chip"
            aria-pressed={reasonId === reason.id}
            onClick={() => setReasonId(reasonId === reason.id ? '' : reason.id)}
          >
            <svg aria-hidden="true" className="h-[19px] w-[19px] shrink-0">
              <use href={`#r-${reason.id}`} />
            </svg>
            {reason.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="fy-chip mt-[7px] w-full justify-center border-dashed"
        aria-pressed={usingOther}
        onClick={() => setReasonId(usingOther ? '' : 'other')}
        data-anim
      >
        <svg aria-hidden="true" className="h-[19px] w-[19px] shrink-0">
          <use href="#r-other" />
        </svg>
        {t('vent.other')}
      </button>

      {usingOther ? (
        <div className="mt-2">
          <label htmlFor={otherId} className="sr-only">
            {t('vent.otherLabel')}
          </label>
          <input
            id={otherId}
            type="text"
            maxLength={REASON_MAX}
            dir="auto"
            value={other}
            onChange={(event) => setOther(event.target.value)}
            placeholder={t('vent.otherPlaceholder')}
            className="fy-field !px-3.5"
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-2.5">
        <Tape width={190}>{t('vent.badLabel')}</Tape>
      </div>

      <div className="mt-3 flex justify-between gap-1">
        {moods.map((item: Mood) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={mood === item.id}
            onClick={() => setMood(item.id)}
            className="flex min-h-[62px] min-w-11 flex-col items-center gap-[5px] px-0.5 py-1"
          >
            <svg
              aria-hidden="true"
              className={`h-10 w-10 ${mood === item.id ? 'text-pink' : 'text-ink'}`}
            >
              <use href={`#${item.id}`} />
            </svg>
            <span
              className={`fy-type text-[9.5px] font-bold ${
                mood === item.id ? 'underline decoration-2 underline-offset-[3px]' : ''
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div ref={smashRef} className="fy-land relative mt-5 px-[22px] py-2" data-anim>
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
          className="fy-smash-bg absolute inset-0 text-ink"
          viewBox="0 0 340 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M18 8c92-7 214-9 306-2 10 26 10 62 2 88-96 8-218 8-310 1C8 70 8 34 18 8Z" fill="currentColor" />
        </svg>
        <button
          type="submit"
          disabled={pending}
          className="fy-marker relative flex min-h-[68px] w-full items-center justify-center gap-3 px-2.5 py-5 text-[clamp(1.5rem,6.5vw,2rem)] text-lime transition-transform duration-(--duration-tap) active:scale-[0.97] disabled:opacity-70 motion-reduce:transition-none"
        >
          {pending ? t('vent.submitting') : t('vent.submit')}
          <svg className="h-5 w-[34px]" aria-hidden="true">
            <use href="#d-arrow" />
          </svg>
        </button>
      </div>

      <p aria-live="polite" className="fy-marker mt-2.5 min-h-6 text-[0.9375rem] text-pink-ink">
        {note}
      </p>
    </form>
  );
}
