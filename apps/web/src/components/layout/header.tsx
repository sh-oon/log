'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navItems = [
  { href: '/', label: 'Resume' },
  { href: '/blog', label: 'Tech Blog' },
] as const;

export const Header = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
      <div className="max-w-3xl mx-auto px-6 h-16 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight"
        >
          Seonghun.log
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex space-x-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  isActive(href)
                    ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
