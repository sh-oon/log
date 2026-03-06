'use client';

import { useCallback } from 'react';
import { cn } from '@sunghoon-log/shared';
import { Text } from '../text';

const sizeConfig = {
  sm: {
    box: 'size-4 rounded',
    icon: { width: 12, height: 12 },
    labelTypography: 'text-sm-regular',
  },
  md: {
    box: 'size-5 rounded-md',
    icon: { width: 14, height: 14 },
    labelTypography: 'text-sm-regular',
  },
  lg: {
    box: 'size-6 rounded-lg',
    icon: { width: 16, height: 16 },
    labelTypography: 'text-md-regular',
  },
} as const;

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  ref?: React.Ref<HTMLInputElement>;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  description,
  size = 'md',
  ref,
  id,
  ...props
}: CheckboxProps) {
  const config = sizeConfig[size];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    },
    [onCheckedChange]
  );

  return (
    <label
      className={cn(
        'inline-flex items-start gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      data-test-id="checkbox-label"
    >
      <span className={cn('relative flex shrink-0 items-center justify-center', config.box)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          className={cn(
            'peer appearance-none',
            'absolute inset-0',
            'border-2 bg-transparent transition-all duration-200',
            'border-gray-200 hover:border-gray-300',
            'checked:bg-control-checked checked:border-control-checked',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            config.box
          )}
          data-test-id="checkbox-input"
          {...props}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={config.icon.width}
          height={config.icon.height}
          className="pointer-events-none absolute hidden peer-checked:block"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <Text
              as="span"
              typography={config.labelTypography}
              color="foreground"
              data-test-id="checkbox-label-text"
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              as="span"
              typography="text-xs-regular"
              color="muted"
              data-test-id="checkbox-description"
            >
              {description}
            </Text>
          )}
        </span>
      )}
    </label>
  );
}
