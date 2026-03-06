import { cva, type VariantProps } from '@sunghoon-log/shared';

export const textareaVariants = cva(
  [
    'flex w-full bg-transparent border-b-2 border-border px-1 py-2 text-foreground',
    'transition-all duration-200',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:border-[var(--input-border-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-vertical',
  ],
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive-500 focus-visible:border-destructive-500',
      },
      textareaSize: {
        sm: 'min-h-24 text-sm',
        md: 'min-h-32 text-sm',
        lg: 'min-h-40 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'md',
    },
  }
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
