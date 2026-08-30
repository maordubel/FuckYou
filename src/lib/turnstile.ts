const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
export const turnstileOn = TURNSTILE_SITE_KEY.length > 0 && (process.env.TURNSTILE_SECRET_KEY ?? '').length > 0;

/**
 * Inert until both keys exist, so the site runs without a Cloudflare account
 * and starts checking the moment one is added.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY ?? '';
  if (secret === '' || TURNSTILE_SITE_KEY === '') return true;
  if (token === '') return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // A Cloudflare outage must not take the wall down with it.
    return true;
  }
}
