'use client';

import { useId } from 'react';
import { cn } from '@orka-log/shared';

export interface FieldProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
    'aria-required'?: boolean;
  }) => React.ReactNode;
  className?: string;
}

export function Field({
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  children,
  className,
}: FieldProps) {
  const id = useId();
  const descriptionId = `${id}-desc`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn('label-sm-medium', disabled && 'text-muted-foreground')}
        >
          {label}
          {required && <span className="text-destructive-500 ml-0.5">*</span>}
        </label>
      )}
      {children({
        id,
        'aria-describedby': errorMessage || helperText ? descriptionId : undefined,
        'aria-invalid': errorMessage ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {(errorMessage || helperText) && (
        <p
          id={descriptionId}
          className={cn(
            'text-xs-regular',
            errorMessage ? 'text-destructive-500' : 'text-muted-foreground'
          )}
          aria-live={errorMessage ? 'polite' : undefined}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
}
