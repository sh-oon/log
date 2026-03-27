'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@orka-log/shared';
import gsap from 'gsap';
import { overlay } from 'overlay-kit';
import { createPortal } from 'react-dom';
import { Text } from '../text';

// ---------------------------------------------------------------------------
// Snap Point Config
// ---------------------------------------------------------------------------

const snapPointClassMap = {
  compact: 'max-h-[40vh]',
  half: 'max-h-[60vh]',
  full: 'max-h-[90vh]',
} as const;

type SnapPoint = keyof typeof snapPointClassMap;

// ---------------------------------------------------------------------------
// BottomSheetHandle
// ---------------------------------------------------------------------------

interface BottomSheetHandleProps {
  className?: string;
}

export function BottomSheetHandle({ className }: BottomSheetHandleProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex justify-center rounded-t-2xl bg-background pb-2 pt-3',
        className
      )}
      data-draggable
      data-test-id="bottom-sheet-handle"
    >
      <div className="h-1 w-10 rounded-full bg-border" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetHeader
// ---------------------------------------------------------------------------

interface BottomSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetHeader({ children, className }: BottomSheetHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-1.5', className)}
      data-draggable
      data-test-id="bottom-sheet-header"
    >
      {children}
    </header>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetTitle
// ---------------------------------------------------------------------------

interface BottomSheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetTitle({ children, className }: BottomSheetTitleProps) {
  return (
    <Text
      as="h2"
      typography="title-sm-semibold"
      color="foreground"
      className={className}
      data-test-id="bottom-sheet-title"
    >
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetDescription
// ---------------------------------------------------------------------------

interface BottomSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetDescription({ children, className }: BottomSheetDescriptionProps) {
  return (
    <Text
      as="p"
      typography="text-sm-regular"
      color="muted"
      className={className}
      data-test-id="bottom-sheet-description"
    >
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetFooter
// ---------------------------------------------------------------------------

interface BottomSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetFooter({ children, className }: BottomSheetFooterProps) {
  return (
    <footer
      className={cn('flex flex-row items-center justify-end gap-2 pt-4', className)}
      data-test-id="bottom-sheet-footer"
    >
      {children}
    </footer>
  );
}

// ---------------------------------------------------------------------------
// BottomSheetClose
// ---------------------------------------------------------------------------

interface BottomSheetCloseProps {
  onClose: () => void;
  className?: string;
}

export function BottomSheetClose({ onClose, className }: BottomSheetCloseProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        'absolute right-4 top-4 z-10 rounded-xl p-1.5',
        'text-muted-foreground transition-all duration-200',
        'hover:text-foreground hover:bg-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        className
      )}
      aria-label="Close bottom sheet"
      data-test-id="bottom-sheet-close"
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
// BottomSheet (main compound component)
// ---------------------------------------------------------------------------

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoint?: SnapPoint;
  children: React.ReactNode;
  className?: string;
  enableDrag?: boolean;
  dismissThreshold?: number;
}

export function BottomSheet({
  isOpen,
  onClose,
  snapPoint = 'half',
  children,
  className,
  enableDrag = true,
  dismissThreshold = 100,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Drag state refs (avoid re-renders during gesture)
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const currentDeltaRef = useRef(0);

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
      { y: '100%' },
      {
        y: 0,
        duration: 0.4,
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
      y: '100%',
      duration: 0.3,
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

  // Drag-to-dismiss gesture (Pointer Events API)
  useEffect(() => {
    if (!mounted || !enableDrag) return;

    const content = contentRef.current;
    const overlayEl = overlayRef.current;
    if (!content || !overlayEl) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (isAnimatingRef.current) return;

      // Only start drag from elements with data-draggable
      const target = e.target as HTMLElement;
      if (!target.closest('[data-draggable]')) return;

      isDraggingRef.current = true;
      dragStartYRef.current = e.clientY;
      currentDeltaRef.current = 0;
      content.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaY = e.clientY - dragStartYRef.current;

      // Only allow downward drag
      if (deltaY <= 0) {
        gsap.set(content, { y: 0 });
        currentDeltaRef.current = 0;
        return;
      }

      currentDeltaRef.current = deltaY;
      gsap.set(content, { y: deltaY });

      // Reduce overlay opacity proportionally
      const progress = Math.min(deltaY / 300, 1);
      gsap.set(overlayEl, { opacity: 1 - progress * 0.6 });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      content.releasePointerCapture(e.pointerId);

      const deltaY = currentDeltaRef.current;

      if (deltaY > dismissThreshold) {
        // Dismiss: animate out then close
        isAnimatingRef.current = true;

        gsap.to(overlayEl, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        });

        gsap.to(content, {
          y: '100%',
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            isAnimatingRef.current = false;
            setMounted(false);
            stableOnClose();
          },
        });
      } else {
        // Snap back
        gsap.to(content, {
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
        });

        gsap.to(overlayEl, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    content.addEventListener('pointerdown', handlePointerDown);
    content.addEventListener('pointermove', handlePointerMove);
    content.addEventListener('pointerup', handlePointerUp);

    return () => {
      content.removeEventListener('pointerdown', handlePointerDown);
      content.removeEventListener('pointermove', handlePointerMove);
      content.removeEventListener('pointerup', handlePointerUp);
    };
  }, [mounted, enableDrag, dismissThreshold, stableOnClose]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      data-test-id="bottom-sheet-root"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handling is on document */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close is standard UX */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40"
        style={{ opacity: 0 }}
        onClick={stableOnClose}
        data-test-id="bottom-sheet-overlay"
      />
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape key is handled via document keydown listener */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-50 w-full rounded-t-2xl bg-background shadow-soft-lg',
          snapPointClassMap[snapPoint],
          'flex flex-col',
          className
        )}
        style={{ transform: 'translateY(100%)' }}
        onClick={(e) => e.stopPropagation()}
        data-test-id="bottom-sheet-content"
      >
        <BottomSheetHandle />
        <div className="overflow-y-auto px-6 pb-6">
          <BottomSheetClose onClose={stableOnClose} />
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// openBottomSheet (imperative helper using overlay-kit)
// ---------------------------------------------------------------------------

interface OpenBottomSheetOptions {
  title?: string;
  description?: string;
  snapPoint?: SnapPoint;
  enableDrag?: boolean;
  content: (close: () => void) => React.ReactNode;
}

export function openBottomSheet(options: OpenBottomSheetOptions) {
  return overlay.open(({ isOpen, close, unmount }) => (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        close();
        setTimeout(unmount, 500);
      }}
      snapPoint={options.snapPoint}
      enableDrag={options.enableDrag}
    >
      <BottomSheetHeader>
        {options.title && <BottomSheetTitle>{options.title}</BottomSheetTitle>}
        {options.description && (
          <BottomSheetDescription>{options.description}</BottomSheetDescription>
        )}
      </BottomSheetHeader>
      {options.content(close)}
    </BottomSheet>
  ));
}
