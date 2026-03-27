'use client';

import { cn } from '@orka-log/shared';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

/* ---------------------------------- Maps ---------------------------------- */

const sizeClassMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

const colorClassMap = {
  primary: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
} as const;

/* -------------------------------- Progress -------------------------------- */

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clampedValue / max) * 100) : 0;

  return (
    <div
      className={cn('flex w-full items-center gap-3', className)}
      data-test-id="progress"
    >
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('bg-muted w-full overflow-hidden rounded-full', sizeClassMap[size])}
        data-test-id="progress-track"
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClassMap[color]
          )}
          style={{ width: `${percentage}%` }}
          data-test-id="progress-fill"
        />
      </div>
      {showLabel && (
        <Text
          as="span"
          typography="text-xs-medium"
          color="muted"
          className="shrink-0 tabular-nums"
          data-test-id="progress-label"
        >
          {percentage}%
        </Text>
      )}
    </div>
  );
}
