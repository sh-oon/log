'use client';

import { createContext, use, useId, useState } from 'react';
import { cn } from '@orka-log/shared';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface RadioItemProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

/* --------------------------------- Context -------------------------------- */

interface RadioContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  name: string;
  size: 'sm' | 'md' | 'lg';
}

const RadioContext = createContext<RadioContextValue | null>(null);

function useRadioContext() {
  const ctx = use(RadioContext);
  if (!ctx) {
    throw new Error('RadioItem must be used within a RadioGroup');
  }
  return ctx;
}

/* ------------------------------ Size config ------------------------------- */

const sizeConfig = {
  sm: {
    circle: 'size-4',
    dot: 'size-1.5',
    label: 'text-sm-regular',
  },
  md: {
    circle: 'size-5',
    dot: 'size-2',
    label: 'text-sm-regular',
  },
  lg: {
    circle: 'size-6',
    dot: 'size-2.5',
    label: 'text-md-regular',
  },
} as const;

/* ------------------------------- RadioGroup ------------------------------- */

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  orientation = 'vertical',
  size = 'md',
  children,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      aria-orientation={orientation}
      className={cn(orientation === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-4', className)}
      data-test-id="radio-group"
    >
      <RadioContext
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          disabled,
          name: name ?? generatedName,
          size,
        }}
      >
        {children}
      </RadioContext>
    </div>
  );
}

/* -------------------------------- RadioItem ------------------------------- */

export function RadioItem({
  value,
  label,
  description,
  disabled: itemDisabled,
  className,
  ref,
}: RadioItemProps) {
  const ctx = useRadioContext();
  const config = sizeConfig[ctx.size];
  const isDisabled = ctx.disabled || itemDisabled;
  const isChecked = ctx.value === value;

  const handleChange = () => {
    if (!isDisabled) {
      ctx.onValueChange(value);
    }
  };

  return (
    <label
      className={cn(
        'inline-flex items-start gap-2',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
      data-test-id="radio-item"
    >
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-full',
          config.circle
        )}
      >
        <input
          ref={ref}
          type="radio"
          name={ctx.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className={cn(
            'peer appearance-none rounded-full border-2 border-gray-200 bg-transparent',
            'transition-all duration-200',
            'checked:border-control-checked',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
            'disabled:cursor-not-allowed',
            config.circle
          )}
          data-test-id="radio-input"
        />
        <span
          className={cn(
            'absolute hidden rounded-full bg-control-checked peer-checked:block',
            config.dot
          )}
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <Text
              as="span"
              typography={config.label}
              color="foreground"
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              as="span"
              typography="text-xs-regular"
              color="muted"
            >
              {description}
            </Text>
          )}
        </span>
      )}
    </label>
  );
}
