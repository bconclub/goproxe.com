'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Global Lenis smooth-scroll driver.
 * Mounts once at the root, drives the entire page's wheel + touch scrolling
 * through requestAnimationFrame for buttery-smooth inertia.
 *
 * Uses the `lerp` model (linear interpolation per frame) rather than a fixed
 * duration + easing. This is what makes scroll feel like butter — every frame
 * smoothly approaches the target, regardless of how fast you flick the wheel.
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
      // Lerp = how quickly the scroll catches up to the wheel target every
      // frame. 0.1 ≈ 60fps "rubber band" — silky but still responsive.
      // Lower = more inertia, higher = snappier.
      lerp: 0.1,
      smoothWheel: true,
      // Native iOS momentum on touch still feels best — Lenis just gets out
      // of the way and lets the browser handle it.
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
