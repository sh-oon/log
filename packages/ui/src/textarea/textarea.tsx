'use client';

import { useCallback, useState } from 'react';
import { cn } from '@orka-log/shared';
import type { TextareaVariants } from './textarea.variants';
import { textareaVariants } from './textarea.variants';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    TextareaVariants {
  ref?: React.Ref<HTMLTextAreaElement>;
  /** Label text for floating label mode. When set, the label sits inside the textarea and animates upward on focus or when the textarea has a value. */
  floatingLabel?: string;
  /** Optional `htmlFor` connection for the floating label element. */
  floatingLabelId?: string;
}

export function Textarea({
  className,
  variant,
  textareaSize,
  ref,
  floatingLabel,
  floatingLabelId,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  placeholder,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const [internalHasValue, setInternalHasValue] = useState(
    () => defaultValue !== undefined && defaultValue !== ''
  );

  const hasValue = value !== undefined ? value !== '' : internalHasValue;
  const isFloated = isFocused || hasValue;
  const isFloating = !!floatingLabel;

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setInternalHasValue(e.target.value !== '');
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInternalHasValue(e.target.value !== '');
      onChange?.(e);
    },
    [onChange]
  );

  const textareaElement = (
    <textarea
      ref={ref}
      id={isFloating ? floatingLabelId : undefined}
      className={cn(textareaVariants({ variant, textareaSize }), isFloating && 'pt-6', className)}
      placeholder={isFloating ? undefined : placeholder}
      value={value}
      defaultValue={defaultValue}
      onFocus={isFloating ? handleFocus : onFocus}
      onBlur={isFloating ? handleBlur : onBlur}
      onChange={isFloating ? handleChange : onChange}
      data-test-id="textarea"
      {...props}
    />
  );

  if (!isFloating) return textareaElement;

  return (
    <div className="relative">
      {textareaElement}
      <label
        htmlFor={floatingLabelId}
        className={cn(
          'absolute left-1 origin-top-left pointer-events-none',
          'transition-all duration-200',
          'text-muted-foreground',
          isFloated ? 'top-2 translate-y-0 scale-75' : 'top-6 translate-y-0 text-sm',
          isFocused && isFloated && 'text-[var(--input-border-focus)]'
        )}
        data-test-id="textarea-floating-label"
      >
        {floatingLabel}
      </label>
    </div>
  );
}
