import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sunghoon-log/ui', '@sunghoon-log/shared', '@sunghoon-log/lib'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
