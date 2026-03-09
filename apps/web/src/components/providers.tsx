'use client';

import { OverlayProvider } from 'overlay-kit';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <OverlayProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </OverlayProvider>
);
