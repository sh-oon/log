import { cva, type VariantProps } from '@orka-log/shared';

export const inputVariants = cva(
  [
    'flex w-full bg-transparent border-b-2 border-border px-1 text-foreground',
    'transition-all duration-200',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:border-[var(--input-border-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive-500 focus-visible:border-destructive-500',
      },
      inputSize: {
        sm: 'h-10 text-sm',
        md: 'h-12 text-sm',
        lg: 'h-14 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;

/**
 * Size tokens for adornment layout, mapped per `inputSize` variant.
 *
 * - `iconSize`  — default px size for internally-owned icons (clear, toggle)
 * - `typography` — typography utility class matching the input font-size
 * - `padding`   — input padding when adornment is present
 * - `offset`    — adornment container inset from the edge
 * - `floating`  — tokens for floating-label mode
 */
export const inputSizeConfig = {
  sm: {
    iconSize: 16,
    typography: 'text-sm-regular',
    padding: { start: 'pl-7', end: 'pr-7' },
    offset: { start: 'pl-1', end: 'pr-1' },
    floating: {
      inputPadding: 'pt-4 pb-0.5',
      // content area center: pt-4(16) + (40-16-2)/2 = 27px
      labelDefault: 'top-[27px] -translate-y-1/2 text-sm',
      labelFloated: 'top-1 translate-y-0 scale-75',
      labelStart: 'left-7',
    },
  },
  md: {
    iconSize: 18,
    typography: 'text-sm-regular',
    padding: { start: 'pl-8', end: 'pr-8' },
    offset: { start: 'pl-1', end: 'pr-1' },
    floating: {
      inputPadding: 'pt-5 pb-1',
      // content area center: pt-5(20) + (48-20-4)/2 = 32px
      labelDefault: 'top-[32px] -translate-y-1/2 text-sm',
      labelFloated: 'top-1 translate-y-0 scale-75',
      labelStart: 'left-8',
    },
  },
  lg: {
    iconSize: 20,
    typography: 'text-md-regular',
    padding: { start: 'pl-10', end: 'pr-10' },
    offset: { start: 'pl-1', end: 'pr-1' },
    floating: {
      inputPadding: 'pt-6 pb-1',
      // content area center: pt-6(24) + (56-24-4)/2 = 38px
      labelDefault: 'top-[38px] -translate-y-1/2 text-base',
      labelFloated: 'top-1 translate-y-0 scale-75',
      labelStart: 'left-10',
    },
  },
} as const;
