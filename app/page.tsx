'use client';

import dynamic from 'next/dynamic';
import './landing-switcher.css';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LandingPageV2 = dynamic(() => import('@/platform/pages/Landing/LandingPageV2').then((mod) => mod.default), {
  loading: () => null,
});
const LandingPageTerminal = dynamic(() => import('@/platform/pages/Landing/LandingPageTerminal').then((mod) => mod.default), {
  loading: () => null,
});
const LandingPageArcade = dynamic(() => import('@/platform/pages/Landing/LandingPageArcade').then((mod) => mod.default), {
  loading: () => null,
});
const LandingPageEditorial = dynamic(() => import('@/platform/pages/Landing/LandingPageEditorial').then((mod) => mod.default), {
  loading: () => null,
});

const VARIANTS = [
  { name: 'CRT CLASSIC', Page: LandingPageV2 },
  { name: 'TERMINAL', Page: LandingPageTerminal },
  { name: 'ARCADE', Page: LandingPageArcade },
  { name: 'EDITORIAL', Page: LandingPageEditorial },
];

function HomeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = parseInt(params.get('v') || '1', 10);
  const idx = Math.min(Math.max(Number.isNaN(raw) ? 1 : raw, 1), VARIANTS.length) - 1;
  const { Page, name } = VARIANTS[idx];

  const go = (i: number, scroll = true) => {
    const n = (i + VARIANTS.length) % VARIANTS.length;
    router.push(`/?v=${n + 1}`, { scroll });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '[') go(idx - 1, false);
      if (e.key === ']') go(idx + 1, false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx]);

  return (
    <>
      <Page />
      <div className="lw-dock" role="navigation" aria-label="Landing variant switcher">
        <div className="lw-top"><span className="lw-dot" />LANDING THEME<span className="lw-count">{idx + 1}/{VARIANTS.length}</span></div>
        <div className="lw-row">
          <button className="lw-btn" onClick={() => go(idx - 1)} aria-label="Previous landing theme">◀</button>
          <span className="lw-name">{name}</span>
          <button className="lw-btn" onClick={() => go(idx + 1)} aria-label="Next landing theme">▶</button>
        </div>
        <div className="lw-dots">
          {VARIANTS.map((v, i) => (
            <button key={v.name} className={`lw-dotbtn${i === idx ? ' on' : ''}`} onClick={() => go(i)} aria-label={`Show ${v.name} landing`}>{i + 1}</button>
          ))}
        </div>
        <div className="lw-hint">URL: /?v={idx + 1} · KEYS: [ / ]</div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
