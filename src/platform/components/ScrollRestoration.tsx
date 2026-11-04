'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Restores scroll position per route using sessionStorage.
 * Works across client-side transitions and browser refreshes.
 * Keyed by pathname so each long page (course detail, library, etc.)
 * remembers its own independent scroll depth.
 */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Skip course detail pages — they handle their own scroll restoration
    // after async content loads.
    if (pathname.startsWith('/app/courses/') && pathname.split('/').length > 3) {
      return;
    }

    // Restore saved scroll position for this specific path.
    const saved = sessionStorage.getItem(`scrollPos:${pathname}`);
    if (saved) {
      const y = parseInt(saved, 10);
      if (!Number.isNaN(y) && y > 0) {
        window.scrollTo({ top: y, behavior: 'auto' });
      }
    }

    // Save scroll position as the user scrolls (throttled via rAF).
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(`scrollPos:${pathname}`, String(window.scrollY));
        } catch {
          // sessionStorage unavailable (private mode, etc.) — ignore.
        }
      });
    };

    const onPageHide = () => {
      try {
        sessionStorage.setItem(`scrollPos:${pathname}`, String(window.scrollY));
      } catch {
        // ignore
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      cancelAnimationFrame(raf);
      // Final save on unmount.
      try {
        sessionStorage.setItem(`scrollPos:${pathname}`, String(window.scrollY));
      } catch {
        // ignore
      }
    };
  }, [pathname]);

  return null;
}
