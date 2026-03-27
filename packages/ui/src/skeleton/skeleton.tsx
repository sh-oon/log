'use client';

import { cn } from '@orka-log/shared';

/* ---------------------------------- Types --------------------------------- */

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/* ------------------------------- Variant map ------------------------------ */

const variantClassMap = {
  text: 'h-4 w-full rounded-lg',
  circular: 'rounded-full',
  rectangular: 'rounded-xl',
} as const;

/* -------------------------------- Skeleton -------------------------------- */

export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  const style: React.CSSProperties = {
    ...(width != null && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height != null && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      aria-hidden="true"
      data-test-id="skeleton"
      className={cn('bg-muted animate-pulse', variantClassMap[variant], className)}
      style={Object.keys(style).length > 0 ? style : undefined}
    />
  );
}
