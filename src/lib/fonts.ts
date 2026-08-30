import localFont from 'next/font/local';

/**
 * Self-hosted (Fontsource woff2, vendored under src/fonts) so the build never
 * depends on fonts.googleapis.com and no request leaves the user's browser.
 * Latin is the interface script and is preloaded; the Hebrew faces sit behind it
 * in the stack, unpreloaded, so a name typed in Hebrew still renders correctly.
 */
export const karantinaHe = localFont({
  src: [
    { path: '../fonts/karantina-hebrew-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/karantina-hebrew-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-karantina-he',
  display: 'swap',
  preload: false,
});

export const karantinaLatin = localFont({
  src: [
    { path: '../fonts/karantina-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/karantina-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-karantina-latin',
  display: 'swap',
  preload: true,
});

export const heeboHe = localFont({
  src: [
    { path: '../fonts/heebo-hebrew-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/heebo-hebrew-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/heebo-hebrew-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-heebo-he',
  display: 'swap',
  preload: false,
});

export const heeboLatin = localFont({
  src: [
    { path: '../fonts/heebo-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/heebo-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/heebo-latin-900-normal.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-heebo-latin',
  display: 'swap',
  preload: true,
});

export const fontVariables = [
  karantinaHe.variable,
  karantinaLatin.variable,
  heeboHe.variable,
  heeboLatin.variable,
].join(' ');
