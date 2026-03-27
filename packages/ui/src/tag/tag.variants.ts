import { cva, type VariantProps } from '@orka-log/shared';

export const tagVariants = cva(
  'inline-flex items-center rounded-full transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-destructive-50 text-destructive-700',
        info: 'bg-blue-50 text-blue-700',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export type TagVariants = VariantProps<typeof tagVariants>;

const textVariantMap = {
  sm: 'text-xs-medium',
  md: 'text-sm-medium',
} as const;

export { textVariantMap };
