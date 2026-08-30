import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { direction, locale, t } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: t('app.title'),
  description: t('app.description'),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#e9e2d2',
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {t('app.skipToContent')}
        </a>
        {children}
      </body>
    </html>
  );
}
