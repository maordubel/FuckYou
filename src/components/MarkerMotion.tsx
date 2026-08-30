'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One observer for the whole page: anything marked [data-anim] gets `is-on`
 * the first time it reaches the screen, which is what starts the marker
 * drawing. Elements clipped to zero width never intersect, so the clipped
 * parts always sit inside a wrapper that carries the attribute instead.
 */
export function MarkerMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function prepare(node: HTMLElement) {
      if (node.dataset.animReady === '1') return;
      node.dataset.animReady = '1';
      if (node.classList.contains('fy-stagger')) {
        Array.from(node.children).forEach((child, index) => {
          (child as HTMLElement).style.animationDelay = `${index * 45}ms`;
        });
      }
    }

    if (reduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll<HTMLElement>('[data-anim]').forEach((node) => {
        prepare(node);
        node.classList.add('is-on');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-on');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    function scan() {
      document.querySelectorAll<HTMLElement>('[data-anim]:not(.is-on)').forEach((node) => {
        prepare(node);
        observer.observe(node);
      });
    }

    scan();

    // Client navigation and interactive panels add ornaments after mount.
    const mutations = new MutationObserver(() => scan());
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}

/** A +1 flicked off whatever was just pressed. */
export function flickPlusOne(node: HTMLElement | null) {
  if (!node) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = node.getBoundingClientRect();
  const tag = document.createElement('span');
  tag.className = 'fy-plusone';
  tag.textContent = '+1';
  tag.style.left = `${rect.left + rect.width / 2 - 10 + window.scrollX}px`;
  tag.style.top = `${rect.top - 6 + window.scrollY}px`;
  document.body.appendChild(tag);
  window.setTimeout(() => tag.remove(), 720);
}
