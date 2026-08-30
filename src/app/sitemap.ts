import type { MetadataRoute } from 'next';
import { listEntries } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await listEntries('top', '', 200);

  return [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    ...entries.map((entry) => ({
      url: `${SITE_URL}/n/${entry.id}`,
      lastModified: new Date(entry.createdAt),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ];
}
