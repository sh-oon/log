import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@sunghoon-log/ui', '@sunghoon-log/shared', '@sunghoon-log/lib'],
};

export default nextConfig;
