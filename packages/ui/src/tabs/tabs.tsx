'use client';

import { createContext, use, useCallback, useId, useRef, useState } from 'react';
import { cn } from '@orka-log/shared';
import { Text } from '../text';

/* ---------------------------------- Types --------------------------------- */

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

/* --------------------------------- Context -------------------------------- */

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  registerTab: (value: string) => void;
  tabValues: React.RefObject<string[]>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = use(TabsContext);
  if (!ctx) {
    throw new Error('Tabs sub-components must be used within a Tabs root');
  }
  return ctx;
}

/* ---------------------------------- Tabs ---------------------------------- */

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const baseId = useId();
  const tabValues = useRef<string[]>([]);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
    },
    [isControlled, onValueChange]
  );

  return (
    <div
      className={cn('flex flex-col', className)}
      data-test-id="tabs"
    >
      <TabsContext
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          baseId,
          registerTab: (val: string) => {
            if (!tabValues.current.includes(val)) {
              tabValues.current.push(val);
            }
          },
          tabValues,
        }}
      >
        {children}
      </TabsContext>
    </div>
  );
}

/* --------------------------------- TabList -------------------------------- */

export function TabList({ children, className }: TabListProps) {
  const ctx = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = ctx.tabValues.current;
    const currentIndex = tabs.indexOf(ctx.value);

    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      }
      case 'Home': {
        e.preventDefault();
        nextIndex = 0;
        break;
      }
      case 'End': {
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      }
    }

    if (nextIndex !== null) {
      const nextValue = tabs[nextIndex];
      if (nextValue !== undefined) {
        // Find and focus the target tab button
        const targetId = `${ctx.baseId}-tab-${nextValue}`;
        const targetEl = listRef.current?.querySelector(`#${CSS.escape(targetId)}`);
        if (targetEl instanceof HTMLElement && !targetEl.hasAttribute('disabled')) {
          ctx.onValueChange(nextValue);
          targetEl.focus();
        }
      }
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn('flex gap-1 rounded-xl bg-muted p-1', className)}
      onKeyDown={handleKeyDown}
      data-test-id="tab-list"
    >
      {children}
    </div>
  );
}

/* ------------------------------- TabTrigger ------------------------------- */

export function TabTrigger({ value, children, disabled = false, className }: TabTriggerProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;

  // Register this tab value on mount
  ctx.registerTab(value);

  const handleClick = () => {
    if (!disabled) {
      ctx.onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'flex-1 cursor-pointer px-3 py-1.5 transition-all duration-200',
        'rounded-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        isActive
          ? 'bg-background text-foreground shadow-soft-sm'
          : 'text-muted-foreground hover:text-foreground',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      data-test-id="tab-trigger"
    >
      <Text
        as="span"
        typography="label-sm-medium"
        color="inherit"
      >
        {children}
      </Text>
    </button>
  );
}

/* ------------------------------- TabContent ------------------------------- */

export function TabContent({ value, children, className }: TabContentProps) {
  const ctx = useTabsContext();
  const isActive = ctx.value === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      className={cn('mt-2', className)}
      data-test-id="tab-content"
    >
      {children}
    </div>
  );
}
