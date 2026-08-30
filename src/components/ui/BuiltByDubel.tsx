import Image from 'next/image';
import { t } from '@/lib/i18n';

const DUBEL_URL = 'https://DubelTeam.com';

type Variant = 'builtBy' | 'engineered' | 'designedDev' | 'built' | 'developedBy' | 'madeWithLove';

/**
 * Dubel Team footer credit — mandatory on every project.
 * Wording is picked per project through `variant`; never hard-coded here.
 */
export function BuiltByDubel({
  variant = 'builtBy',
  showEmblem = true,
  className = '',
}: {
  variant?: Variant;
  showEmblem?: boolean;
  className?: string;
}) {
  const label = t(`credit.${variant}`);

  return (
    <a
      href={DUBEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('credit.aria', { label })}
      className={[
        'inline-flex min-h-11 items-center gap-2 py-2 ps-1 pe-1',
        'fy-type text-[11px] text-paper',
        'transition-opacity hover:opacity-80 motion-reduce:transition-none',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        className,
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="font-bold">Dubel Team</span>
      {showEmblem ? (
        <Image
          src="/brand/dubel-team-emblem.png"
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          sizes="20px"
          className="h-5 w-5 shrink-0 rounded-full"
        />
      ) : null}
    </a>
  );
}
