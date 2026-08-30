import { BuiltByDubel } from '@/components/ui/BuiltByDubel';
import { t } from '@/lib/i18n';

export function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-ink bg-tar px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-paper sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1 text-sm text-paper/90">
          <p>{t('footer.legal')}</p>
          <p>{t('footer.privacy')}</p>
        </div>
        <BuiltByDubel variant="madeWithLove" />
      </div>
    </footer>
  );
}
