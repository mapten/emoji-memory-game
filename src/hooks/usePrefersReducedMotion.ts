import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const getMediaQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(QUERY) : null;

/** Whether the operating system asks for reduced motion. Updates live when the setting changes. */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => getMediaQuery()?.matches ?? false);

  useEffect(() => {
    const mediaQuery = getMediaQuery();
    if (!mediaQuery) return;

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
