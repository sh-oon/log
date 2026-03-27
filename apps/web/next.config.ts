import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@orka-log/ui', '@orka-log/shared', '@orka-log/lib'],
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
