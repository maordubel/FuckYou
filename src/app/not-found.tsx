import Link from 'next/link';
import { SiteHead } from '@/components/SiteHead';
import { t } from '@/lib/i18n';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-[18px] pt-5 pb-10">
      <SiteHead compact />
      <main id="main" className="mt-16">
        <h1 className="fy-poster text-[clamp(2.5rem,12vw,4rem)] leading-[0.9] normal-case">
          {t('entry.gone')}
        </h1>
        <p className="mt-3 text-ink-70">{t('entry.goneBody')}</p>
        <Link
          href="/"
          className="fy-marker mt-6 inline-flex min-h-13 items-center border-[2.5px] border-ink bg-ink px-5 text-lg text-lime"
        >
          {t('entry.goneCta')}
        </Link>
      </main>
    </div>
  );
}
