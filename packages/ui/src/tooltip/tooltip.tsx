'use client';

import {
  cloneElement,
  isValidElement,
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

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TriggerProps {
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}

export interface TooltipProps {
  content: React.ReactNode;
  side?: TooltipSide;
  delay?: number;
  children: React.ReactElement;
  className?: string;
}

// ---------------------------------------------------------------------------
// Arrow styles per side (CSS border triangle)
// ---------------------------------------------------------------------------

const arrowStyles: Record<TooltipSide, React.CSSProperties> = {
  top: {
    left: '50%',
    top: '100%',
    transform: 'translateX(-50%)',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid var(--color-foreground)',
  },
  bottom: {
    left: '50%',
    bottom: '100%',
    transform: 'translateX(-50%)',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid var(--color-foreground)',
  },
  left: {
    top: '50%',
    left: '100%',
    transform: 'translateY(-50%)',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderLeft: '5px solid var(--color-foreground)',
  },
  right: {
    top: '50%',
    right: '100%',
    transform: 'translateY(-50%)',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderRight: '5px solid var(--color-foreground)',
  },
};

// ---------------------------------------------------------------------------
// Direction-aware slide offset for enter/exit animation
// ---------------------------------------------------------------------------

const slideFrom: Record<TooltipSide, { x: number; y: number }> = {
  top: { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left: { x: 4, y: 0 },
  right: { x: -4, y: 0 },
};

// ---------------------------------------------------------------------------
// Offset from trigger (px)
// ---------------------------------------------------------------------------

const OFFSET = 8;

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export function Tooltip({ content, side = 'top', delay = 300, children, className }: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = rect.top - tooltipRect.height - OFFSET;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + OFFSET;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - OFFSET;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + OFFSET;
        break;
    }

    setPosition({ top, left });
  }, [side]);

  // Enter animation
  const animateIn = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) return;
    animRef.current?.kill();
    const { x, y } = slideFrom[side];
    animRef.current = gsap.fromTo(
      el,
      { opacity: 0, x, y, scale: 0.96 },
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.15, ease: 'power2.out' }
    );
  }, [side]);

  // Exit animation → unmount
  const animateOut = useCallback(() => {
    const el = tooltipRef.current;
    if (!el) {
      setMounted(false);
      return;
    }
    animRef.current?.kill();
    const { x, y } = slideFrom[side];
    animRef.current = gsap.to(el, {
      opacity: 0,
      x,
      y,
      scale: 0.96,
      duration: 0.1,
      ease: 'power2.in',
      onComplete: () => setMounted(false),
    });
  }, [side]);

  const show = useCallback(() => {
    delayTimerRef.current = setTimeout(() => {
      setVisible(true);
      setMounted(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    setVisible(false);
  }, []);

  // When visible turns off, play exit animation
  useEffect(() => {
    if (!visible && mounted) {
      animateOut();
    }
  }, [visible, mounted, animateOut]);

  // Recalculate position + play enter animation after tooltip mounts
  useEffect(() => {
    if (!mounted) return;

    const frameId = requestAnimationFrame(() => {
      updatePosition();
      animateIn();
    });
    return () => cancelAnimationFrame(frameId);
  }, [mounted, updatePosition, animateIn]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      animRef.current?.kill();
    };
  }, []);

  // Clone child to attach ref and event handlers
  if (!isValidElement<TriggerProps>(children)) {
    return children as React.ReactNode;
  }

  const childProps = children.props as TriggerProps;

  const trigger = cloneElement(children, {
    ref: triggerRef,
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      childProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      childProps.onBlur?.(e);
    },
  } as Record<string, unknown>);

  const tooltipContent =
    typeof content === 'string' ? (
      <Text
        as="span"
        typography="text-xs-medium"
        color="inherit"
      >
        {content}
      </Text>
    ) : (
      content
    );

  return (
    <>
      {trigger}
      {mounted &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cn(
              'pointer-events-none fixed z-50',
              'bg-foreground text-background rounded-lg px-3 py-1.5 shadow-soft-md',
              className
            )}
            style={{ top: position.top, left: position.left, opacity: 0 }}
            data-test-id="tooltip"
          >
            {tooltipContent}
            <span
              className="absolute"
              style={{
                ...arrowStyles[side],
                width: 0,
                height: 0,
              }}
              aria-hidden="true"
            />
          </div>,
          document.body
        )}
    </>
  );
}
