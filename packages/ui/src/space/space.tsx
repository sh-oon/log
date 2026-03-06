'use client';

import { cn } from '@sunghoon-log/shared';

// ---------------------------------------------------------------------------
// Size Config
// ---------------------------------------------------------------------------

const sizeClassMap = {
  vertical: {
    xs: 'h-1 w-full',
    sm: 'h-2 w-full',
    md: 'h-4 w-full',
    lg: 'h-6 w-full',
    xl: 'h-8 w-full',
    '2xl': 'h-12 w-full',
  },
  horizontal: {
    xs: 'w-1 h-full inline-block',
    sm: 'w-2 h-full inline-block',
    md: 'w-4 h-full inline-block',
    lg: 'w-6 h-full inline-block',
    xl: 'w-8 h-full inline-block',
    '2xl': 'w-12 h-full inline-block',
  },
} as const;

type SpaceSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SpaceDirection = 'horizontal' | 'vertical';

// ---------------------------------------------------------------------------
// Space
// ---------------------------------------------------------------------------

export interface SpaceProps {
  size?: SpaceSize | number;
  direction?: SpaceDirection;
  className?: string;
}

export function Space({ size = 'md', direction = 'vertical', className }: SpaceProps) {
  if (typeof size === 'number') {
    const style =
      direction === 'vertical' ? { height: size, width: '100%' } : { width: size, height: '100%' };

    return (
      <div
        className={cn(direction === 'horizontal' && 'inline-block', className)}
        style={style}
        aria-hidden="true"
        data-test-id="space"
      />
    );
  }

  return (
    <div
      className={cn(sizeClassMap[direction][size], className)}
      aria-hidden="true"
      data-test-id="space"
    />
  );
}
