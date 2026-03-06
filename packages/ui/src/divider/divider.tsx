'use client';

import { cn } from '@sunghoon-log/shared';

/* ---------------------------------- Types --------------------------------- */

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/* --------------------------------- Divider -------------------------------- */

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return (
    <hr
      aria-orientation={orientation}
      className={cn(
        'border-none',
        orientation === 'horizontal' ? 'h-px w-full bg-border' : 'w-px self-stretch bg-border',
        className
      )}
      data-test-id="divider"
    />
  );
}
