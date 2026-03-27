import { cva, type VariantProps } from '@orka-log/shared';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-button-primary text-button-primary-foreground hover:bg-button-primary-hover active:bg-button-primary-pressed disabled:bg-button-primary-disabled disabled:text-button-primary-foreground',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
        destructive:
          'bg-destructive-600 text-white hover:bg-destructive-700 active:bg-destructive-800',
        outline:
          'border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      },
      size: {
        sm: 'h-10 px-4 label-md-medium',
        md: 'h-12 px-5 label-lg-medium',
        lg: 'h-14 px-8 text-md-medium',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'xl',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
