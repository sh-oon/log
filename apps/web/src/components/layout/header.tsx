'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@orka-log/shared';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navItems = [
  { href: '/', label: 'Resume' },
  { href: '/blog', label: 'Tech Blog' },
] as const;

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass-strong mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pl-4 pr-2 sm:pl-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-base font-bold tracking-[-0.03em] text-foreground"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground font-mono text-xs text-background transition-transform group-hover:-rotate-6">
            O
          </span>
          orka.log
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="주요 메뉴"
            className="flex items-center rounded-full bg-foreground/[0.04] p-1 dark:bg-white/[0.04]"
          >
            {navItems.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative isolate rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="header-nav-active"
                      aria-hidden="true"
                      className="glass absolute inset-0 -z-10 rounded-full"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : null}
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
