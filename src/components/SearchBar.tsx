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
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    const current = params.get('q') ?? '';
    if (value === current) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim() === '') next.delete('q');
      else next.set('q', value.trim());
      const query = next.toString();
      router.replace(query === '' ? pathname : `${pathname}?${query}`, { scroll: false });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, params, pathname, router]);

  return (
    <div className="flex items-stretch gap-2">
      <label htmlFor={inputId} className="sr-only">
        {t('wall.searchLabel')}
      </label>
      <input
        id={inputId}
        type="search"
        dir="auto"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('wall.searchPlaceholder')}
        className="fy-field !min-h-12 !px-3.5 !py-2.5 !text-base"
      />
      {value !== '' ? (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label={t('wall.searchClear')}
          className="min-h-12 min-w-12 border-[2.5px] border-ink bg-ink px-3 text-paper"
        >
          <svg className="mx-auto h-3.5 w-3.5" aria-hidden="true">
            <use href="#d-x" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
