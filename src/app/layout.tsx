import type { Metadata, Viewport } from 'next';
import { Doodles } from '@/components/Doodles';
import { MarkerMotion } from '@/components/MarkerMotion';
import { fontVariables } from '@/lib/fonts';
import { direction, locale, t } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: t('app.title'),
    template: `%s · ${t('app.title')}`,
  },
  description: t('app.description'),
  applicationName: t('app.title'),
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: t('app.title'),
    title: t('app.title'),
    description: t('app.description'),
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#efebe3',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={locale} dir={direction} className={fontVariables}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-lime"
        >
          {t('app.skipToContent')}
        </a>
        <Doodles />
        <MarkerMotion />
        {children}
      </body>
    </html>
  );
}
