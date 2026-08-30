'use client';

import Script from 'next/script';
import { useId } from 'react';
import { TURNSTILE_SITE_KEY } from '@/lib/turnstile';

/**
 * Renders nothing until a site key exists. The widget writes its token into a
 * hidden field named cf-turnstile-response, which the server action checks.
 */
export function Turnstile() {
  const id = useId();
  if (TURNSTILE_SITE_KEY === '') return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      <div
        id={`ts-${id}`}
        className="cf-turnstile mt-2"
        data-sitekey={TURNSTILE_SITE_KEY}
        data-size="flexible"
        data-theme="light"
      />
    </>
  );
}
