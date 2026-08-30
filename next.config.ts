import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  // the share cards read their fonts off disk at request time
  outputFileTracingIncludes: {
    '/opengraph-image': ['./src/fonts/*.woff'],
    '/n/[id]/opengraph-image': ['./src/fonts/*.woff'],
    '/n/[id]/story': ['./src/fonts/*.woff'],
  },
};

/** Source maps and release tagging only when a DSN and an org are configured;
 *  otherwise this is a no-op wrapper and the build is untouched. */
export default process.env.SENTRY_ORG
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      widenClientFileUpload: true,
      disableLogger: true,
    })
  : nextConfig;
