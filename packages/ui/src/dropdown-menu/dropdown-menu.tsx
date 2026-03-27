'use client';

import {
  cloneElement,
  createContext,
  isValidElement,
  use,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@orka-log/shared';
import gsap from 'gsap';
import { createPortal } from 'react-dom';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
}

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: () => void;
  destructive?: boolean;
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  menuId: string;
  triggerId: string;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemCount: React.RefObject<number>;
  itemCallbacks: React.RefObject<Array<{ onSelect?: () => void; disabled?: boolean }>>;
  close: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = use(DropdownMenuContext);
  if (!ctx) {
    throw new Error('DropdownMenu sub-components must be used within a DropdownMenu root');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// DropdownMenu (root)
// ---------------------------------------------------------------------------

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemCount = useRef(0);
  const itemCallbacks = useRef<Array<{ onSelect?: () => void; disabled?: boolean }>>([]);
  const menuId = useId();
  const triggerId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  return (
    <div
      className={cn('relative inline-block', className)}
      data-test-id="dropdown-menu"
    >
      <DropdownMenuContext
        value={{
          open,
          setOpen,
          triggerRef,
          menuId,
          triggerId,
          highlightedIndex,
          setHighlightedIndex,
          itemCount,
          itemCallbacks,
          close,
        }}
      >
        {children}
      </DropdownMenuContext>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuTrigger
// ---------------------------------------------------------------------------

export function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen, close, triggerRef, triggerId, menuId, setHighlightedIndex } =
    useDropdownMenuContext();

  const handleClick = () => {
    if (open) {
      close();
    } else {
      setOpen(true);
      setHighlightedIndex(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(0);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          // -2 sentinel: resolve to last item after items register
          setHighlightedIndex(-2);
        }
        break;
      }
      case 'Escape': {
        if (open) {
          e.preventDefault();
          close();
          triggerRef.current?.focus();
        }
        break;
      }
    }
  };

  const triggerProps = {
    ref: triggerRef,
    id: triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'data-test-id': 'dropdown-menu-trigger',
  };

  // If children is a React element, merge trigger props onto it (avoids nested <button>)
  if (isValidElement<Record<string, unknown>>(children)) {
    return cloneElement(children, {
      ...triggerProps,
      className: cn(children.props.className as string | undefined, className),
    });
  }

  // Fallback: wrap in a button for plain text/number children
  return (
    <button
      {...triggerProps}
      ref={triggerRef as React.RefObject<HTMLButtonElement | null>}
      type="button"
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuContent
// ---------------------------------------------------------------------------

const OFFSET = 4;

export function DropdownMenuContent({
  children,
  className,
  align = 'start',
  side = 'bottom',
}: DropdownMenuContentProps) {
  const {
    open,
    close,
    triggerRef,
    menuId,
    triggerId,
    highlightedIndex,
    setHighlightedIndex,
    itemCount,
    itemCallbacks,
  } = useDropdownMenuContext();

  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const highlightedIndexRef = useRef(highlightedIndex);
  highlightedIndexRef.current = highlightedIndex;

  // Reset item registries each render cycle so children get fresh indices
  itemCount.current = 0;
  itemCallbacks.current = [];

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    let top: number;
    let left: number;

    if (side === 'bottom') {
      top = triggerRect.bottom + OFFSET;
    } else {
      top = triggerRect.top - contentRect.height - OFFSET;
    }

    switch (align) {
      case 'start':
        left = triggerRect.left;
        break;
      case 'center':
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case 'end':
        left = triggerRect.right - contentRect.width;
        break;
    }

    setPosition({ top, left });
  }, [align, side, triggerRef]);

  // Open → mount
  useEffect(() => {
    if (open && !mounted) {
      setMounted(true);
    }
  }, [open, mounted]);

  // Enter animation + position
  useEffect(() => {
    if (!open || !mounted || !contentRef.current) return;

    const el = contentRef.current;
    // Kill any in-flight exit animation
    animRef.current?.kill();

    const frameId = requestAnimationFrame(() => {
      updatePosition();

      // Resolve -2 sentinel to last item
      if (highlightedIndexRef.current === -2) {
        setHighlightedIndex(Math.max(0, itemCount.current - 1));
      }

      animRef.current = gsap.fromTo(
        el,
        { opacity: 0, y: -4, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.15,
          ease: 'power2.out',
        }
      );
    });
    return () => cancelAnimationFrame(frameId);
  }, [open, mounted, updatePosition, setHighlightedIndex, itemCount]);

  // Exit animation → unmount
  useEffect(() => {
    if (!open && mounted) {
      const el = contentRef.current;
      if (!el) {
        setMounted(false);
        return;
      }
      animRef.current?.kill();
      animRef.current = gsap.to(el, {
        opacity: 0,
        y: -4,
        scale: 0.96,
        duration: 0.1,
        ease: 'power2.in',
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted]);

  // Click outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted, close, triggerRef]);

  // Escape
  useEffect(() => {
    if (!mounted) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mounted, close, triggerRef]);

  // Keyboard navigation
  useEffect(() => {
    if (!mounted) return;

    const findNextEnabled = (startIndex: number, direction: 1 | -1): number => {
      const count = itemCount.current;
      if (count === 0) return -1;
      for (let i = 1; i <= count; i++) {
        const idx = (((startIndex + direction * i) % count) + count) % count;
        if (!itemCallbacks.current[idx]?.disabled) return idx;
      }
      return -1;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = highlightedIndexRef.current;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = findNextEnabled(currentIndex, 1);
          if (next >= 0) setHighlightedIndex(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = findNextEnabled(currentIndex, -1);
          if (prev >= 0) setHighlightedIndex(prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          const first = findNextEnabled(-1, 1);
          if (first >= 0) setHighlightedIndex(first);
          break;
        }
        case 'End': {
          e.preventDefault();
          const last = findNextEnabled(itemCount.current, -1);
          if (last >= 0) setHighlightedIndex(last);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (currentIndex >= 0) {
            const item = itemCallbacks.current[currentIndex];
            if (item && !item.disabled) {
              item.onSelect?.();
              close();
              triggerRef.current?.focus();
            }
          }
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, close, setHighlightedIndex, triggerRef, itemCount, itemCallbacks]);

  // Cleanup
  useEffect(() => {
    return () => {
      animRef.current?.kill();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={contentRef}
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      tabIndex={-1}
      className={cn(
        'fixed z-50 py-1 min-w-[140px]',
        'bg-background border border-border rounded-xl shadow-soft-lg',
        className
      )}
      style={{ top: position.top, left: position.left, opacity: 0 }}
      data-test-id="dropdown-menu-content"
    >
      {children}
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuItem
// ---------------------------------------------------------------------------

export function DropdownMenuItem({
  children,
  className,
  disabled = false,
  onSelect,
  destructive = false,
}: DropdownMenuItemProps) {
  const { highlightedIndex, setHighlightedIndex, close, triggerRef, itemCount, itemCallbacks } =
    useDropdownMenuContext();
  const indexRef = useRef(-1);
  const itemRef = useRef<HTMLDivElement>(null);

  // Register during render phase — stable per render cycle
  const index = itemCount.current;
  indexRef.current = index;
  itemCount.current = index + 1;
  itemCallbacks.current[index] = { onSelect, disabled };

  const isHighlighted = highlightedIndex === indexRef.current;

  const handleClick = () => {
    if (!disabled) {
      onSelect?.();
      close();
      triggerRef.current?.focus();
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setHighlightedIndex(indexRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHighlightedIndex(-1);
    }
  };

  // Scroll into view when highlighted
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isHighlighted]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard navigation handled via document keydown listener
    <div
      ref={itemRef}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'px-2.5 h-8 flex items-center cursor-pointer transition-all duration-200',
        isHighlighted && 'bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
        destructive && 'text-destructive-500',
        className
      )}
      data-test-id="dropdown-menu-item"
    >
      <Text
        as="span"
        typography="text-sm-regular"
        color={destructive ? 'destructive' : 'foreground'}
      >
        {children}
      </Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuSeparator
// ---------------------------------------------------------------------------

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return (
    <hr
      className={cn('my-1 border-t border-border', className)}
      data-test-id="dropdown-menu-separator"
    />
  );
}

// ---------------------------------------------------------------------------
// DropdownMenuLabel
// ---------------------------------------------------------------------------

export function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <div
      className={cn('px-2.5 py-1.5', className)}
      data-test-id="dropdown-menu-label"
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
