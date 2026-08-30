declare module 'bidi-js' {
  type Levels = { levels: Uint8Array; paragraphs: Array<{ start: number; end: number; level: number }> };
  type Bidi = {
    getEmbeddingLevels(text: string, baseDirection?: 'ltr' | 'rtl' | 'auto'): Levels;
    getReorderSegments(text: string, levels: Levels, start?: number, end?: number): Array<[number, number]>;
    getReorderedString(text: string, levels: Levels, start?: number, end?: number): string;
    getReorderedIndices(text: string, levels: Levels, start?: number, end?: number): number[];
    getMirroredCharacter(char: string): string | null;
  };
  export default function bidiFactory(): Bidi;
}
