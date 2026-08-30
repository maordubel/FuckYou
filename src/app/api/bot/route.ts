import { NextResponse } from 'next/server';
import { seedDay } from '@/lib/bot/seed';

export const dynamic = 'force-dynamic';

/**
 * The daily bot. Vercel Cron calls it with the secret; nothing else can.
 * It writes through the same RPCs a visitor uses, so it cannot bypass the
 * duplicate merge, the content guard or the rate limit.
 */
export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; BOT_SECRET lets you
  // fire it by hand from a terminal.
  const secrets = [process.env.CRON_SECRET, process.env.BOT_SECRET].filter(Boolean);
  if (secrets.length === 0) {
    return NextResponse.json({ ok: false, error: 'no-secret' }, { status: 503 });
  }

  const header = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const key = new URL(request.url).searchParams.get('key');
  const supplied = header ?? key ?? '';

  if (!secrets.includes(supplied)) {
    return NextResponse.json({ ok: false, error: 'denied' }, { status: 401 });
  }

  const added = await seedDay();
  return NextResponse.json({ ok: true, added }, { headers: { 'Cache-Control': 'no-store' } });
}
