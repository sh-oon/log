import { cn } from '@orka-log/shared';
import type { BadgeVariants } from './badge.variants';
import { badgeVariants } from './badge.variants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariants {
  ref?: React.Ref<HTMLSpanElement>;
}

export function Badge({ className, variant, rounded, ref, ...props }: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, rounded }), className)}
      {...props}
    />
  );
}
