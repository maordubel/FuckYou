'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

const SETTLE_MS = 900;

/**
 * The wall listens to the table and refreshes itself, so a count climbs while
 * you are looking at it. Server data stays the single source of truth — this
 * only asks for it again, and coalesces bursts into one request.
 */
export function LiveWall() {
  const router = useRouter();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel('fy-wall')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fy_entries' }, () => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => router.refresh(), SETTLE_MS);
      })
      .subscribe();

    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
