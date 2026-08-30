import { ImageResponse } from 'next/og';
import { ShareCard, fontSpec, loadFonts } from '@/lib/og';
import { t } from '@/lib/i18n';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'FUCK YOU';

export default async function OpengraphImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <ShareCard
        format="og"
        name={t('vent.ask')}
        reason={t('app.tagline')}
        count="∞"
        countLabel="people are mad"
      />
    ),
    { ...size, fonts: fontSpec(fonts) },
  );
}
