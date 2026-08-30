import { ImageResponse } from 'next/og';
import { getEntry } from '@/lib/data';
import { t } from '@/lib/i18n';
import { ShareCard, fontSpec, loadFonts } from '@/lib/og';
import { formatNumber } from '@/lib/text';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'FUCK YOU';

export default async function EntryOpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [entry, fonts] = await Promise.all([getEntry(id), loadFonts()]);

  return new ImageResponse(
    (
      <ShareCard
        format="og"
        name={entry?.name ?? t('entry.gone')}
        reason={entry?.reason ?? ''}
        count={entry ? formatNumber(entry.votes) : '0'}
        countLabel={entry?.votes === 1 ? t('share.cardLabelOne') : t('share.cardLabel')}
      />
    ),
    { ...size, fonts: fontSpec(fonts) },
  );
}
