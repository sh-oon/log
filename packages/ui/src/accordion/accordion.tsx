'use client';

import { createContext, use, useCallback, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@sunghoon-log/shared';
import gsap from 'gsap';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Accordion Context
// ---------------------------------------------------------------------------

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = use(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion sub-components must be used within an Accordion root');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// AccordionItem Context
// ---------------------------------------------------------------------------

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const ctx = use(AccordionItemContext);
  if (!ctx) {
    throw new Error('AccordionTrigger/AccordionContent must be used within an AccordionItem');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  const toggle = useCallback(
    (value: string) => {
      setOpenItems((prev) => {
        if (prev.includes(value)) {
          return prev.filter((v) => v !== value);
        }
        if (type === 'single') {
          return [value];
        }
        return [...prev, value];
      });
    },
    [type]
  );

  return (
    <div
      className={cn('flex flex-col', className)}
      data-test-id="accordion"
    >
      <AccordionContext value={{ openItems, toggle, type }}>{children}</AccordionContext>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  children,
  className,
  disabled = false,
}: AccordionItemProps) {
  const accordionCtx = useAccordionContext();
  const baseId = useId();
  const isOpen = accordionCtx.openItems.includes(value);
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  return (
    <div
      className={cn('border-b border-border', className)}
      data-test-id="accordion-item"
    >
      <AccordionItemContext value={{ value, isOpen, disabled, triggerId, contentId }}>
        {children}
      </AccordionItemContext>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AccordionTrigger
// ---------------------------------------------------------------------------

export interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const accordionCtx = useAccordionContext();
  const itemCtx = useAccordionItemContext();

  const handleClick = () => {
    if (!itemCtx.disabled) {
      accordionCtx.toggle(itemCtx.value);
    }
  };

  return (
    <h3>
      <button
        type="button"
        id={itemCtx.triggerId}
        aria-expanded={itemCtx.isOpen}
        aria-controls={itemCtx.contentId}
        disabled={itemCtx.disabled}
        onClick={handleClick}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between',
          '-mx-3 rounded-xl px-3 py-4',
          'transition-all duration-200',
          'hover:bg-muted/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          itemCtx.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        data-test-id="accordion-trigger"
      >
        <Text
          as="span"
          typography="text-sm-medium"
          color="foreground"
        >
          {children}
        </Text>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          width={16}
          height={16}
          className={cn(
            'shrink-0 text-muted-foreground transition-transform duration-200',
            itemCtx.isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  );
}

// ---------------------------------------------------------------------------
// AccordionContent
// ---------------------------------------------------------------------------

export interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const itemCtx = useAccordionItemContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(itemCtx.isOpen);
  const isAnimatingRef = useRef(false);

  // Handle open
  useEffect(() => {
    if (itemCtx.isOpen) {
      setMounted(true);
    }
  }, [itemCtx.isOpen]);

  // Enter animation
  useEffect(() => {
    if (!itemCtx.isOpen || !mounted) return;
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    isAnimatingRef.current = true;

    const naturalHeight = wrapper.scrollHeight;
    gsap.fromTo(
      wrapper,
      { height: 0, opacity: 0 },
      {
        height: naturalHeight,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          wrapper.style.height = 'auto';
          isAnimatingRef.current = false;
        },
      }
    );
  }, [itemCtx.isOpen, mounted]);

  // Exit animation
  useEffect(() => {
    if (itemCtx.isOpen || !mounted) return;
    if (!wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    isAnimatingRef.current = true;

    const currentHeight = wrapper.scrollHeight;
    gsap.fromTo(
      wrapper,
      { height: currentHeight, opacity: 1 },
      {
        height: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          isAnimatingRef.current = false;
          setMounted(false);
        },
      }
    );
  }, [itemCtx.isOpen, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <section
      ref={wrapperRef}
      id={itemCtx.contentId}
      aria-labelledby={itemCtx.triggerId}
      style={{ overflow: 'hidden', height: 0, opacity: 0 }}
      data-test-id="accordion-content"
    >
      <div className={cn('-mx-3 px-3 pb-4 pt-1', className)}>{children}</div>
    </section>
  );
}
