'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@sunghoon-log/shared';
import type { InputVariants } from './input.variants';
import { inputSizeConfig, inputVariants } from './input.variants';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariants {
  ref?: React.Ref<HTMLInputElement>;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  /** Label text for floating label mode. When set, the label sits inside the input and animates upward on focus or when the input has a value. */
  floatingLabel?: string;
  /** Optional `htmlFor` connection for the floating label element. */
  floatingLabelId?: string;
}

export function Input({
  className,
  variant,
  inputSize,
  ref,
  startAdornment,
  endAdornment,
  floatingLabel,
  floatingLabelId,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  placeholder,
  ...props
}: InputProps) {
  const config = inputSizeConfig[inputSize ?? 'md'];

  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<HTMLInputElement | null>(null);

  // Track whether an uncontrolled input has a value
  const [hasInternalValue, setHasInternalValue] = useState(
    () => defaultValue !== undefined && defaultValue !== ''
  );

  const hasControlledValue = value !== undefined && value !== '';
  const hasValue = hasControlledValue || hasInternalValue;
  const isFloated = isFocused || hasValue;

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Re-check the native value for uncontrolled inputs
      setHasInternalValue(e.target.value !== '');
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasInternalValue(e.target.value !== '');
      onChange?.(e);
    },
    [onChange]
  );

  // Merge refs: forward the external ref and keep an internal one
  const mergedRef = useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref]
  );

  const isFloating = !!floatingLabel;

  const inputElement = (
    <input
      ref={mergedRef}
      id={isFloating ? floatingLabelId : undefined}
      className={cn(
        inputVariants({ variant, inputSize }),
        startAdornment && config.padding.start,
        endAdornment && config.padding.end,
        isFloating && config.floating.inputPadding,
        className
      )}
      placeholder={isFloating ? undefined : placeholder}
      value={value}
      defaultValue={defaultValue}
      onFocus={isFloating ? handleFocus : onFocus}
      onBlur={isFloating ? handleBlur : onBlur}
      onChange={isFloating ? handleChange : onChange}
      {...props}
    />
  );

  const needsWrapper = !!startAdornment || !!endAdornment || isFloating;

  if (!needsWrapper) return inputElement;

  return (
    <div className="relative">
      {startAdornment && (
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 flex items-center',
            config.typography,
            config.offset.start
          )}
        >
          {startAdornment}
        </span>
      )}
      {inputElement}
      {isFloating && (
        <label
          htmlFor={floatingLabelId}
          className={cn(
            'absolute left-1 origin-top-left pointer-events-none',
            'transition-all duration-200',
            'text-muted-foreground',
            isFloated ? config.floating.labelFloated : config.floating.labelDefault,
            isFocused && isFloated && 'text-[var(--input-border-focus)]',
            startAdornment && config.floating.labelStart
          )}
          data-test-id={floatingLabel ? 'input-floating-label' : undefined}
        >
          {floatingLabel}
        </label>
      )}
      {endAdornment && (
        <span
          className={cn(
            'absolute inset-y-0 right-0 flex items-center',
            config.typography,
            config.offset.end
          )}
        >
          {endAdornment}
        </span>
      )}
    </div>
  );
}
