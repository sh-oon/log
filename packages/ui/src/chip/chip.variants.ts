import { cva, type VariantProps } from '@orka-log/shared';

export const chipVariants = cva(
  [
    'inline-flex items-center gap-1',
    'rounded-full border',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-1',
        md: 'px-4 py-1.5',
      },
      selected: {
        true: 'bg-primary text-primary-foreground border-primary',
        false: 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80',
      },
    },
    defaultVariants: {
      size: 'md',
      selected: false,
    },
  }
);

export type ChipVariants = VariantProps<typeof chipVariants>;

const textVariantMap = {
  sm: 'text-xs-medium',
  md: 'text-sm-medium',
} as const;

export { textVariantMap };
