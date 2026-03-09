'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

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
  const Icon = icons[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme[theme])}
      className="p-2 rounded-lg text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      <Icon size={18} />
    </button>
  );
};
