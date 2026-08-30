import localFont from 'next/font/local';

/**
 * Punk zine, self-hosted. Anton is the poster voice, Permanent Marker is the
 * handwriting, Archivo does the reading and Courier Prime is the fine print.
 * Vendored from Fontsource under src/fonts so the build never depends on
 * fonts.googleapis.com and nothing about a visitor leaves their browser.
 */
export const poster = localFont({
  src: [{ path: '../fonts/anton-latin-400-normal.woff2', weight: '400', style: 'normal' }],
  variable: '--font-poster',
  display: 'swap',
  preload: true,
});

export const marker = localFont({
  src: [{ path: '../fonts/permanent-marker-latin-400-normal.woff2', weight: '400', style: 'normal' }],
  variable: '--font-marker',
  display: 'swap',
  preload: true,
});

export const body = localFont({
  src: [
    { path: '../fonts/archivo-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/archivo-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/archivo-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

export const typewriter = localFont({
  src: [
    { path: '../fonts/courier-prime-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/courier-prime-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-type',
  display: 'swap',
  preload: false,
});

/**
 * Script fallbacks for user-entered names. A name may arrive in any language and
 * the Latin faces cover Latin only. Each family is declared with no
 * unicode-range, so a browser downloads one only when a character actually falls
 * through to it — a Latin-only page pays nothing for them.
 *
 * CJK is deliberately not self-hosted: a Noto CJK face is 5-10 MB, which would
 * break the bundle budget for every visitor. Those scripts fall through to the
 * system CJK stack in --font-name, which every CJK-capable device ships.
 */
export const notoHebrew = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-hebrew-hebrew-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-hebrew-hebrew-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-hebrew',
  display: 'swap',
  preload: false,
});

export const notoArabic = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-arabic-arabic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-arabic-arabic-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-arabic',
  display: 'swap',
  preload: false,
});

export const notoCyrillic = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-cyrillic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-cyrillic-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-cyrillic',
  display: 'swap',
  preload: false,
});

export const notoGreek = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-greek-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-greek-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-greek',
  display: 'swap',
  preload: false,
});

export const notoDevanagari = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-devanagari-devanagari-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-devanagari-devanagari-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-devanagari',
  display: 'swap',
  preload: false,
});

export const notoThai = localFont({
  src: [
    { path: '../fonts/scripts/noto-sans-thai-thai-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/scripts/noto-sans-thai-thai-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-thai',
  display: 'swap',
  preload: false,
});

export const fontVariables = [
  poster.variable,
  marker.variable,
  body.variable,
  typewriter.variable,
  notoHebrew.variable,
  notoArabic.variable,
  notoCyrillic.variable,
  notoGreek.variable,
  notoDevanagari.variable,
  notoThai.variable,
].join(' ');
