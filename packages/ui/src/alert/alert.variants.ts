import { cva, type VariantProps } from '@orka-log/shared';

export const alertVariants = cva(
  'flex gap-3 rounded-xl p-4 border-l-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted border-l-border',
        success: 'bg-green-50 border-l-green-500',
        warning: 'bg-yellow-50 border-l-yellow-500',
        error: 'bg-red-50 border-l-red-500',
        info: 'bg-blue-50 border-l-blue-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type AlertVariants = VariantProps<typeof alertVariants>;
