import { cva, type VariantProps } from '@orka-log/shared';

export const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        secondary: 'bg-gray-100 text-gray-700',
        destructive: 'bg-destructive-100 text-destructive-700',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-warning-100 text-warning-700',
        outline: 'border border-gray-200 text-gray-700 bg-transparent',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      rounded: 'full',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
