'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';

export interface ToastProviderProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  duration?: number;
  richColors?: boolean;
  closeButton?: boolean;
  className?: string;
}

export function ToastProvider({
  position = 'bottom-right',
  duration = 4000,
  richColors = true,
  closeButton = false,
  className,
}: ToastProviderProps) {
  return (
    <SonnerToaster
      position={position}
      duration={duration}
      richColors={richColors}
      closeButton={closeButton}
      containerAriaLabel="toast-container"
      className={className}
      toastOptions={{
        classNames: {
          toast: 'font-sans !rounded-xl',
          title: 'text-sm-semibold',
          description: 'text-xs-regular',
        },
      }}
      data-test-id="toast-provider"
    />
  );
}

// Re-export toast for convenience
export { toast };
