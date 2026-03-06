'use client';

import { cn } from '@sunghoon-log/shared';
import { XIcon } from '../icons';
import { Text } from '../text';
import type { Typography } from '../text/text.variants';
import { chipVariants, textVariantMap } from './chip.variants';

export interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onDismiss?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Chip({
  children,
  selected = false,
  disabled = false,
  onSelect,
  onDismiss,
  size = 'md',
  className,
}: ChipProps) {
  const textVariant: Typography = textVariantMap[size];

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onDismiss?.();
  };

  if (onDismiss) {
    return (
      <span
        className={cn(chipVariants({ size, selected }), 'cursor-default', className)}
        data-test-id="chip"
      >
        <button
          type="button"
          className="cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none"
          disabled={disabled}
          onClick={handleClick}
          aria-pressed={selected}
          data-test-id="chip-select"
        >
          <Text
            as="span"
            typography={textVariant}
            color="inherit"
          >
            {children}
          </Text>
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'cursor-pointer bg-transparent border-none p-0',
            'hover:bg-foreground/10 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            size === 'sm' ? 'ml-0.5 size-4' : 'ml-1 size-5'
          )}
          disabled={disabled}
          onClick={handleDismiss}
          aria-label="Dismiss"
          data-test-id="chip-dismiss"
        >
          <XIcon size={12} />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cn(chipVariants({ size, selected }), className)}
      disabled={disabled}
      onClick={handleClick}
      data-test-id="chip"
      aria-pressed={selected}
    >
      <Text
        as="span"
        typography={textVariant}
        color="inherit"
      >
        {children}
      </Text>
    </button>
  );
}
