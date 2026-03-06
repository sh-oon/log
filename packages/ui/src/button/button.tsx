'use client';

import { cn } from '@sunghoon-log/shared';
import type { ButtonVariants } from './button.variants';
import { buttonVariants } from './button.variants';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  ref?: React.Ref<HTMLButtonElement>;
}

export function Button({ className, variant, size, rounded, ref, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, rounded }), className)}
      {...props}
    />
  );
}
