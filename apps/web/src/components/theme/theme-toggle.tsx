'use client';

import type { IconName } from '@orka-log/ui';
import { Icon } from '@orka-log/ui';
import { useTheme } from './theme-provider';

const icons: Record<string, IconName> = {
  light: 'sun',
  dark: 'moon',
  system: 'monitor',
};

const nextTheme = {
  light: 'dark',
  dark: 'system',
  system: 'light',
} as const;

const labels = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System mode',
} as const;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme[theme])}
      className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground dark:hover:bg-white/[0.08]"
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      <Icon
        name={icons[theme]}
        size={18}
      />
    </button>
  );
};
