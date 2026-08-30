import { Witness } from '@/components/Witness';
import { Wordmark } from '@/components/Wordmark';
import { t } from '@/lib/i18n';

/** The masthead: wordmark on its highlighter, the crown, and the little face. */
export function SiteHead({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <Wordmark size={compact ? 'sm' : 'lg'} />

      <div className="flex flex-col items-end gap-1">
        <div className="flex items-start gap-1.5">
          <Witness />
          <svg className="fy-draw h-[34px] w-[46px] rotate-[6deg] text-ink" data-anim aria-hidden="true">
            <use href="#d-crown" />
          </svg>
        </div>
        <p className="fy-marker mt-1 -rotate-[4deg] text-end text-[clamp(0.875rem,3.4vw,1.0625rem)] leading-[1.15]">
          Say it.
          <br />
          Don&apos;t send it.
        </p>
        <span className="sr-only">{t('app.tagline')}</span>
      </div>
    </div>
  );
}
