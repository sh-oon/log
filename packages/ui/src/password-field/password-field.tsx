'use client';

import { useState } from 'react';
import { Field } from '../field';
import { EyeIcon, EyeOffIcon } from '../icons';
import { Input } from '../input';
import { type InputVariants, inputSizeConfig } from '../input/input.variants';

export interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    InputVariants {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function PasswordField({
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  variant,
  inputSize,
  className,
  ref,
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const config = inputSizeConfig[inputSize ?? 'md'];

  const floatingLabel = label || undefined;

  return (
    <Field
      helperText={helperText}
      errorMessage={errorMessage}
      required={required}
      disabled={disabled}
    >
      {(fieldProps) => (
        <Input
          {...fieldProps}
          {...rest}
          type={visible ? 'text' : 'password'}
          variant={errorMessage ? 'error' : variant}
          inputSize={inputSize}
          disabled={disabled}
          ref={ref}
          floatingLabel={floatingLabel}
          floatingLabelId={fieldProps.id}
          endAdornment={
            <button
              type="button"
              className="text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              onClick={() => setVisible(!visible)}
              disabled={disabled}
              aria-label={visible ? 'Hide password' : 'Show password'}
              tabIndex={-1}
              data-test-id="password-field-toggle"
            >
              {visible ? <EyeOffIcon size={config.iconSize} /> : <EyeIcon size={config.iconSize} />}
            </button>
          }
          className={className}
          data-test-id="password-field-input"
        />
      )}
    </Field>
  );
}
