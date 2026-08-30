import { ImageResponse } from 'next/og';
import { getEntry } from '@/lib/data';
import { t } from '@/lib/i18n';
import { ShareCard, fontSpec, loadFonts } from '@/lib/og';
import { formatNumber } from '@/lib/text';

/** 1080x1920 — the card people put on a story or a WhatsApp status. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [entry, fonts] = await Promise.all([getEntry(id), loadFonts()]);

  return new ImageResponse(
    (
      <ShareCard
        format="story"
        name={entry?.name ?? t('entry.gone')}
        reason={entry?.reason ?? ''}
        count={entry ? formatNumber(entry.votes) : '0'}
        countLabel={entry?.votes === 1 ? t('share.cardLabelOne') : t('share.cardLabel')}
      />
    ),
    {
      width: 1080,
      height: 1920,
      fonts: fontSpec(fonts),
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
    },
  );
}
