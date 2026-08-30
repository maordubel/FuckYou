import bidiFactory from 'bidi-js';

/**
 * Satori has no bidi algorithm and no `direction` support, so a Hebrew or
 * Arabic name handed to it straight comes out reversed on the share card.
 * Browsers do this for us; the image renderer does not. So we run the Unicode
 * Bidirectional Algorithm ourselves and hand Satori the string already in
 * visual order — left to right, exactly as it should be painted.
 *
 * Two details the naive "just reverse it" fix gets wrong and this does not:
 *   - mixed runs. "דני 12 Cohen" has three runs with three directions; only
 *     the Hebrew one may be flipped. The UBA works that out from the
 *     characters themselves, so English inside a Hebrew name stays readable.
 *   - combining marks. Reversing code points puts niqqud *before* its letter.
 *     We reverse grapheme clusters instead, so שָׁ stays שָׁ.
 */
const bidi = bidiFactory();

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

/** Logical index -> start index of the grapheme cluster it belongs to, plus that
 *  cluster's length in UTF-16 units. Built once per string. */
function clusterMap(text: string): { start: Int32Array; length: Int32Array } {
  const start = new Int32Array(text.length);
  const length = new Int32Array(text.length);
  if (!segmenter) {
    for (let i = 0; i < text.length; i += 1) {
      start[i] = i;
      length[i] = 1;
    }
    return { start, length };
  }
  for (const piece of segmenter.segment(text)) {
    const from = piece.index;
    const size = piece.segment.length;
    for (let i = from; i < from + size; i += 1) {
      start[i] = from;
      length[i] = size;
    }
  }
  return { start, length };
}

/** Cheap gate: no RTL characters, no work. Covers Hebrew, Arabic, Syriac, Thaana, NKo. */
const RTL = /[\u0590-\u05FF\u0600-\u07FF\uFB1D-\uFB4F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Reorder a string into the visual order Satori should paint it in.
 *
 * The UBA gives us the visual position of every character. We do not simply
 * emit them in that order: a grapheme cluster (a letter plus its niqqud, an
 * emoji made of several code points) must stay in its own logical order even
 * though the run around it is flipped. So we walk the visual sequence and emit
 * whole clusters, not characters. Brackets inside a right-to-left run are
 * mirrored on the way out, so "(הבוס)" still opens on the right.
 */
export function toVisualOrder(text: string): string {
  if (!text || !RTL.test(text)) return text;

  const levels = bidi.getEmbeddingLevels(text, 'auto');
  const order = bidi.getReorderedIndices(text, levels);
  const { start, length } = clusterMap(text);

  const out: string[] = [];
  for (let position = 0; position < order.length; ) {
    const index = order[position];
    const from = start[index];
    const size = length[index];
    if (size > 1) {
      out.push(text.slice(from, from + size));
    } else {
      const rtlRun = (levels.levels[index] & 1) === 1;
      out.push((rtlRun ? bidi.getMirroredCharacter(text[index]) : null) ?? text[index]);
    }
    position += size;
  }
  return out.join('');
}

/** True when the string's base direction is right-to-left — used to align the card. */
export function isRtl(text: string): boolean {
  if (!text || !RTL.test(text)) return false;
  for (const char of text) {
    if (RTL.test(char)) return true;
    if (/[A-Za-z\u00C0-\u024F\u0370-\u058F]/.test(char)) return false;
  }
  return false;
}
