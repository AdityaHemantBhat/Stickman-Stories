import { useState, useEffect, useRef } from 'react';

/**
 * Performance tier detection hook.
 * Returns 'high' | 'medium' | 'low' based on device capabilities.
 * Used to gate WebGL complexity, particle counts, and animation fidelity.
 *
 * Factors:
 * - navigator.hardwareConcurrency (CPU cores)
 * - navigator.deviceMemory (available RAM)
 * - pointer type (coarse = mobile/tablet)
 * - Runtime FPS monitoring (downgrades tier if sustained FPS < 40)
 */
export function usePerformanceTier() {
  const [tier, setTier] = useState(() => detectStaticTier());
  const fpsHistoryRef = useRef([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef(null);

  useEffect(() => {
    // Runtime FPS monitoring — check every 60 frames (~1 second)
    const checkInterval = 60;
    let degraded = false;
    let lowFpsStreak = 0;

    const measureFPS = (now) => {
      frameCountRef.current++;

      if (frameCountRef.current >= checkInterval) {
        const elapsed = now - lastTimeRef.current;
        const fps = (frameCountRef.current / elapsed) * 1000;
        
        fpsHistoryRef.current.push(fps);
        if (fpsHistoryRef.current.length > 5) {
          fpsHistoryRef.current.shift();
        }

        // Check for sustained low FPS (< 40 for 2+ seconds = ~2 check cycles)
        if (fps < 40) {
          lowFpsStreak++;
        } else {
          lowFpsStreak = Math.max(0, lowFpsStreak - 1);
        }

        if (lowFpsStreak >= 2 && !degraded) {
          degraded = true;
          setTier((current) => {
            if (current === 'high') return 'medium';
            if (current === 'medium') return 'low';
            return current;
          });
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(measureFPS);
    };

    rafRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return tier;
}

/**
 * Static tier detection based on device capabilities.
 * Called once on mount — runtime FPS monitoring can downgrade further.
 */
function detectStaticTier() {
  if (typeof window === 'undefined') return 'medium';

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // Defaults to 4 if unavailable
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const dpr = window.devicePixelRatio || 1;

  // Mobile with low specs → low
  if (isCoarsePointer && (cores <= 4 || memory <= 4)) {
    return 'low';
  }

  // Mobile with decent specs → medium
  if (isCoarsePointer) {
    return 'medium';
  }

  // Desktop with high specs → high
  if (cores >= 8 && memory >= 8 && dpr <= 2) {
    return 'high';
  }

  // Desktop with moderate specs → medium
  if (cores >= 4) {
    return 'medium';
  }

  return 'low';
}

/**
 * Get recommended particle count for the current tier.
 */
export function getParticleCount(tier) {
  switch (tier) {
    case 'high': return 2000;
    case 'medium': return 800;
    case 'low': return 200;
    default: return 800;
  }
}

/**
 * Get max device pixel ratio for the current tier.
 */
export function getMaxDPR(tier) {
  switch (tier) {
    case 'high': return 2;
    case 'medium': return 1.5;
    case 'low': return 1;
    default: return 1.5;
  }
}
