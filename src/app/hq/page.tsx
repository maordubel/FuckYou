import type { Metadata } from 'next';
import { AdminGate } from '@/components/admin/AdminGate';
import { AdminTable } from '@/components/admin/AdminTable';
import { adminAudit, adminList, adminToken } from '@/lib/admin';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('hq.title'),
  robots: { index: false, follow: false, nocache: true },
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function HqPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q) ?? '';
  const token = await adminToken();

  if (!token) return <AdminGate />;

  const [{ ok, rows, error }, audit] = await Promise.all([
    adminList(token, query),
    adminAudit(token),
  ]);

  if (!ok) return <AdminGate reason={error === 'offline' ? 'offline' : 'expired'} />;

  return <AdminTable rows={rows} audit={audit} query={query} />;
}
