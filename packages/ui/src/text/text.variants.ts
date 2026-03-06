// ---------------------------------------------------------------------------
// Text Style Variants
// ---------------------------------------------------------------------------

const typography = {
  // Title 2XL
  /** font-size: 2.25rem · line-height: 2.75rem · font-weight: 700 · letter-spacing: -0.025em */
  'title-2xl-bold': 'title-2xl-bold',
  /** font-size: 2.25rem · line-height: 2.75rem · font-weight: 600 · letter-spacing: -0.025em */
  'title-2xl-semibold': 'title-2xl-semibold',
  /** font-size: 2.25rem · line-height: 2.75rem · font-weight: 500 · letter-spacing: -0.025em */
  'title-2xl-medium': 'title-2xl-medium',
  /** font-size: 2.25rem · line-height: 2.75rem · font-weight: 400 · letter-spacing: -0.025em */
  'title-2xl-regular': 'title-2xl-regular',

  // Title XL
  /** font-size: 1.875rem · line-height: 2.25rem · font-weight: 700 · letter-spacing: -0.025em */
  'title-xl-bold': 'title-xl-bold',
  /** font-size: 1.875rem · line-height: 2.25rem · font-weight: 600 · letter-spacing: -0.025em */
  'title-xl-semibold': 'title-xl-semibold',
  /** font-size: 1.875rem · line-height: 2.25rem · font-weight: 500 · letter-spacing: -0.025em */
  'title-xl-medium': 'title-xl-medium',
  /** font-size: 1.875rem · line-height: 2.25rem · font-weight: 400 · letter-spacing: -0.025em */
  'title-xl-regular': 'title-xl-regular',

  // Title LG
  /** font-size: 1.5rem · line-height: 2rem · font-weight: 700 · letter-spacing: -0.02em */
  'title-lg-bold': 'title-lg-bold',
  /** font-size: 1.5rem · line-height: 2rem · font-weight: 600 · letter-spacing: -0.02em */
  'title-lg-semibold': 'title-lg-semibold',
  /** font-size: 1.5rem · line-height: 2rem · font-weight: 500 · letter-spacing: -0.02em */
  'title-lg-medium': 'title-lg-medium',
  /** font-size: 1.5rem · line-height: 2rem · font-weight: 400 · letter-spacing: -0.02em */
  'title-lg-regular': 'title-lg-regular',

  // Title MD
  /** font-size: 1.25rem · line-height: 1.75rem · font-weight: 700 · letter-spacing: -0.01em */
  'title-md-bold': 'title-md-bold',
  /** font-size: 1.25rem · line-height: 1.75rem · font-weight: 600 · letter-spacing: -0.01em */
  'title-md-semibold': 'title-md-semibold',
  /** font-size: 1.25rem · line-height: 1.75rem · font-weight: 500 · letter-spacing: -0.01em */
  'title-md-medium': 'title-md-medium',
  /** font-size: 1.25rem · line-height: 1.75rem · font-weight: 400 · letter-spacing: -0.01em */
  'title-md-regular': 'title-md-regular',

  // Title SM
  /** font-size: 1.125rem · line-height: 1.5rem · font-weight: 700 */
  'title-sm-bold': 'title-sm-bold',
  /** font-size: 1.125rem · line-height: 1.5rem · font-weight: 600 */
  'title-sm-semibold': 'title-sm-semibold',
  /** font-size: 1.125rem · line-height: 1.5rem · font-weight: 500 */
  'title-sm-medium': 'title-sm-medium',
  /** font-size: 1.125rem · line-height: 1.5rem · font-weight: 400 */
  'title-sm-regular': 'title-sm-regular',

  // Title XS
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 700 */
  'title-xs-bold': 'title-xs-bold',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 600 */
  'title-xs-semibold': 'title-xs-semibold',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 500 */
  'title-xs-medium': 'title-xs-medium',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 400 */
  'title-xs-regular': 'title-xs-regular',

  // Text LG
  /** font-size: 1.125rem · line-height: 1.75rem · font-weight: 700 */
  'text-lg-bold': 'text-lg-bold',
  /** font-size: 1.125rem · line-height: 1.75rem · font-weight: 600 */
  'text-lg-semibold': 'text-lg-semibold',
  /** font-size: 1.125rem · line-height: 1.75rem · font-weight: 500 */
  'text-lg-medium': 'text-lg-medium',
  /** font-size: 1.125rem · line-height: 1.75rem · font-weight: 400 */
  'text-lg-regular': 'text-lg-regular',

  // Text MD
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 700 */
  'text-md-bold': 'text-md-bold',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 600 */
  'text-md-semibold': 'text-md-semibold',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 500 */
  'text-md-medium': 'text-md-medium',
  /** font-size: 1rem · line-height: 1.5rem · font-weight: 400 */
  'text-md-regular': 'text-md-regular',

  // Text SM
  /** font-size: 0.875rem · line-height: 1.25rem · font-weight: 700 */
  'text-sm-bold': 'text-sm-bold',
  /** font-size: 0.875rem · line-height: 1.25rem · font-weight: 600 */
  'text-sm-semibold': 'text-sm-semibold',
  /** font-size: 0.875rem · line-height: 1.25rem · font-weight: 500 */
  'text-sm-medium': 'text-sm-medium',
  /** font-size: 0.875rem · line-height: 1.25rem · font-weight: 400 */
  'text-sm-regular': 'text-sm-regular',

  // Text XS
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 700 */
  'text-xs-bold': 'text-xs-bold',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 600 */
  'text-xs-semibold': 'text-xs-semibold',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 500 */
  'text-xs-medium': 'text-xs-medium',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 400 */
  'text-xs-regular': 'text-xs-regular',

  // Label LG
  /** font-size: 1rem · line-height: 1.25rem · font-weight: 700 */
  'label-lg-bold': 'label-lg-bold',
  /** font-size: 1rem · line-height: 1.25rem · font-weight: 600 */
  'label-lg-semibold': 'label-lg-semibold',
  /** font-size: 1rem · line-height: 1.25rem · font-weight: 500 */
  'label-lg-medium': 'label-lg-medium',
  /** font-size: 1rem · line-height: 1.25rem · font-weight: 400 */
  'label-lg-regular': 'label-lg-regular',

  // Label MD
  /** font-size: 0.875rem · line-height: 1rem · font-weight: 700 */
  'label-md-bold': 'label-md-bold',
  /** font-size: 0.875rem · line-height: 1rem · font-weight: 600 */
  'label-md-semibold': 'label-md-semibold',
  /** font-size: 0.875rem · line-height: 1rem · font-weight: 500 */
  'label-md-medium': 'label-md-medium',
  /** font-size: 0.875rem · line-height: 1rem · font-weight: 400 */
  'label-md-regular': 'label-md-regular',

  // Label SM
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 700 · letter-spacing: 0.01em */
  'label-sm-bold': 'label-sm-bold',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 600 · letter-spacing: 0.01em */
  'label-sm-semibold': 'label-sm-semibold',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 500 · letter-spacing: 0.01em */
  'label-sm-medium': 'label-sm-medium',
  /** font-size: 0.75rem · line-height: 1rem · font-weight: 400 · letter-spacing: 0.01em */
  'label-sm-regular': 'label-sm-regular',
} as const;

export type Typography = keyof typeof typography;

// ---------------------------------------------------------------------------
// Text Color
// ---------------------------------------------------------------------------

const textColors = {
  /** Default text color (maps to `text-foreground`) */
  foreground: 'foreground',
  /** Secondary text (maps to `text-muted-foreground`) */
  muted: 'muted',
  /** Primary accent (maps to `text-primary`) */
  primary: 'primary',
  /** Error text (maps to `text-destructive-600`) */
  destructive: 'destructive',
  /** Success text (maps to `text-success-600`) */
  success: 'success',
  /** Warning text (maps to `text-warning-600`) */
  warning: 'warning',
  /** Inherit from parent (maps to `text-inherit`) */
  inherit: 'inherit',
} as const;

export type TextColor = keyof typeof textColors;

export const colorClassMap: Record<TextColor, string> = {
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  destructive: 'text-destructive-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  inherit: 'text-inherit',
};

// ---------------------------------------------------------------------------
// Text Align
// ---------------------------------------------------------------------------

export type TextAlign = 'left' | 'center' | 'right';

export const alignClassMap: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};
