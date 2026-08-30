import { t } from '@/lib/i18n';

/**
 * The wordmark: poster caps sitting on a highlighter swipe. The swipe is a
 * hand-drawn quadrilateral, never a rectangle, and it animates in by being
 * wiped across rather than faded.
 */
export function Wordmark({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const big = size === 'lg';

  return (
    <span className={`relative inline-block ${big ? '' : 'align-middle'}`} data-anim>
      {/* A replaced element sized only by insets falls back to its intrinsic
          ratio, so the swipe lives in a box that stretches and the svg fills it. */}
      <span
        className="fy-swatch absolute block text-lime"
        style={{ inset: big ? '-10px -18px -10px -12px' : '-5px -8px -5px -6px' }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" viewBox="0 0 300 130" preserveAspectRatio="none">
          <path
            d="M6 16C74 6 168 2 292 9c6 32 5 76 2 112C196 128 96 130 9 121 3 92 2 50 6 16Z"
            fill="currentColor"
          />
        </svg>
      </span>

      <span
        className={`fy-poster relative block -rotate-[1.6deg] leading-[0.84] ${
          big ? 'text-[clamp(2.75rem,13vw,4rem)]' : 'text-xl'
        }`}
      >
        {t('app.wordmarkA')}
        {big ? <br /> : ' '}
        {t('app.wordmarkB')}
      </span>
    </span>
  );
}
