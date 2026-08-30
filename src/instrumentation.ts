import * as Sentry from '@sentry/nextjs';

/**
 * Sentry is inert without a DSN, so the app runs the same locally and in CI.
 * PII is filtered before send: the wall is anonymous and must stay that way.
 */
export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    beforeSend(event) {
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
      delete event.user;
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;
