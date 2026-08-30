'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { t } from '@/lib/i18n';

const DEBOUNCE_MS = 250;

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const inputId = useId();
  const initial = params.get('q') ?? '';
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const current = params.get('q') ?? '';
    if (value === current) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim() === '') next.delete('q');
      else next.set('q', value.trim());
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, params, pathname, router]);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold">
        {t('search.label')}
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t('search.placeholder')}
          className="min-h-12 w-full border-2 border-ink bg-paper px-3 py-2 text-base placeholder:text-ink-70"
        />
        {value !== '' ? (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label={t('search.clear')}
            className="min-h-12 min-w-12 border-2 border-ink bg-ink px-3 text-paper"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
