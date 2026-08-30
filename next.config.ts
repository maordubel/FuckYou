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

export default nextConfig;
