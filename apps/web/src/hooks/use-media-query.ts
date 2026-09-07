'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query and re-renders when it starts or stops matching.
 * Returns `false` during SSR so the server output stays deterministic.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};
