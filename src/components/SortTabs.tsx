'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import type { SortMode } from '@/types/entry';

const MODES: SortMode[] = ['top', 'new'];

export function SortTabs({ active }: { active: SortMode }) {
  const pathname = usePathname();
  const params = useSearchParams();

  function href(mode: SortMode): string {
    const next = new URLSearchParams(params.toString());
    if (mode === 'top') next.delete('tab');
    else next.set('tab', mode);
    const query = next.toString();
    return query === '' ? pathname : `${pathname}?${query}`;
  }

  return (
    <nav aria-label={t('wall.sortLabel')} className="flex gap-2">
      {MODES.map((mode) => {
        const current = mode === active;
        return (
          <Link
            key={mode}
            href={href(mode)}
            scroll={false}
            aria-current={current ? 'page' : undefined}
            className={`fy-type inline-flex min-h-11 items-center border-2 border-ink px-3.5 text-[11px] font-bold ${
              current ? 'bg-ink text-lime' : 'bg-transparent text-ink'
            }`}
          >
            {mode === 'top' ? t('wall.sortTop') : t('wall.sortNew')}
          </Link>
        );
      })}
    </nav>
  );
}
