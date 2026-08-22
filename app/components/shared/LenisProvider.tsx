'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global Lenis smooth-scroll driver — deferred to not block LCP.
 * Loads the Lenis library dynamically after the page has painted, ensuring
 * smooth scrolling doesn't compete with critical hero rendering.
 *
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
  const pathname = usePathname();
  // The demo dashboard is a fixed-viewport app scrolling its own panes —
  // window-level smooth scrolling has nothing to drive there and only adds
  // rubber-band feel to a shell that shouldn't move.
  const isDemo = pathname?.startsWith('/demo');

  useEffect(() => {
    if (isDemo) return;
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Defer Lenis loading until after initial paint to not block LCP
    const initLenis = async () => {
      // Dynamic import to code-split Lenis away from the main bundle
      const Lenis = (await import('lenis')).default;

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

      // Expose globally so other components (e.g. the Industries carousel)
      // can drive page scroll explicitly when handing off wheel events.
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis;

      let rafId = 0;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        delete (window as unknown as { __lenis?: typeof lenis }).__lenis;
      };
    };

    // Wait for LCP or 3s, whichever comes first
    let cleanup: (() => void) | undefined;
    let mounted = true;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      // Wait a bit after LCP to ensure it's stable
      if (mounted) {
        setTimeout(() => {
          if (mounted) {
            initLenis().then(fn => { if (mounted) cleanup = fn; });
          }
        }, 100);
      }
      observer.disconnect();
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Fallback: if LCP observer not supported, just delay by 1s
      setTimeout(() => {
        if (mounted) {
          initLenis().then(fn => { if (mounted) cleanup = fn; });
        }
      }, 1000);
    }

    // Timeout fallback in case LCP takes too long
    const timeout = setTimeout(() => {
      if (mounted && !cleanup) {
        initLenis().then(fn => { if (mounted) cleanup = fn; });
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      observer.disconnect();
      cleanup?.();
    };
  }, [isDemo]);

  return null;
}
