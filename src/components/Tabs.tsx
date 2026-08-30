'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import type { SortMode } from '@/types/entry';

const MODES: SortMode[] = ['top', 'new'];

export function Tabs({ active }: { active: SortMode }) {
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
    <nav aria-label={t('tabs.label')} className="flex gap-2">
      {MODES.map((mode) => {
        const current = mode === active;
        return (
          <Link
            key={mode}
            href={href(mode)}
            scroll={false}
            aria-current={current ? 'page' : undefined}
            className={`fy-block-sm inline-flex min-h-12 items-center px-4 font-[family-name:var(--font-display)] text-2xl leading-none ${
              current ? 'bg-ink text-acid' : 'bg-paper text-ink'
            }`}
          >
            {t(`tabs.${mode}`)}
          </Link>
        );
      })}
    </nav>
  );
}
