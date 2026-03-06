'use client';

import { cn } from '@sunghoon-log/shared';

/* ---------------------------------- Types --------------------------------- */

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'muted' | 'inherit';
  label?: string;
  className?: string;
}

/* ---------------------------------- Maps ---------------------------------- */

const sizeClassMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
} as const;

const colorClassMap = {
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  inherit: 'text-current',
} as const;

/* -------------------------------- Spinner --------------------------------- */

export function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Loading',
  className,
}: SpinnerProps) {
  return (
    <output
      className={cn('inline-flex items-center justify-center', className)}
      data-test-id="spinner"
    >
      <svg
        className={cn('animate-spin', sizeClassMap[size], colorClassMap[color])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="62.83"
          strokeDashoffset="47.12"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </output>
  );
}
