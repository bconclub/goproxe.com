'use client';

import { useEffect, useState } from 'react';

/**
 * ProxeBootLoader — covers the page during initial paint with the PROXe
 * brand icon pulsing on a solid brand-purple background. Hides after a
 * short delay so the Grainient shader, Vimeo iframe, and VapiOrb have a
 * moment to settle (avoids the multi-colour-flash effect during boot).
 *
 * Pure visual preloader — does not block JS or rendering, just sits on
 * top until dismissed.
 */
export default function ProxeBootLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Two-stage wait: one frame for the layout to settle, then ~1.1s
    // for the WebGL gradient + iframe to start producing stable pixels.
    const start = requestAnimationFrame(() => {
      const t = setTimeout(() => setHidden(true), 1100);
      // Stash the timeout id on the rAF callback closure for cleanup.
      cleanup.current = () => clearTimeout(t);
    });
    return () => {
      cancelAnimationFrame(start);
      cleanup.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mutable ref-via-closure for the cleanup fn captured inside rAF.
  const cleanup = (typeof globalThis !== 'undefined' && (globalThis as any).__proxeBootCleanup) || { current: null as null | (() => void) };
  if (typeof globalThis !== 'undefined') (globalThis as any).__proxeBootCleanup = cleanup;

  return (
    <div className="proxe-boot" data-hidden={hidden} aria-hidden={hidden}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/proxe/brand/proxe-icon-white.webp"
        alt=""
        aria-hidden="true"
        className="proxe-boot-icon"
        draggable={false}
      />
    </div>
  );
}
