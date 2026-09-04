import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Providers } from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = 'https://orka-log.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'orka.log',
    template: '%s | orka.log',
  },
  description: '정성훈 - 프론트엔드 개발자 포트폴리오 & 기술 블로그',
  keywords: [
    '프론트엔드',
    'Frontend',
    'React',
    'Next.js',
    'TypeScript',
    '포트폴리오',
    '기술 블로그',
    '정성훈',
  ],
  authors: [{ name: 'orka', url: SITE_URL }],
  creator: 'orka',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'orka.log',
    title: '정성훈 · Frontend Developer',
    description: '디자인 시스템, 프론트엔드 아키텍처, DX 자동화를 설계하는 정성훈의 포트폴리오',
  },
  twitter: {
    card: 'summary',
    title: '정성훈 · Frontend Developer',
    description: '디자인 시스템, 프론트엔드 아키텍처, DX 자동화를 설계하는 정성훈의 포트폴리오',
  },
  manifest: '/assets/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
