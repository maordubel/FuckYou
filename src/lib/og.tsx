import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_HOST } from '@/lib/site';

/** Satori supports a narrow slice of CSS: flexbox, borders, colours, no
 *  transforms, filters or clip paths. The zine survives that because the
 *  identity is blocks, weight and colour rather than texture. */
export const PAPER = '#efebe3';
export const INK = '#121110';
export const LIME = '#d8f32b';
export const PINK = '#f5216b';

type Fonts = { anton: ArrayBuffer; marker: ArrayBuffer; archivo: ArrayBuffer; courier: ArrayBuffer };

/** Satori reads woff, never woff2, so the card fonts are the .woff twins of
 *  the ones the site loads. next.config traces src/fonts into the bundle. */
async function face(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(join(process.cwd(), 'src', 'fonts', file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function loadFonts(): Promise<Fonts> {
  const [anton, marker, archivo, courier] = await Promise.all([
    face('anton-latin-400-normal.woff'),
    face('permanent-marker-latin-400-normal.woff'),
    face('archivo-latin-700-normal.woff'),
    face('courier-prime-latin-400-normal.woff'),
  ]);
  return { anton, marker, archivo, courier };
}

export function fontSpec(fonts: Fonts) {
  return [
    { name: 'Anton', data: fonts.anton, weight: 400 as const, style: 'normal' as const },
    { name: 'Marker', data: fonts.marker, weight: 400 as const, style: 'normal' as const },
    { name: 'Archivo', data: fonts.archivo, weight: 700 as const, style: 'normal' as const },
    { name: 'Courier', data: fonts.courier, weight: 400 as const, style: 'normal' as const },
  ];
}

function nameSize(name: string, big: boolean): number {
  const length = name.length;
  if (big) {
    if (length <= 14) return 120;
    if (length <= 24) return 96;
    if (length <= 36) return 76;
    return 60;
  }
  if (length <= 14) return 88;
  if (length <= 24) return 70;
  if (length <= 36) return 56;
  return 44;
}

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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
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
        <span style={{ fontFamily: 'Marker', fontSize: story ? 30 : 24, lineHeight: 1.2, textAlign: 'right' }}>
          Say it.{'\n'}Don&apos;t send it.
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
            }}
          >
            {reason}
          </span>
        ) : null}

        <span
          style={{
            fontFamily: 'Archivo',
            fontWeight: 700,
            fontSize: nameSize(name, story),
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          {name}
        </span>

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
