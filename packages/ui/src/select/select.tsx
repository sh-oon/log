'use client';

import { createContext, use, useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@sunghoon-log/shared';
import gsap from 'gsap';
import { Text } from '../text';
import type { SelectTriggerVariants } from './select.variants';
import { selectSizeConfig, selectTriggerVariants } from './select.variants';

/* ---------------------------------- Types --------------------------------- */

export interface SelectGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  selectSize?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface SelectTriggerProps extends SelectTriggerVariants {
  placeholder?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  floatingLabel?: string;
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface SelectLabelProps {
  children: React.ReactNode;
  className?: string;
}

export interface SelectSeparatorProps {
  className?: string;
}

/* --------------------------------- Context -------------------------------- */

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectSize: 'sm' | 'md' | 'lg';
  triggerId: string;
  contentId: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemValues: React.RefObject<string[]>;
  disabledItems: React.RefObject<Set<string>>;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = use(SelectContext);
  if (!ctx) {
    throw new Error('Select sub-components must be used within a SelectGroup');
  }
  return ctx;
}

/* ------------------------------- SelectGroup ------------------------------ */

export function SelectGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  selectSize = 'md',
  children,
  className,
}: SelectGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [open, setOpenState] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState('');
  const itemValues = useRef<string[]>([]);
  const disabledItems = useRef<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerId = useId();
  const contentId = useId();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setOpen = useCallback((isOpen: boolean) => {
    if (isOpen) {
      itemValues.current = [];
      disabledItems.current = new Set();
    }
    setOpenState(isOpen);
  }, []);

  const handleValueChange = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
      setOpen(false);
    },
    [isControlled, onValueChange, setOpen]
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      data-test-id="select-group"
    >
      <SelectContext
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          disabled,
          open,
          setOpen,
          selectSize,
          triggerId,
          contentId,
          highlightedIndex,
          setHighlightedIndex,
          itemValues,
          disabledItems,
          selectedLabel,
          setSelectedLabel,
        }}
      >
        {children}
      </SelectContext>
    </div>
  );
}

/* ------------------------------ SelectTrigger ----------------------------- */

export function SelectTrigger({
  placeholder = 'Select an option',
  variant,
  selectSize: selectSizeProp,
  className,
  ref,
  floatingLabel,
}: SelectTriggerProps) {
  const ctx = useSelectContext();
  const selectSize = selectSizeProp ?? ctx.selectSize;
  const config = selectSizeConfig[selectSize];
  const internalRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const buttonRef = (ref ?? internalRef) as React.RefObject<HTMLButtonElement>;

  const hasValue = !!ctx.value;
  const isFloated = isFocused || hasValue || ctx.open;

  const handleClick = () => {
    if (!ctx.disabled) {
      ctx.setOpen(!ctx.open);
      if (!ctx.open) {
        ctx.setHighlightedIndex(-1);
      }
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1): number => {
    const items = ctx.itemValues.current;
    const len = items.length;
    if (len === 0) return -1;

    let index = startIndex;
    for (let i = 0; i < len; i++) {
      index = (((index + direction) % len) + len) % len;
      if (!ctx.disabledItems.current.has(items[index])) {
        return index;
      }
    }
    return -1;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (ctx.disabled) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!ctx.open) {
          ctx.setOpen(true);
          ctx.setHighlightedIndex(findNextEnabledIndex(-1, 1));
        } else {
          ctx.setHighlightedIndex(findNextEnabledIndex(ctx.highlightedIndex, 1));
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!ctx.open) {
          ctx.setOpen(true);
          const items = ctx.itemValues.current;
          ctx.setHighlightedIndex(findNextEnabledIndex(items.length, -1));
        } else {
          ctx.setHighlightedIndex(findNextEnabledIndex(ctx.highlightedIndex, -1));
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (ctx.open && ctx.highlightedIndex >= 0) {
          const selectedValue = ctx.itemValues.current[ctx.highlightedIndex];
          if (selectedValue && !ctx.disabledItems.current.has(selectedValue)) {
            ctx.onValueChange(selectedValue);
          }
        } else if (!ctx.open) {
          ctx.setOpen(true);
          ctx.setHighlightedIndex(findNextEnabledIndex(-1, 1));
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        if (ctx.open) {
          ctx.setHighlightedIndex(findNextEnabledIndex(-1, 1));
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        if (ctx.open) {
          const items = ctx.itemValues.current;
          ctx.setHighlightedIndex(findNextEnabledIndex(items.length, -1));
        }
        break;
      }
    }
  };

  const displayLabel = ctx.value ? ctx.selectedLabel : '';

  const renderContent = () => {
    if (floatingLabel) {
      return (
        <>
          <span
            className={cn(
              'absolute left-1 origin-top-left pointer-events-none',
              'transition-all duration-200',
              'text-muted-foreground',
              isFloated ? config.floating.labelFloated : config.floating.labelDefault,
              isFocused && isFloated && 'text-[var(--input-border-focus)]'
            )}
            aria-hidden="true"
          >
            {floatingLabel}
          </span>
          {displayLabel ? (
            <Text
              as="span"
              typography={config.typography}
              color="foreground"
            >
              {displayLabel}
            </Text>
          ) : (
            <span />
          )}
        </>
      );
    }

    return displayLabel ? (
      <Text
        as="span"
        typography={config.typography}
        color="foreground"
      >
        {displayLabel}
      </Text>
    ) : (
      <Text
        as="span"
        typography={config.typography}
        color="muted"
      >
        {placeholder}
      </Text>
    );
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      role="combobox"
      id={ctx.triggerId}
      aria-expanded={ctx.open}
      aria-haspopup="listbox"
      aria-controls={ctx.contentId}
      disabled={ctx.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        selectTriggerVariants({ variant, selectSize }),
        'relative cursor-pointer',
        floatingLabel && config.floating.inputPadding,
        ctx.disabled && 'cursor-not-allowed',
        className
      )}
      data-test-id="select-trigger"
    >
      {renderContent()}
      <ChevronDownIcon
        size={config.iconSize}
        className={cn('ml-auto shrink-0 transition-transform', ctx.open && 'rotate-180')}
      />
    </button>
  );
}

