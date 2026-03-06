'use client';

import { Field } from '../field';
import { useControllableInput, useMergedRef } from '../hooks';
import { XIcon } from '../icons';
import { Input } from '../input';
import { type InputVariants, inputSizeConfig } from '../input/input.variants';

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariants {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  clearable?: boolean;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export function TextField({
  label,
  helperText,
  errorMessage,
  required,
  disabled,
  clearable,
  onClear,
  onSearch,
  startIcon,
  endIcon,
  variant,
  inputSize,
  className,
  ref,
  value,
  defaultValue,
  onChange,
  onKeyDown,
  ...props
}: TextFieldProps) {
  const {
    value: currentValue,
    inputRef,
    handleChange,
    clear,
  } = useControllableInput({
    value,
    defaultValue,
    onChange,
  });
  const mergedRef = useMergedRef(ref, inputRef);
  const config = inputSizeConfig[inputSize ?? 'md'];

  const showClear = clearable && currentValue !== '' && currentValue !== undefined;

  const handleClear = () => {
    clear();
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(String(currentValue ?? ''));
    }
    onKeyDown?.(e);
  };

  const startAdornment = startIcon ? (
    <span className="text-muted-foreground">{startIcon}</span>
  ) : undefined;

  const endAdornment = showClear ? (
    <button
      type="button"
      onClick={handleClear}
      disabled={disabled}
      className="text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      aria-label="Clear"
      data-test-id="text-field-clear-button"
    >
      <XIcon size={config.iconSize} />
    </button>
  ) : endIcon ? (
    <span className="pointer-events-none text-muted-foreground">{endIcon}</span>
  ) : undefined;

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
          {...props}
          ref={mergedRef}
          value={currentValue}
          variant={errorMessage ? 'error' : variant}
          inputSize={inputSize}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          floatingLabel={floatingLabel}
          floatingLabelId={fieldProps.id}
          className={className}
          data-test-id="text-field-input"
        />
      )}
    </Field>
  );
}
