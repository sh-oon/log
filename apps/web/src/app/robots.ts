import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin', '/api/'],
  },
  sitemap: 'https://orka-log.vercel.app/sitemap.xml',
});

export default robots;
