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

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-base font-bold tracking-[-0.03em] text-foreground"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground font-mono text-xs text-background transition-transform group-hover:-rotate-6">
            O
          </span>
          orka.log
        </Link>

        <div className="flex items-center gap-2">
          <nav
            aria-label="주요 메뉴"
            className="flex items-center rounded-full border border-border bg-muted/40 p-1"
          >
            {navItems.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
