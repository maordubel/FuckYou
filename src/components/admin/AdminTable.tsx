'use client';

import { useState } from 'react';
import { deleteAction, logoutAction, saveAction } from '@/app/hq/actions';
import type { AdminRow, AuditRow } from '@/lib/admin';
import { t } from '@/lib/i18n';
import { formatNumber } from '@/lib/text';

const CELL = 'border-2 border-ink bg-paper px-2.5 py-2 text-sm';

export function AdminTable({ rows, audit, query }: { rows: AdminRow[]; audit: AuditRow[]; query: string }) {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-[18px] py-8 lg:px-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="fy-poster text-[clamp(1.75rem,6vw,2.5rem)] leading-none">{t('hq.title')}</h1>
        <form action={logoutAction}>
          <button type="submit" className="fy-type min-h-11 border-2 border-ink px-3 text-[11px] font-bold">
            {t('hq.logout')}
          </button>
        </form>
      </div>

      <p className="fy-type mt-1 text-[11px] text-ink-70">
        {t('hq.count', { n: formatNumber(rows.length) })}
      </p>

      <form method="get" className="mt-5 flex gap-2">
        <label htmlFor="hq-q" className="sr-only">
          {t('hq.search')}
        </label>
        <input
          id="hq-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={t('hq.search')}
          className="fy-field !min-h-12 !px-3.5 !py-2.5 !text-base"
        />
        <button type="submit" className="fy-type min-h-12 border-2 border-ink bg-ink px-4 text-[11px] font-bold text-lime">
          {t('hq.go')}
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="fy-type text-[10px] text-ink-70">
              <th scope="col" className="px-2 py-2 text-start">{t('hq.colName')}</th>
              <th scope="col" className="px-2 py-2 text-start">{t('hq.colReason')}</th>
              <th scope="col" className="px-2 py-2 text-start">{t('hq.colVotes')}</th>
              <th scope="col" className="px-2 py-2 text-start">{t('hq.colFlags')}</th>
              <th scope="col" className="px-2 py-2 text-start">{t('hq.colDo')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={row.hidden ? 'opacity-60' : ''}>
                <td className="py-1.5 pe-2">
                  <input
                    form={`f-${row.id}`}
                    name="name"
                    defaultValue={row.name}
                    dir="auto"
                    maxLength={40}
                    aria-label={t('hq.colName')}
                    className={`${CELL} fy-name w-full min-h-11 font-bold`}
                  />
                </td>
                <td className="py-1.5 pe-2">
                  <input
                    form={`f-${row.id}`}
                    name="reason"
                    defaultValue={row.reason ?? ''}
                    dir="auto"
                    maxLength={120}
                    aria-label={t('hq.colReason')}
                    className={`${CELL} w-full min-h-11`}
                  />
                </td>
                <td className="py-1.5 pe-2">
                  <input
                    form={`f-${row.id}`}
                    name="votes"
                    type="number"
                    min={0}
                    defaultValue={row.votes}
                    aria-label={t('hq.colVotes')}
                    className={`${CELL} w-24 min-h-11 tabular-nums`}
                  />
                </td>
                <td className="py-1.5 pe-2">
                  <label className="fy-type inline-flex min-h-11 items-center gap-2 text-[11px]">
                    <input form={`f-${row.id}`} name="hidden" type="checkbox" defaultChecked={row.hidden} className="h-5 w-5" />
                    {t('hq.hidden')}
                    {row.reports > 0 ? <span className="text-pink-ink">· {row.reports}</span> : null}
                  </label>
                </td>
                <td className="py-1.5">
                  <div className="flex items-center gap-2">
                    <form id={`f-${row.id}`} action={saveAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="fy-type min-h-11 border-2 border-ink bg-lime px-3 text-[11px] font-bold">
                        {t('hq.save')}
                      </button>
                    </form>

                    {confirming === row.id ? (
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <button type="submit" className="fy-type min-h-11 border-2 border-pink-ink bg-pink px-3 text-[11px] font-bold text-white">
                          {t('hq.confirmDelete')}
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(row.id)}
                        className="fy-type min-h-11 border-2 border-ink px-3 text-[11px] font-bold"
                      >
                        {t('hq.delete')}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="fy-poster text-xl">{t('hq.audit')}</h2>
        <ul className="fy-type mt-2 grid gap-1 text-[11px] text-ink-70">
          {audit.map((line, index) => (
            <li key={`${line.at}-${index}`}>
              {new Date(line.at).toLocaleString()} · {line.action} · {line.before ?? ''}
              {line.after && line.after !== line.before ? ` → ${line.after}` : ''}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
