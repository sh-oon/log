'use client';

import { useState } from 'react';
import { cn, cva, type VariantProps } from '@sunghoon-log/shared';
import { Text } from '../text';

const switchTrackVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-white shadow-sm transition-transform',
  {
    variants: {
      size: {
        sm: 'size-3',
        md: 'size-4',
        lg: 'size-5',
      },
      checked: {
        true: '',
        false: 'translate-x-0.5',
      },
    },
    compoundVariants: [
      { size: 'sm', checked: true, class: 'translate-x-3' },
      { size: 'md', checked: true, class: 'translate-x-4' },
      { size: 'lg', checked: true, class: 'translate-x-5' },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
);

const labelSizeVariants = {
  sm: 'text-xs-regular',
  md: 'text-sm-regular',
  lg: 'text-md-regular',
} as const;

type SwitchSize = VariantProps<typeof switchTrackVariants>['size'];

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: SwitchSize;
  name?: string;
  value?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  description,
  size = 'md',
  name,
  value,
  className,
  ref,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      className={cn('inline-flex items-start gap-2', disabled && 'cursor-not-allowed', className)}
    >
      <button
        ref={ref}
        role="switch"
        type="button"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          switchTrackVariants({ size }),
          isChecked ? 'bg-control-checked' : 'bg-gray-100'
        )}
        data-test-id="switch-track"
      >
        <span className={switchThumbVariants({ size, checked: isChecked })} />
      </button>
      {name && (
        <input
          type="hidden"
          name={name}
          value={isChecked ? (value ?? 'on') : ''}
        />
      )}
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <Text
              as="span"
              typography={labelSizeVariants[size ?? 'md']}
              color="foreground"
              data-test-id="switch-label"
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              as="span"
              typography="text-xs-regular"
              color="muted"
              data-test-id="switch-description"
            >
              {description}
            </Text>
          )}
        </span>
      )}
    </label>
  );
}
