import { cva, type VariantProps } from '@sunghoon-log/shared';

export const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between bg-transparent border-b-2 border-border px-1',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:border-[var(--input-border-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive-500 focus-visible:border-destructive-500',
      },
      selectSize: {
        sm: 'h-10 text-sm',
        md: 'h-12 text-sm',
        lg: 'h-14 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      selectSize: 'md',
    },
  }
);

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

/**
 * Size tokens for select layout, mapped per `selectSize` variant.
 *
 * - `iconSize`    — default px size for chevron / check icons
 * - `typography`  — typography variant for trigger and item text
 * - `itemHeight`  — height class for dropdown items
 * - `floating`    — padding and label position tokens for floating-label mode
 */
export const selectSizeConfig = {
  sm: {
    iconSize: 14,
    typography: 'text-sm-regular',
    itemHeight: 'h-9',
    floating: {
      inputPadding: 'pt-4 pb-0.5',
      labelDefault: 'top-1/2 -translate-y-1/2 text-sm',
      labelFloated: 'top-1.5 translate-y-0 scale-75',
    },
  },
  md: {
    iconSize: 16,
    typography: 'text-sm-regular',
    itemHeight: 'h-10',
    floating: {
      inputPadding: 'pt-5 pb-1',
      labelDefault: 'top-1/2 -translate-y-1/2 text-sm',
      labelFloated: 'top-2 translate-y-0 scale-75',
    },
  },
  lg: {
    iconSize: 20,
    typography: 'text-md-regular',
    itemHeight: 'h-11',
    floating: {
      inputPadding: 'pt-6 pb-1',
      labelDefault: 'top-1/2 -translate-y-1/2 text-base',
      labelFloated: 'top-2 translate-y-0 scale-75',
    },
  },
} as const;