/* ----------------------------- SelectContent ------------------------------ */

export function SelectContent({ children, className }: SelectContentProps) {
  const ctx = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isAnimatingRef = useRef(false);

  // Open → mount
  useEffect(() => {
    if (ctx.open && !mounted) {
      setMounted(true);
    }
  }, [ctx.open, mounted]);

  // GSAP enter animation
  useEffect(() => {
    if (ctx.open && mounted && contentRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      gsap.fromTo(
        contentRef.current,
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
    }
  }, [ctx.open, mounted]);

  // Close → exit animation → unmount
  useEffect(() => {
    if (!ctx.open && mounted) {
      if (!contentRef.current) {
        setMounted(false);
        return;
      }

      isAnimatingRef.current = true;
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -4,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          isAnimatingRef.current = false;
          setMounted(false);
        },
      });
    }
  }, [ctx.open, mounted]);

  // When not mounted, render children hidden for label registration
  if (!mounted) {
    return (
      <div
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      id={ctx.contentId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      className={cn(
        'absolute left-0 right-0 z-50 mt-1 overflow-hidden overflow-y-auto max-h-60 py-1',
        'border border-border bg-background shadow-soft-lg rounded-xl',
        className
      )}
      style={{ opacity: 0 }}
      data-test-id="select-content"
    >
      {children}
    </div>
  );
}

/* ------------------------------- SelectItem ------------------------------- */

export function SelectItem({ value, disabled = false, children, className }: SelectItemProps) {
  const ctx = useSelectContext();
  const itemRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(-1);
  const config = selectSizeConfig[ctx.selectSize];

  // Register item value
  useEffect(() => {
    const items = ctx.itemValues.current;
    if (!items.includes(value)) {
      indexRef.current = items.length;
      items.push(value);
      if (disabled) {
        ctx.disabledItems.current.add(value);
      }
    } else {
      indexRef.current = items.indexOf(value);
    }
  });

  // Sync selected label
  useEffect(() => {
    if (ctx.value === value && itemRef.current) {
      const textContent = itemRef.current.textContent ?? '';
      ctx.setSelectedLabel(textContent);
    }
  }, [ctx.value, value, ctx.setSelectedLabel]);

  const isSelected = ctx.value === value;
  const isHighlighted = ctx.highlightedIndex === indexRef.current;
  const isDisabled = ctx.disabled || disabled;

  const handleClick = () => {
    if (!isDisabled) {
      ctx.onValueChange(value);
    }
  };

  const handleMouseEnter = () => {
    if (!isDisabled) {
      ctx.setHighlightedIndex(indexRef.current);
    }
  };

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={itemRef}
      role="option"
      tabIndex={isDisabled ? -1 : 0}
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'flex items-center gap-2 px-3 cursor-pointer',
        config.itemHeight,
        isHighlighted && 'bg-muted',
        isSelected && !isHighlighted && 'bg-muted/50',
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
      data-test-id="select-item"
    >
      <span className="flex w-4 shrink-0 items-center justify-center">
        {isSelected && <CheckIcon size={config.iconSize} />}
      </span>
      <Text
        as="span"
        typography={config.typography}
        color="foreground"
      >
        {children}
      </Text>
    </div>
  );
}

/* ------------------------------ SelectLabel ------------------------------- */

export function SelectLabel({ children, className }: SelectLabelProps) {
  return (
    <div
      className={cn('px-3 py-1.5', className)}
      data-test-id="select-label"
    >
      <Text
        as="span"
        typography="text-xs-semibold"
        color="muted"
      >
        {children}
      </Text>
    </div>
  );
}

/* ---------------------------- SelectSeparator ----------------------------- */

export function SelectSeparator({ className }: SelectSeparatorProps) {
  return (
    <hr
      className={cn('my-1 border-t border-border', className)}
      data-test-id="select-separator"
    />
  );
}

/* --------------------------------- Icons ---------------------------------- */

function ChevronDownIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ size = 16 }: { size?: number }) {
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
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
