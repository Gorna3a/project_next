'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";

// The logo pool — five pixel robot faces. A new face is drawn from the pool
// on every page load (and on every login), so the brand mark keeps changing.
// Sprites live under /public/logo as STABLE URLs: hashed /_next/static URLs
// got evicted when clients hit a newer deployment (see CHANGELOG), so the
// pool never uses content-hashed asset URLs.
export const LOGO_POOL: StaticImageData[] = [
  { src: '/logo/logo1.png', width: 16, height: 11 },
  { src: '/logo/logo2.png', width: 16, height: 11 },
  { src: '/logo/logo3.png', width: 16, height: 11 },
  { src: '/logo/logo4.png', width: 16, height: 11 },
  { src: '/logo/logo5.png', width: 16, height: 11 },
] as StaticImageData[];

// Fired by AuthContext (pulseLogoPool) on every successful sign-in.
export const LOGIN_POOL_EVENT = "pixelcode:login";

const STORAGE_KEY = "pixelcode-logo-index";

interface LogoContextValue {
  index: number;
  image: StaticImageData;
}

const LogoContext = createContext<LogoContextValue | null>(null);

export const LogoProvider = ({ children }: { children: ReactNode }) => {
  const [index, setIndex] = useState(0);
  const idxRef = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    idxRef.current = index;
  }, [index]);

  // Draw a new face from the pool on every page load / navigation. Never the
  // same face twice in a row. SSR renders index 0; the first client render
  // matches it, then the face settles after mount.
  useEffect(() => {
    const other = Math.floor(Math.random() * (LOGO_POOL.length - 1));
    const next = other >= idxRef.current ? other + 1 : other;
    idxRef.current = next;
    setIndex(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
  }, [pathname]);

  // Draw another face whenever the user logs in.
  useEffect(() => {
    const rotate = () => {
      setIndex((current) => {
        const other = Math.floor(Math.random() * (LOGO_POOL.length - 1));
        return other >= current ? other + 1 : other;
      });
    };
    window.addEventListener(LOGIN_POOL_EVENT, rotate);
    return () => window.removeEventListener(LOGIN_POOL_EVENT, rotate);
  }, []);

  // Keep the favicon in sync with the active pooled face.
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = LOGO_POOL[index].src;
  }, [index]);

  return (
    <LogoContext.Provider value={{ index, image: LOGO_POOL[index] }}>
      {children}
    </LogoContext.Provider>
  );
};

export const usePoolLogo = (): LogoContextValue => {
  const ctx = useContext(LogoContext);
  if (!ctx) throw new Error("usePoolLogo must be used inside <LogoProvider>");
  return ctx;
};
