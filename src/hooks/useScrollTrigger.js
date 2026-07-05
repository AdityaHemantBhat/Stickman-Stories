import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Thin wrapper around GSAP ScrollTrigger for React lifecycle safety.
 * Handles proper cleanup on unmount to prevent memory leaks in SPA routing.
 * 
 * ANIMATION OWNERSHIP RULE:
 * GSAP + ScrollTrigger owns all scroll-driven, timeline-based, pinned, and scrubbed animations.
 * Framer Motion owns all discrete UI state animations (hover, tap, route transitions, modals).
 * Never fight the two libraries over the same DOM node's transform.
 *
 * @param {Function} setupFn - Receives (element, gsap, ScrollTrigger) and should return 
 *                              a GSAP timeline/tween, or an array of them, for cleanup.
 * @param {Array} deps - Dependency array for re-running the setup (like useEffect deps).
 */
export function useScrollTrigger(setupFn, deps = []) {
  const elementRef = useRef(null);
  const tweensRef = useRef([]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Small delay to ensure DOM is painted and measured
    const ctx = gsap.context(() => {
      const result = setupFn(element, gsap, ScrollTrigger);
      
      // Store returned tweens/timelines for cleanup
      if (result) {
        tweensRef.current = Array.isArray(result) ? result : [result];
      }
    }, element);

    return () => {
      // Kill all tweens/timelines created in this context
      tweensRef.current.forEach((tween) => {
        if (tween && tween.kill) tween.kill();
      });
      tweensRef.current = [];

      // Kill the GSAP context (cleans up all ScrollTriggers inside)
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return elementRef;
}

/**
 * Refresh all ScrollTriggers — call after dynamic content changes
 * (e.g., after images load, content expands, route changes).
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
