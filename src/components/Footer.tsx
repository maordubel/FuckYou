import { BuiltByDubel } from '@/components/ui/BuiltByDubel';
import { t } from '@/lib/i18n';

export function Footer() {
  return (
    <footer className="mt-10 bg-ink text-paper">
      <svg className="-mb-px block h-4 w-full text-ink" viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 8c18-6 30 2 48-2s28 4 46 1 30-7 48-3 28 6 46 2 30-6 48-2 28 5 46 2 30-6 48-2 22 6 30 4v10H0Z"
          fill="currentColor"
        />
      </svg>
      <div className="mx-auto flex max-w-[940px] flex-col gap-3 px-[18px] pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="fy-type space-y-1 text-[11px] leading-relaxed text-paper/80">
          <p>{t('footer.legal')}</p>
          <p>{t('footer.privacy')}</p>
        </div>
        <BuiltByDubel variant="madeWithLove" />
      </div>
    </footer>
  );
}
