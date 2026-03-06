'use client';

import { useRef, useState } from 'react';

interface UseControllableInputOptions {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useControllableInput({
  value: controlledValue,
  defaultValue = '',
  onChange,
}: UseControllableInputOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const clear = () => {
    if (!isControlled) setInternalValue('');
    inputRef.current?.focus();
  };

  return { value, inputRef, handleChange, clear };
}
