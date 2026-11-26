'use client';

import { MotionConfig } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { OverlayProvider } from 'overlay-kit';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <MotionConfig reducedMotion="user">
      <OverlayProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </OverlayProvider>
    </MotionConfig>
  </SessionProvider>
);
