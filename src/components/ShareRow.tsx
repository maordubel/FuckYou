'use client';

import { useState } from 'react';
import { Tape } from '@/components/Tape';
import { t } from '@/lib/i18n';
import { entryUrl, storyUrl } from '@/lib/site';
import { formatNumber } from '@/lib/text';
import type { Entry } from '@/types/entry';

type Nav = Navigator & { canShare?: (data?: ShareData) => boolean };

/**
 * Sending it on is the whole point, so every route out is one tap:
 * WhatsApp with the line already written, the story card as an image, the
 * system sheet where it exists, and the link on the clipboard.
 */
export function ShareRow({ entry }: { entry: Entry }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const url = entryUrl(entry.id);
  const text = t('share.text', { name: entry.name, n: formatNumber(entry.votes), url });

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t('share.copy'), url);
    }
  }

  async function saveStory() {
    setBusy(true);
    try {
      const response = await fetch(storyUrl(entry.id));
      const blob = await response.blob();
      const file = new File([blob], `fuckyou-${entry.id}.png`, { type: 'image/png' });
      const nav = navigator as Nav;

      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text });
      } else {
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(href);
      }
    } catch {
      window.open(storyUrl(entry.id), '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  }

  async function systemShare() {
    try {
      await navigator.share({ title: t('app.title'), text, url });
    } catch {
      await copy();
    }
  }

  const cell =
    'flex min-h-[68px] flex-col items-center justify-center gap-1.5 border-2 border-ink px-2 py-3 text-[11px] font-bold uppercase tracking-[0.06em]';

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2.5">
        <Tape width={120}>{t('share.title')}</Tape>
        <svg className="fy-draw h-5 w-[34px] text-ink" data-anim aria-hidden="true">
          <use href="#d-arrow" />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cell} fy-type bg-lime text-ink`}
        >
          <svg className="h-6 w-6" aria-hidden="true">
            <use href="#s-whatsapp" />
          </svg>
          {t('share.whatsapp')}
        </a>

        <button type="button" onClick={saveStory} disabled={busy} className={`${cell} fy-type bg-transparent`}>
          <svg className="h-6 w-6" aria-hidden="true">
            <use href="#s-story" />
          </svg>
          {busy ? t('share.storyBusy') : t('share.story')}
        </button>

        <button type="button" onClick={systemShare} className={`${cell} fy-type bg-transparent`}>
          <svg className="h-6 w-6" aria-hidden="true">
            <use href="#s-share" />
          </svg>
          {t('share.native')}
        </button>

        <button
          type="button"
          onClick={copy}
          className={`${cell} fy-type ${copied ? 'bg-pink text-white' : 'bg-transparent'}`}
        >
          <svg className="h-6 w-6" aria-hidden="true">
            <use href="#s-link" />
          </svg>
          {copied ? t('share.copied') : t('share.copy')}
        </button>
      </div>
    </section>
  );
}
