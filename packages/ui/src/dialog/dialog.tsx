'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@sunghoon-log/shared';
import gsap from 'gsap';
import { overlay } from 'overlay-kit';
import { createPortal } from 'react-dom';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Size Config
// ---------------------------------------------------------------------------

const sizeClassMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
} as const;

type DialogSize = keyof typeof sizeClassMap;

// ---------------------------------------------------------------------------
// DialogHeader
// ---------------------------------------------------------------------------

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-1.5', className)}
      data-test-id="dialog-header"
    >
      {children}
    </header>
  );
}

// ---------------------------------------------------------------------------
// DialogFooter
// ---------------------------------------------------------------------------

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <footer
      className={cn('flex flex-row items-center justify-end gap-2 pt-4', className)}
      data-test-id="dialog-footer"
    >
      {children}
    </footer>
  );
}

// ---------------------------------------------------------------------------
// DialogTitle
// ---------------------------------------------------------------------------

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <Text
      as="h2"
      typography="title-sm-semibold"
      color="foreground"
      className={className}
      data-test-id="dialog-title"
    >
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// DialogDescription
// ---------------------------------------------------------------------------

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <Text
      as="p"
      typography="text-sm-regular"
      color="muted"
      className={className}
      data-test-id="dialog-description"
    >
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// DialogClose
// ---------------------------------------------------------------------------

interface DialogCloseProps {
  onClose: () => void;
  className?: string;
}

export function DialogClose({ onClose, className }: DialogCloseProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        'absolute right-4 top-4 rounded-lg p-1.5',
        'text-muted-foreground transition-all duration-200',
        'hover:text-foreground hover:bg-gray-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className
      )}
      aria-label="Close dialog"
      data-test-id="dialog-close"
    >
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
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Dialog (main compound component)
// ---------------------------------------------------------------------------

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  size?: DialogSize;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, size = 'md', children, className }: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const stableOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Mount when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Enter animation after mount
  useEffect(() => {
    if (!isOpen || !mounted) return;
    if (!overlayRef.current || !contentRef.current) return;

    isAnimatingRef.current = true;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      }
    );
  }, [isOpen, mounted]);

  // Exit animation when isOpen becomes false while still mounted
  useEffect(() => {
    if (isOpen || !mounted) return;
    if (!overlayRef.current || !contentRef.current) return;

    isAnimatingRef.current = true;

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });

    gsap.to(contentRef.current, {
      opacity: 0,
      scale: 0.97,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        isAnimatingRef.current = false;
        setMounted(false);
      },
    });
  }, [isOpen, mounted]);

  // Lock body scroll while mounted
  useEffect(() => {
    if (!mounted) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  // Escape key handler
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stableOnClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mounted, stableOnClose]);

  // Auto-focus first focusable element
  useEffect(() => {
    if (!mounted || !isOpen) return;

    // Slight delay to ensure DOM is ready after animation starts
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const focusable = contentRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [mounted, isOpen]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-test-id="dialog-root"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handling is on document */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close is standard UX */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40"
        style={{ opacity: 0 }}
        onClick={stableOnClose}
        data-test-id="dialog-overlay"
      />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape key is handled via document keydown listener */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-50 w-full rounded-2xl bg-white p-6 shadow-soft-lg',
          'dark:bg-gray-900',
          sizeClassMap[size],
          className
        )}
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        data-test-id="dialog-content"
      >
        <DialogClose onClose={stableOnClose} />
        {children}
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// openDialog (imperative helper using overlay-kit)
// ---------------------------------------------------------------------------

interface OpenDialogOptions {
  title?: string;
  description?: string;
  size?: DialogSize;
  content: (close: () => void) => React.ReactNode;
}

export function openDialog(options: OpenDialogOptions) {
  return overlay.open(({ isOpen, close, unmount }) => (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        close();
        setTimeout(unmount, 500);
      }}
      size={options.size}
    >
      <DialogHeader>
        {options.title && <DialogTitle>{options.title}</DialogTitle>}
        {options.description && <DialogDescription>{options.description}</DialogDescription>}
      </DialogHeader>
      {options.content(close)}
    </Dialog>
  ));
}
