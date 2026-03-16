'use client';

import { SessionProvider } from 'next-auth/react';
import { OverlayProvider } from 'overlay-kit';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <OverlayProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </OverlayProvider>
  </SessionProvider>
);
