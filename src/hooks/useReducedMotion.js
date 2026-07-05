import { useState, useEffect } from 'react';

/**
 * Reactive hook for prefers-reduced-motion media query.
 * Returns true when the user prefers reduced motion.
 * Used to gate GSAP/WebGL heavy animations globally.
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event) => setPrefersReducedMotion(event.matches);

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
