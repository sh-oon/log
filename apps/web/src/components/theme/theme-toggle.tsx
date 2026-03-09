'use client';

import type { IconName } from '@sunghoon-log/ui';
import { Icon } from '@sunghoon-log/ui';
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
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
