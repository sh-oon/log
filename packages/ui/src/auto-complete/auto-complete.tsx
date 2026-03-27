'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '@orka-log/shared';
import gsap from 'gsap';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface AutoCompleteOption {
  value: string;
  label: string;
}

export interface AutoCompleteProps {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onInputChange?: (input: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  filterFn?: (option: AutoCompleteOption, inputValue: string) => boolean;
  floatingLabel?: string;
}

/* ---------------------------------- Utils --------------------------------- */

function defaultFilter(option: AutoCompleteOption, inputValue: string): boolean {
  return option.label.toLowerCase().includes(inputValue.toLowerCase());
}

function findLabelByValue(options: AutoCompleteOption[], value: string): string {
  const found = options.find((o) => o.value === value);
  return found ? found.label : '';
}

/* -------------------------------- Component ------------------------------- */

export function AutoComplete({
  options,
  value,
  defaultValue,
  onValueChange,
  onInputChange,
  placeholder,
  disabled = false,
  className,
  emptyMessage = 'No results found',
  filterFn,
  floatingLabel,
}: AutoCompleteProps) {
  const listboxId = useId();
  const inputId = useId();

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = isControlled ? value : internalValue;

  const [inputValue, setInputValue] = useState(() => {
    const initial = isControlled ? value : defaultValue;
    return initial ? findLabelByValue(options, initial) : '';
  });

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = inputValue !== '';
  const isFloated = isFocused || hasValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const filter = filterFn ?? defaultFilter;

  const filteredOptions = useMemo(
    () => options.filter((option) => filter(option, inputValue)),
    [options, inputValue, filter]
  );

  /* ----------------------- Controlled value sync ------------------------ */
  useEffect(() => {
    if (isControlled) {
      const label = findLabelByValue(options, value);
      setInputValue(label);
    }
  }, [isControlled, value, options]);

  /* --------------------------- Open / Close ----------------------------- */
  const openDropdown = useCallback(() => {
    if (disabled || isAnimatingRef.current) return;
    setOpen(true);
    setMounted(true);
    setHighlightedIndex(-1);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    if (!open || isAnimatingRef.current) return;

    if (!dropdownRef.current) {
      setOpen(false);
      setMounted(false);
      return;
    }

    isAnimatingRef.current = true;

    gsap.to(dropdownRef.current, {
      opacity: 0,
      y: -4,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => {
        isAnimatingRef.current = false;
        setOpen(false);
        setMounted(false);
      },
    });
  }, [open]);

  /* ---------------------- Enter animation on mount ---------------------- */

  useEffect(() => {
    if (!open || !mounted || !dropdownRef.current) return;

    isAnimatingRef.current = true;

    gsap.fromTo(
      dropdownRef.current,
      { opacity: 0, y: -4 },
      {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      }
    );
  }, [open, mounted]);

  /* ----------------------- Click outside handler ------------------------ */

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, closeDropdown]);

  /* ----------------------------- Selection ------------------------------ */

  const selectOption = useCallback(
    (option: AutoCompleteOption) => {
      setInputValue(option.label);
      onInputChange?.(option.label);

      if (!isControlled) {
        setInternalValue(option.value);
      }
      onValueChange?.(option.value);
      closeDropdown();
    },
    [isControlled, onValueChange, onInputChange, closeDropdown]
  );

  /* ------------------------- Input change handler ----------------------- */

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onInputChange?.(newValue);
      setHighlightedIndex(-1);

      if (!open) {
        openDropdown();
      }
    },
    [open, openDropdown, onInputChange]
  );

  /* --------------------------- Focus handler ---------------------------- */

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (!disabled) {
      openDropdown();
    }
  }, [disabled, openDropdown]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  /* ---------------------- Keyboard navigation --------------------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            setHighlightedIndex((prev) => {
              const next = prev + 1;
              return next >= filteredOptions.length ? 0 : next;
            });
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            setHighlightedIndex((prev) => {
              const next = prev - 1;
              return next < 0 ? filteredOptions.length - 1 : next;
            });
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (open && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            selectOption(filteredOptions[highlightedIndex]);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          closeDropdown();
          break;
        }
        case 'Tab': {
          closeDropdown();
          break;
        }
      }
    },
    [disabled, open, highlightedIndex, filteredOptions, openDropdown, closeDropdown, selectOption]
  );

  /* ---------------------- Scroll into view helper ----------------------- */

  const optionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (highlightedIndex >= 0) {
      const el = optionRefs.current.get(highlightedIndex);
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  /* ------------------------------ Render -------------------------------- */

  const showDropdown = mounted && (filteredOptions.length > 0 || inputValue.length > 0);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      data-test-id="auto-complete"
    >
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={floatingLabel ? undefined : placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'flex w-full bg-transparent border-b-2 border-border px-1 h-12 text-sm text-foreground',
            'transition-all duration-200',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:border-[var(--input-border-focus)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            floatingLabel && 'pt-5 pb-1'
          )}
          data-test-id="auto-complete-input"
        />
        {floatingLabel && (
          <span
            className={cn(
              'absolute left-1 origin-top-left pointer-events-none',
              'transition-all duration-200',
              'text-muted-foreground',
              isFloated ? 'top-2 translate-y-0 scale-75' : 'top-1/2 -translate-y-1/2 text-sm',
              isFocused && isFloated && 'text-[var(--input-border-focus)]'
            )}
            aria-hidden="true"
          >
            {floatingLabel}
          </span>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={inputId}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1 overflow-hidden overflow-y-auto max-h-60 py-1',
            'bg-background border border-border rounded-xl shadow-soft-lg'
          )}
          style={{ opacity: 0 }}
          data-test-id="auto-complete-listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isHighlighted = highlightedIndex === index;
              const isSelected = currentValue === option.value;

              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard handling is on the input combobox
                <div
                  key={option.value}
                  ref={(el) => {
                    if (el) {
                      optionRefs.current.set(index, el);
                    } else {
                      optionRefs.current.delete(index);
                    }
                  }}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  className={cn(
                    'px-3 h-9 flex items-center cursor-pointer transition-all duration-200',
                    isHighlighted && 'bg-muted'
                  )}
                  data-test-id="auto-complete-option"
                >
                  <Text
                    as="span"
                    typography="text-sm-regular"
                    color="foreground"
                    className="flex-1"
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <CheckIcon
                      size={16}
                      className="shrink-0 text-foreground"
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div
              className="px-3 py-6 text-center"
              data-test-id="auto-complete-empty"
            >
              <Text
                as="span"
                typography="text-sm-regular"
                color="muted"
              >
                {emptyMessage}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Icons ---------------------------------- */

function CheckIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
