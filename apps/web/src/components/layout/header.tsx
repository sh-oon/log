'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flex } from '@orka-log/ui';
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <Flex
        justify="between"
        align="center"
        className="max-w-3xl mx-auto px-6 h-16"
      >
        <Link
          href="/"
          className="font-bold text-lg tracking-tight"
        >
          Seonghun.log
        </Link>
        <Flex
          align="center"
          gap={2}
        >
          <nav className="flex space-x-1 p-1 bg-muted rounded-lg">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  isActive(href)
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </Flex>
      </Flex>
    </header>
  );
};
