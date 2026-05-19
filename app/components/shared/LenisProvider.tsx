'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Global Lenis smooth-scroll driver.
 * Mounts once at the root, drives the entire page's wheel + touch scrolling
 * through requestAnimationFrame for buttery-smooth inertia.
 *
 * Disables itself when the user prefers reduced motion.
 */
export default function LenisProvider() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      // Lenis handles touch passively — native momentum still feels best on iOS
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
