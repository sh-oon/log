'use client';

import { cn } from '@orka-log/shared';
import { Text } from '../text';
import type { Typography } from '../text/text.variants';
import type { TagVariants } from './tag.variants';
import { tagVariants, textVariantMap } from './tag.variants';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: TagVariants['variant'];
  size?: 'sm' | 'md';
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

export function Tag({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ref,
  ...props
}: TagProps) {
  const textVariant: Typography = textVariantMap[size];

  return (
    <span
      ref={ref}
      className={cn(tagVariants({ variant, size }), className)}
      data-test-id="tag"
      {...props}
    >
      <Text
        as="span"
        typography={textVariant}
        color="inherit"
      >
        {children}
      </Text>
    </span>
  );
}
