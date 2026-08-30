import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isRtl, toVisualOrder } from '@/lib/bidi';
import { SITE_HOST } from '@/lib/site';

/** Satori supports a narrow slice of CSS: flexbox, borders, colours, no
 *  transforms, filters or clip paths. The zine survives that because the
 *  identity is blocks, weight and colour rather than texture. */
export const PAPER = '#efebe3';
export const INK = '#121110';
export const LIME = '#d8f32b';
export const PINK = '#f5216b';

type Fonts = {
  anton: ArrayBuffer;
  marker: ArrayBuffer;
  archivo: ArrayBuffer;
  courier: ArrayBuffer;
  hebrew: ArrayBuffer;
  greek: ArrayBuffer;
  cyrillic: ArrayBuffer;
};

/** The name font, then the script fallbacks Satori walks when a glyph is missing. */
export const NAME_STACK = 'Archivo, Heebo, NotoGreek, NotoCyrillic';

/** Satori reads woff, never woff2, so the card fonts are the .woff twins of
 *  the ones the site loads. next.config traces src/fonts into the bundle. */
async function face(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), 'src', 'fonts', file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function loadFonts(): Promise<Fonts> {
  const [anton, marker, archivo, courier, hebrew, greek, cyrillic] = await Promise.all([
    face('anton-latin-400-normal.woff'),
    face('permanent-marker-latin-400-normal.woff'),
    face('archivo-latin-700-normal.woff'),
    face('courier-prime-latin-400-normal.woff'),
    face('heebo-hebrew-700-normal.woff'),
    face('noto-sans-greek-700-normal.woff'),
    face('noto-sans-cyrillic-700-normal.woff'),
  ]);
  return { anton, marker, archivo, courier, hebrew, greek, cyrillic };
}

export function fontSpec(fonts: Fonts) {
  return [
    { name: 'Anton', data: fonts.anton, weight: 400 as const, style: 'normal' as const },
    { name: 'Marker', data: fonts.marker, weight: 400 as const, style: 'normal' as const },
    { name: 'Archivo', data: fonts.archivo, weight: 700 as const, style: 'normal' as const },
    { name: 'Courier', data: fonts.courier, weight: 400 as const, style: 'normal' as const },
    { name: 'Heebo', data: fonts.hebrew, weight: 700 as const, style: 'normal' as const },
    { name: 'NotoGreek', data: fonts.greek, weight: 700 as const, style: 'normal' as const },
    { name: 'NotoCyrillic', data: fonts.cyrillic, weight: 700 as const, style: 'normal' as const },
  ];
}

/** Names go up to 70 characters, so the card has to shrink a long way and
 *  still fill the space a short name fills. Steps, not a formula: a formula
 *  makes 41 characters look like a mistake next to 40. */
function nameSize(name: string, big: boolean): number {
  const length = [...name].length;
  if (big) {
    if (length <= 14) return 120;
    if (length <= 24) return 96;
    if (length <= 36) return 76;
    if (length <= 48) return 62;
    if (length <= 60) return 52;
    return 46;
  }
  if (length <= 14) return 88;
  if (length <= 24) return 70;
  if (length <= 36) return 56;
  if (length <= 48) return 46;
  if (length <= 60) return 39;
  return 34;
}

/** Greedy wrap in *logical* order. Reordering a whole paragraph and then
 *  letting the renderer break it would split the visual string at the wrong
 *  points, so every line is wrapped first and flipped after. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if ([...next].length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [''];
}

/** Rough advance width for the card faces; good enough to pick a break point. */
const GLYPH = 0.54;

type CardProps = {
  name: string;
  reason: string;
  count: string;
  countLabel: string;
  format: 'og' | 'story';
};

/** One card, two crops: 1200x630 for links, 1080x1920 for stories. */
export function ShareCard({ name, reason, count, countLabel, format }: CardProps) {
  const story = format === 'story';
  const pad = story ? 90 : 60;

  // Satori paints strings straight through, so we hand it visual order and
  // pick the alignment a right-to-left name expects.
  const width = (story ? 1080 : 1200) - pad * 2;
  const size = nameSize(name, story);
  const nameLines = wrapText(name, Math.max(8, Math.floor(width / (size * GLYPH)))).map(toVisualOrder);
  const reasonText = toVisualOrder(reason);
  // A Hebrew or Arabic name flips the whole card, not just the text: the
  // logo moves right, the count hangs right, the rule swaps sides. Half a
  // mirrored card reads worse than either whole one.
  const rtl = isRtl(name);
  const row = rtl ? ('row-reverse' as const) : ('row' as const);
  const edge = rtl ? ('flex-end' as const) : ('flex-start' as const);
  const nameAlign = rtl ? ('right' as const) : ('left' as const);
  const reasonAlign = isRtl(reason) || rtl ? ('right' as const) : ('left' as const);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: PAPER,
        color: INK,
        padding: pad,
        fontFamily: 'Archivo',
      }}
    >
      <div style={{ display: 'flex', flexDirection: row, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', background: LIME, padding: story ? '8px 20px 16px' : '4px 14px 10px' }}>
          <span
            style={{
              fontFamily: 'Anton',
              fontSize: story ? 76 : 54,
              lineHeight: 0.92,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Fuck You.
          </span>
        </div>
        <span style={{ fontFamily: 'Marker', fontSize: story ? 30 : 24, lineHeight: 1.2, textAlign: rtl ? 'left' : 'right' }}>
          Say it.{'\n'}Don&apos;t send it.
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: edge,
          flex: 1,
          paddingTop: story ? 40 : 18,
          paddingBottom: story ? 40 : 18,
        }}
      >
        {reason ? (
          <span
            style={{
              fontFamily: 'Courier',
              fontSize: story ? 28 : 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#514d47',
              marginBottom: story ? 20 : 14,
              textAlign: reasonAlign,
            }}
          >
            {reasonText}
          </span>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: edge }}>
          {nameLines.map((line, index) => (
            <span
              key={index}
              style={{
                fontFamily: NAME_STACK,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.06,
                letterSpacing: -1,
                textAlign: nameAlign,
              }}
            >
              {line}
            </span>
          ))}
        </div>

        <span
          style={{
            fontFamily: 'Anton',
            fontSize: story ? 300 : 190,
            lineHeight: 0.82,
            letterSpacing: -6,
            marginTop: story ? 44 : 24,
          }}
        >
          {count}
        </span>

        <span
          style={{
            fontFamily: 'Marker',
            fontSize: story ? 44 : 32,
            color: PINK,
            marginTop: story ? 10 : 6,
          }}
        >
          {countLabel}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: row, alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ height: story ? 12 : 8, background: INK, width: story ? 320 : 220, display: 'flex' }} />
        <span
          style={{
            fontFamily: 'Courier',
            fontSize: story ? 28 : 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {SITE_HOST}
        </span>
      </div>
    </div>
  );
}
