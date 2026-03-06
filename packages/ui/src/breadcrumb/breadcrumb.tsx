'use client';

import { cn } from '@sunghoon-log/shared';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbListProps {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbPageProps {
  children: React.ReactNode;
  className?: string;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

/* ------------------------------- Breadcrumb ------------------------------- */

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      data-test-id="breadcrumb"
    >
      {children}
    </nav>
  );
}

/* ----------------------------- BreadcrumbList ----------------------------- */

export function BreadcrumbList({ children, className }: BreadcrumbListProps) {
  return (
    <ol
      className={cn('flex items-center gap-1.5 flex-wrap', className)}
      data-test-id="breadcrumb-list"
    >
      {children}
    </ol>
  );
}

/* ----------------------------- BreadcrumbItem ----------------------------- */

export function BreadcrumbItem({ children, className }: BreadcrumbItemProps) {
  return (
    <li
      className={cn('inline-flex items-center gap-1.5', className)}
      data-test-id="breadcrumb-item"
    >
      {children}
    </li>
  );
}

/* ----------------------------- BreadcrumbLink ----------------------------- */

export function BreadcrumbLink({ href, children, className }: BreadcrumbLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm',
        className
      )}
      data-test-id="breadcrumb-link"
    >
      <Text
        as="span"
        typography="text-sm-regular"
        color="inherit"
      >
        {children}
      </Text>
    </a>
  );
}

/* ----------------------------- BreadcrumbPage ----------------------------- */

export function BreadcrumbPage({ children, className }: BreadcrumbPageProps) {
  return (
    <Text
      as="span"
      typography="text-sm-medium"
      color="foreground"
      aria-current="page"
      className={className}
      data-test-id="breadcrumb-page"
    >
      {children}
    </Text>
  );
}

/* --------------------------- BreadcrumbSeparator -------------------------- */

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      aria-hidden="true"
      className="text-muted-foreground"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function BreadcrumbSeparator({ children, className }: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('inline-flex items-center', className)}
      data-test-id="breadcrumb-separator"
    >
      {children ?? <ChevronRight />}
    </li>
  );
}
