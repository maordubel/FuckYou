'use client';

import { useCallback, useEffect, useRef } from 'react';
import { t } from '@/lib/i18n';

type Face = 'calm' | 'shock' | 'grin';

const MOUTHS: Record<Face, string> = {
  calm: 'M21 44c4 3 14 3 18 0',
  shock: 'M24 46a6 5 0 1 0 12 0a6 5 0 1 0 -12 0',
  grin: 'M18 42c6 8 18 8 24 0',
};

const BROWS: Record<Face, [string, string]> = {
  calm: ['M15 20l10 4', 'M45 20l-10 4'],
  shock: ['M14 17l11 5', 'M46 17l-11 5'],
  grin: ['M15 21l10 2', 'M45 21l-10 2'],
};

/**
 * A little face in the corner that follows your pointer, goes wide-eyed when
 * you send a name and grins when you back one. It is the only thing on the
 * page that reacts to you without being asked.
 */
export function Witness() {
  const root = useRef<SVGSVGElement>(null);
  const frame = useRef<number | null>(null);

  const setFace = useCallback((face: Face) => {
    const node = root.current;
    if (!node) return;
    node.querySelector('#fy-mouth')?.setAttribute('d', MOUTHS[face]);
    node.querySelector('#fy-brow-l')?.setAttribute('d', BROWS[face][0]);
    node.querySelector('#fy-brow-r')?.setAttribute('d', BROWS[face][1]);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function look(clientX: number, clientY: number) {
      const svg = root.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const dx = clientX - (rect.left + rect.width / 2);
      const dy = clientY - (rect.top + rect.height / 2);
      const distance = Math.max(1, Math.hypot(dx, dy));
      const x = (dx / distance) * Math.min(2.6, distance / 60);
      const y = (dy / distance) * Math.min(2.4, distance / 70);
      svg.querySelectorAll<SVGCircleElement>('.fy-pupil').forEach((pupil) => {
        pupil.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    function onMove(event: PointerEvent) {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        look(event.clientX, event.clientY);
      });
    }

    function onReact(event: Event) {
      const face = (event as CustomEvent<Face>).detail ?? 'calm';
      setFace(face);
      window.setTimeout(() => setFace('calm'), face === 'shock' ? 1400 : 1100);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('fy:react', onReact as EventListener);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('fy:react', onReact as EventListener);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [setFace]);

  return (
    <svg
      ref={root}
      viewBox="0 0 60 60"
      className="h-[54px] w-[54px] shrink-0 text-ink"
      role="img"
      aria-label={t('vent.witnessLabel')}
    >
      <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <path id="fy-brow-l" d={BROWS.calm[0]} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path id="fy-brow-r" d={BROWS.calm[1]} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="21" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="39" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle className="fy-pupil transition-transform duration-[90ms]" cx="21" cy="30" r="2.6" fill="currentColor" />
      <circle className="fy-pupil transition-transform duration-[90ms]" cx="39" cy="30" r="2.6" fill="currentColor" />
      <path id="fy-mouth" d={MOUTHS.calm} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function reactWitness(face: Face) {
  window.dispatchEvent(new CustomEvent('fy:react', { detail: face }));
}
