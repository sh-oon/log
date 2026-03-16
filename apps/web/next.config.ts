import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sunghoon-log/ui', '@sunghoon-log/shared', '@sunghoon-log/lib'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
