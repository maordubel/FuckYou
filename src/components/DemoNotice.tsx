import { isLive } from '@/lib/env';
import { t } from '@/lib/i18n';

/**
 * Without Supabase keys the app runs on an in-memory store that dies with the
 * process — fine for local work, disastrous to mistake for the real thing.
 * So it says so, loudly, instead of looking like it saved your name.
 */
export function DemoNotice() {
  if (isLive) return null;

  return (
    <aside className="mt-5 border-[2.5px] border-ink bg-pink px-4 py-3 text-white">
      <p className="fy-marker text-lg">{t('demo.title')}</p>
      <p className="mt-1 text-sm">{t('demo.body')}</p>
    </aside>
  );
}
