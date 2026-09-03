'use client';

import './pixel-landing.css';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import oldComputer from '@/assets/old computer.png';
import { useAuth } from '../../../core/hooks/useAuth';
import { useTheme } from '../../../core/context/ThemeContext';

const FEATURES = [
  { n: '01 / 09', badge: 'CORE', bg: 'var(--phosphor)', fg: '#161616', iconBg: 'var(--yellow)', icon: '📚', title: 'Structured Courses', desc: '13+ languages, leveled paths from scratch. Bite-sized lessons, checks, and projects.', points: ['Python, JS, Go, Rust & more', 'Projects that ship'] },
  { n: '02 / 09', badge: '● LIVE', bg: 'var(--yellow)', fg: '#161616', iconBg: 'var(--orange)', icon: '⚡', title: 'Interactive Playground', desc: 'Write and run code in the browser. Instant output, no install.', points: ['13 runtimes + live preview', 'Share with one link'] },
  { n: '03 / 09', badge: 'XP', bg: 'var(--orange)', fg: '#fff', iconBg: 'var(--yellow)', icon: '⚔️', title: 'Challenges & Duels', desc: 'Daily puzzles and 1v1 duels. Earn XP, keep the streak, climb.', points: ['Daily challenge', 'Ranked duels'] },
  { n: '04 / 09', badge: 'TEAMS', bg: '#CFC8B5', fg: '#161616', iconBg: 'var(--phosphor)', icon: '🎓', title: 'Classrooms', desc: 'Join teacher-led groups, get assignments, and track class progress.', points: ['Invite by code', 'Teacher dashboard'] },
  { n: '05 / 09', badge: 'REFS', bg: '#EFE9D9', fg: '#161616', iconBg: 'var(--grey)', icon: '📖', title: 'Library & Docs', desc: 'Curated references, cheatsheets, and docs — searchable and offline-ready.', points: ['Cheatsheets', 'Offline mode'] },
  { n: '06 / 09', badge: 'AI', bg: '#161616', fg: 'var(--phosphor)', iconBg: 'var(--yellow)', icon: '🧠', title: 'AI Chat Tutor', desc: 'Stuck? Ask the tutor — explains, fixes, and hints without giving away the answer.', points: ['Hint → explain → fix', 'Works in playground'] },
  { n: '07 / 09', badge: 'PROGRESS', bg: 'var(--phosphor)', fg: '#161616', iconBg: 'var(--surface)', icon: '📈', title: 'Levels & Streaks', desc: 'Earn XP, level up, keep the flame alive. Every line counts.', points: ['XP & levels', 'Daily streak & freeze'] },
  { n: '08 / 09', badge: 'RANK', bg: 'var(--grey)', fg: '#fff', iconBg: 'var(--yellow)', icon: '🏆', title: 'Leaderboards', desc: 'Global, friends, and classroom boards. See where you stand.', points: ['Weekly & all-time', 'Class vs class'] },
  { n: '09 / 09', badge: 'SAFE', bg: 'var(--yellow)', fg: '#161616', iconBg: '#161616', icon: '👾', title: 'Kids Mode', desc: 'Age-appropriate activities, blocks + code, parental controls. Big pixels, big joy.', points: ['Blocks & typing', 'Parent dashboard'] },
];

export default function LandingPageV2() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  const [deckIndex, setDeckIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next as any);
  };

  // Pixel dissolve grid
  useEffect(() => {
    const build = () => {
      const grid = gridRef.current;
      if (!grid) return;
      grid.innerHTML = '';
      const W = window.innerWidth;
      const px = 12, gap = 4, cell = px + gap;
      const cols = Math.ceil(W / cell) + 2;
      const rows = 12;
      grid.style.gridTemplateColumns = `repeat(${cols}, ${px}px)`;
      (grid.style as any).gap = gap + 'px';
      const curve = [0, 0, 0.03, 0.07, 0.14, 0.26, 0.42, 0.62, 0.78, 0.88, 0.96, 0.985];
      for (let r = 0; r < rows; r++) {
        const d = curve[r] ?? 1;
        for (let c = 0; c < cols; c++) {
          const el = document.createElement('div');
          el.className = 'px';
          const hash = ((c * 92821 ^ r * 3221) % 100) / 100;
          const checker = (c + r) % 2 === 0;
          let show = false;
          if (d >= 0.99) show = hash > 0.04;
          else if (d >= 0.85) show = hash < d && !(hash > 0.88 && checker);
          else if (d >= 0.4) {
            if (d < 0.62) show = checker ? hash < d * 1.25 : hash < d * 0.55;
            else show = hash < d;
          } else if (d > 0) show = hash < d * 0.9;
          else show = false;
          if (!show) el.classList.add('blank');
          if (d === 0) el.classList.add('blank');
          grid.appendChild(el);
        }
      }
    };
    build();
    let to: any;
    const onResize = () => { clearTimeout(to); to = setTimeout(build, 120); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reveal on scroll (respects prefers-reduced-motion via CSS)
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = document.querySelectorAll('.section, .split, .kids, .languages, .cta');
    els.forEach(el => el.classList.add('reveal'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
    // hero in immediately
    document.querySelector('.hero')?.classList.add('in');
    return () => obs.disconnect();
  }, []);

  // Deck logic
  const perView = 3;
  const maxIndex = Math.max(0, FEATURES.length - perView);
  const go = (n: number) => setDeckIndex(Math.max(0, Math.min(maxIndex, n)));

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    let sx = 0, dx = 0, dragging = false;
    const onTouchStart = (e: TouchEvent) => { sx = e.touches[0].clientX; dragging = true; (track.style as any).transition = 'none'; };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      dx = e.touches[0].clientX - sx;
      const w = viewport.clientWidth;
      const gap = 16;
      const cardW = (w - gap * (perView - 1)) / perView;
      track.style.transform = `translateX(-${deckIndex * (cardW + gap) - dx}px)`;
    };
    const onTouchEnd = () => {
      dragging = false; (track.style as any).transition = '';
      if (Math.abs(dx) > 48) { if (dx < 0) go(deckIndex + 1); else go(deckIndex - 1); }
      dx = 0;
    };
    const onMouseDown = (e: MouseEvent) => { sx = e.clientX; dragging = true; (track.style as any).transition = 'none'; e.preventDefault(); };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      dx = e.clientX - sx;
      const w = viewport.clientWidth;
      const gap = 16;
      const cardW = (w - gap * (perView - 1)) / perView;
      track.style.transform = `translateX(-${deckIndex * (cardW + gap) - dx}px)`;
    };
    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false; (track.style as any).transition = '';
      if (Math.abs(dx) > 48) { if (dx < 0) go(deckIndex + 1); else go(deckIndex - 1); }
      dx = 0;
    };
    viewport.addEventListener('touchstart', onTouchStart as any, { passive: true } as any);
    viewport.addEventListener('touchmove', onTouchMove as any, { passive: true } as any);
    viewport.addEventListener('touchend', onTouchEnd as any);
    viewport.addEventListener('mousedown', onMouseDown as any);
    window.addEventListener('mousemove', onMouseMove as any);
    window.addEventListener('mouseup', onMouseUp as any);
    return () => {
      viewport.removeEventListener('touchstart', onTouchStart as any);
      viewport.removeEventListener('touchmove', onTouchMove as any);
      viewport.removeEventListener('touchend', onTouchEnd as any);
      viewport.removeEventListener('mousedown', onMouseDown as any);
      window.removeEventListener('mousemove', onMouseMove as any);
      window.removeEventListener('mouseup', onMouseUp as any);
    };
  }, [deckIndex]);

  return (
    <div>
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div className="logo">PC</div>
          <div style={{ fontFamily: "'Press Start 2P'", fontSize: 10, lineHeight: 1 }}>PIXEL<br /><span style={{ color: 'var(--phosphor2)' }}>CODE</span></div>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#playground">Playground</a>
          <a href="#classrooms">Classrooms</a>
          <a href="#library">Library</a>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="theme-btn" onClick={toggleTheme}>{dark ? '☀ LIGHT' : '● DARK'}</button>
          <Link href={user ? '/app' : '/signup'} className="btn btn-dark">Start Free →</Link>
        </div>
      </nav>

      <div className="marquee">
        <div className="track">
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ FOR BEGINNERS</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ 13+ LANGUAGES</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ PLAYGROUND</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ DUELS & XP</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ CLASSROOMS</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ AI TUTOR</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }}>★ KIDS MODE</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ FOR BEGINNERS</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ 13+ LANGUAGES</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ PLAYGROUND</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ DUELS & XP</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ CLASSROOMS</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ AI TUTOR</span>
          <span style={{ padding: '0 26px', borderRight: '4px solid var(--phosphor)' }} aria-hidden>★ KIDS MODE</span>
        </div>
      </div>

      <section className="grid-bg hero">
        <span style={{ position: 'absolute', top: '18%', left: '4%', width: 18, height: 18, background: 'var(--phosphor)', border: '3px solid #161616', animation: 'float 5s ease-in-out infinite' }} />
        <span style={{ position: 'absolute', top: '24%', right: '6%', width: 14, height: 14, background: 'var(--orange)', border: '3px solid #161616', animation: 'float 4s ease-in-out infinite .5s' }} />
        <span style={{ position: 'absolute', bottom: '18%', left: '7%', width: 20, height: 20, background: 'var(--grey)', border: '3px solid #161616', animation: 'float 6s ease-in-out infinite 1s' }} />
        <div className="wrap hero-grid">
          <div>
            <div className="badge">✦ BUILT FOR BEGINNERS — ZERO TO SHIPPING</div>
            <h1 className="hero-title">Learn to code.<br />For <span className="block">real.</span></h1>
            <p className="hero-sub">PixelCode is the friendly path from first line to real projects. Structured courses, a live playground, duels for XP, teacher classrooms, and an AI tutor that never sleeps — all in one chunky CRT.</p>
            <div className="hero-actions">
              <Link href={user ? '/app' : '/signup'} className="btn btn-ph">Start Learning Free →</Link>
              <Link href="/app/ide" className="btn btn-ghost">Try Playground</Link>
            </div>
            <div className="hero-meta"><span>★ No credit card</span><i /><span>13+ languages</span><i /><span>Kids mode included</span></div>
          </div>
          <div className="computer-wrap">
            <div className="computer-card">
              <Image src={oldComputer} alt="Old computer" className="computer-img" width={460} height={340} style={{ imageRendering: 'pixelated' }} priority />
              <div className="level-sticker"><b>LVL 04</b><span className="mono">1,240 XP ✦</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="strip-inner">
          <div className="strip-card"><div className="strip-num" style={{ color: 'var(--phosphor)' }}>13+</div><div className="mono strip-label">LANGUAGES</div><div className="mono strip-sub">Python → Rust</div></div>
          <div className="strip-card"><div className="strip-num" style={{ color: 'var(--orange)' }}>200+</div><div className="mono strip-label">COURSES</div><div className="mono strip-sub">Zero to shipping</div></div>
          <div className="strip-card"><div className="strip-num" style={{ color: 'var(--yellow)' }}>10K+</div><div className="mono strip-label">EXERCISES</div><div className="mono strip-sub">Hands-on only</div></div>
          <div className="strip-card"><div className="strip-num" style={{ color: '#7AA8FF' }}>500K</div><div className="mono strip-label">LEARNERS</div><div className="mono strip-sub">And counting</div></div>
        </div>
      </section>

      <section className="wrap section" id="features">
        <div className="section-head"><span className="dot" style={{ background: 'var(--phosphor)' }} /><h2 className="h2">Everything a beginner needs</h2><span className="dot" style={{ background: 'var(--orange)' }} /><span className="eyebrow" style={{ marginLeft: 6 }}>— 9 TOOLS · ONE PLATFORM</span></div>
        <p className="sub">Not just videos. Swipe the deck — every card is a tool that gets you writing code from day one.</p>
        <div className="deck-wrap">
          <div className="deck-head-row">
            <span className="mono" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em' }}><span>{String(deckIndex + 1).padStart(2, '0')} / {String(Math.max(1, FEATURES.length - 2)).padStart(2, '0')}</span> · USE ← → OR SWIPE</span>
            <div className="deck-controls">
              <button className="deck-btn" onClick={() => go(deckIndex - 1)} aria-label="Previous">←</button>
              <button className="deck-btn" onClick={() => go(deckIndex + 1)} aria-label="Next">→</button>
            </div>
          </div>
          <div className="deck-viewport" ref={viewportRef}>
            <div className="deck-track" ref={trackRef} style={{ transform: `translateX(-${deckIndex *  (typeof window !== 'undefined' ? ((viewportRef.current?.clientWidth || 1160) - 32) / 3 + 16 : 0)}px)` }}>
              {FEATURES.map((f) => (
                <div key={f.title} className="deck-card">
                  <div className="fcard" style={{ background: f.bg, color: f.fg }}>
                    <div className="fcard-top"><span className="fcard-num">{f.n}</span><span className="mono" style={{ fontSize: 9, background: f.fg === '#fff' ? '#161616' : '#161616', color: f.bg === '#161616' ? 'var(--phosphor)' : f.fg === '#fff' ? '#fff' : 'var(--phosphor)', padding: '3px 6px', border: '2px solid #161616' }}>{f.badge}</span></div>
                    <div className="fcard-icon" style={{ background: f.iconBg }}>{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p className="mono">{f.desc}</p>
                    <ul>{f.points.map(p => <li key={p}>{p}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="deck-dots">
            {Array.from({ length: Math.max(1, FEATURES.length - 2) }).map((_, i) => (
              <button key={i} className={`deck-dot ${i === deckIndex ? 'active' : ''}`} onClick={() => go(i)} aria-label={`Go to ${i + 1}`} />
            ))}
          </div>
          <div className="deck-progress"><i style={{ width: `${(deckIndex / Math.max(1, FEATURES.length - 3)) * 100}%` }} /></div>
        </div>
      </section>

      <section className="split" id="playground">
        <div className="wrap split-grid">
          <div>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '.16em', fontWeight: 800, color: 'var(--phosphor2)' }}>● PLAYGROUND — WRITE & RUN</p>
            <h2 className="pixel" style={{ fontSize: 18, marginTop: 10, lineHeight: 1.4 }}>Your browser is the computer.</h2>
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.7, fontWeight: 700 }}>No installs. No setup. Pick a language, write, hit Run — see phosphor output instantly. Share a link, ask the AI tutor inline.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              <span className="mono" style={{ fontSize: 10, padding: '7px 10px', border: '3px solid #161616', background: 'var(--phosphor)', color: '#161616', fontWeight: 800, boxShadow: '3px 3px 0 #161616' }}>▶ Instant run</span>
              <span className="mono" style={{ fontSize: 10, padding: '7px 10px', border: '3px solid #161616', background: 'var(--surface)', fontWeight: 800, boxShadow: '3px 3px 0 #161616' }}>⤴ Share link</span>
              <span className="mono" style={{ fontSize: 10, padding: '7px 10px', border: '3px solid #161616', background: 'var(--yellow)', color: '#161616', fontWeight: 800, boxShadow: '3px 3px 0 #161616' }}>🧠 AI explain</span>
            </div>
          </div>
          <div className="window">
            <div className="window-bar"><div className="dots"><span className="dot2" style={{ background: 'var(--orange)' }} /><span className="dot2" style={{ background: 'var(--yellow)' }} /><span className="dot2" style={{ background: 'var(--phosphor)' }} /><span className="mono window-title" style={{ marginLeft: 6 }}>playground.py — PixelCode</span></div><button className="run-btn">▶ RUN</button></div>
            <div className="window-body code-bg"><span className="cmt"># welcome — first pixel</span><br /><span style={{ color: '#BFFF00' }}>def</span> <span style={{ color: '#FFE600' }}>greet</span>(name):<br />&nbsp;&nbsp;<span style={{ color: '#BFFF00' }}>return</span> <span style={{ color: '#FF8A3D' }}>f&quot;hello, &#123;name&#125; ✦&quot;</span><br /><br /><span style={{ color: '#BFFF00' }}>for</span> lang <span style={{ color: '#BFFF00' }}>in</span> [<span style={{ color: '#FF8A3D' }}>&quot;Python&quot;</span>, <span style={{ color: '#FF8A3D' }}>&quot;JS&quot;</span>, <span style={{ color: '#FF8A3D' }}>&quot;Go&quot;</span>]:<br />&nbsp;&nbsp;print(greet(lang))<br /><span className="cmt"># → hello, Python ✦</span></div>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="split-grid">
          <div>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '.14em', fontWeight: 800, color: 'var(--orange)' }}>● PROGRESS — LEVELS / STREAKS / BOARDS</p>
            <h2 className="pixel" style={{ fontSize: 18, marginTop: 10 }}>Every line moves you up.</h2>
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.65 }}>Earn XP for lessons, playground saves, and duel wins. Keep the flame with daily streaks. Watch your level climb.</p>
            <div className="progress-bars">
              <div className="pbar"><span className="mono" style={{ fontSize: 11, fontWeight: 800 }}>LVL 04 — 1,240 XP</span><div className="pbar-fill" style={{ maxWidth: 160 }}><div style={{ position: 'absolute', inset: '2px 28% 2px 2px', background: 'var(--phosphor)' }} /><i /></div><span className="mono" style={{ fontSize: 11, fontWeight: 800 }}>72%</span></div>
              <div className="pbar" style={{ background: 'var(--yellow)', color: '#161616' }}><span className="mono" style={{ fontSize: 11, fontWeight: 800 }}>🔥 12 day streak</span><span className="mono" style={{ fontSize: 10, fontWeight: 700 }}>Freeze: 2</span></div>
              <div className="pbar" style={{ background: 'var(--surface2)' }}><span className="mono" style={{ fontSize: 11, fontWeight: 800 }}>Next: LVL 05 — 1,700 XP</span><span className="mono" style={{ fontSize: 10, fontWeight: 700 }}>460 XP to go</span></div>
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.12em', fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'var(--yellow)', border: '2px solid #161616', display: 'inline-block' }} /> LEADERBOARD — WEEKLY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="leader" style={{ background: 'var(--yellow)', color: '#161616' }}><div className="rank" style={{ background: 'var(--phosphor)' }}>1</div><div className="mono" style={{ fontSize: 12, fontWeight: 800 }}>you — 1,240 XP</div><span className="mono" style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800 }}>▲ +3</span></div>
              <div className="leader"><div className="rank" style={{ background: 'var(--surface2)' }}>2</div><span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>sarah.codes — 1,180 XP</span><span className="mono" style={{ marginLeft: 'auto', fontSize: 11 }}>—</span></div>
              <div className="leader"><div className="rank" style={{ background: 'var(--surface2)' }}>3</div><span className="mono" style={{ fontSize: 12, fontWeight: 700 }}>pixel_joe — 1,102 XP</span><span className="mono" style={{ marginLeft: 'auto', fontSize: 11 }}>▼ 1</span></div>
              <div className="leader" style={{ opacity: .7 }}><div className="rank">4</div><span className="mono" style={{ fontSize: 12 }}>mira.dev — 987 XP</span><span className="mono" style={{ marginLeft: 'auto', fontSize: 11 }}>—</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="split" id="classrooms">
        <div className="wrap">
          <div className="split-grid" style={{ alignItems: 'start' }}>
            <div>
              <p className="mono" style={{ fontSize: 10, letterSpacing: '.14em', fontWeight: 800, color: 'var(--phosphor2)' }}>● CLASSROOMS — LEARN TOGETHER</p>
              <h2 className="pixel" style={{ fontSize: 16, marginTop: 10, lineHeight: 1.4 }}>Teacher-led. Student-paced.</h2>
              <div className="classroom" style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <b className="silk" style={{ fontSize: 15 }}>CS101 — Intro to Code</b><span className="mono" style={{ fontSize: 10, padding: '4px 8px', border: '2px solid #161616', background: 'var(--phosphor)', color: '#161616', fontWeight: 800 }}>CODE: PX-482</span>
                </div>
                <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>24 students · 12 assignments · Avg 78% completion</p>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="mono" style={{ fontSize: 10, padding: '6px 10px', border: '3px solid #161616', background: 'var(--surface)', fontWeight: 800 }}>Assignments</span><span className="mono" style={{ fontSize: 10, padding: '6px 10px', border: '3px solid #161616', background: 'var(--yellow)', color: '#161616', fontWeight: 800 }}>Progress board</span></div>
              </div>
            </div>
            <div id="library">
              <p className="mono" style={{ fontSize: 10, letterSpacing: '.14em', fontWeight: 800, color: 'var(--grey)' }}>● LIBRARY — CURATED DOCS</p>
              <h2 className="pixel" style={{ fontSize: 16, marginTop: 10 }}>Answers, not rabbit holes.</h2>
              <div className="doc-grid" style={{ marginTop: 14 }}>
                <div className="doc-card"><b>Cheatsheets</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>One-page refs for every lang.</p></div>
                <div className="doc-card"><b>Glossary</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Jargon, explained simply.</p></div>
                <div className="doc-card"><b>Examples</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Copy-paste runnable snippets.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kids">
        <div className="wrap kids-grid">
          <div>
            <p className="mono" style={{ fontSize: 10, letterSpacing: '.14em', fontWeight: 800, color: '#161616' }}>👾 KIDS MODE — AGES 8–14</p>
            <h2 className="pixel" style={{ fontSize: 20, marginTop: 10, color: '#161616', lineHeight: 1.3 }}>Big pixels. Big joy. Safe.</h2>
            <p className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#2B2416', marginTop: 8, lineHeight: 1.6 }}>Blocks meet typing. Guided puzzles, playful characters, and parental controls. Same progress system, age-appropriate pace.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Link href="/kids" className="btn btn-dark">Enter Kids Mode →</Link>
              <span className="mono" style={{ fontSize: 11, padding: '10px 12px', border: '3px solid #161616', background: 'var(--surface)', fontWeight: 800, boxShadow: '3px 3px 0 #161616' }}>Parent dashboard</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="kids-card"><div style={{ fontSize: 22 }}>🧱</div><b className="silk">Blocks</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Drag, snap, run.</p></div>
            <div className="kids-card"><div style={{ fontSize: 22 }}>🎨</div><b className="silk">Draw with code</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Plot pixels, see art.</p></div>
            <div className="kids-card"><div style={{ fontSize: 22 }}>🛡️</div><b className="silk">Safe chat</b><p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Filtered AI hints.</p></div>
            <div className="kids-card" style={{ background: '#161616', color: 'var(--phosphor)' }}><div style={{ fontSize: 22 }}>⭐</div><b className="silk">Earn stars</b><p className="mono" style={{ fontSize: 11, opacity: .8, marginTop: 4 }}>Stickers & levels.</p></div>
          </div>
        </div>
      </section>

      <section className="wrap languages">
        <h2 className="pixel" style={{ fontSize: 18 }}>13+ Languages. One playground.</h2>
        <p className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginTop: 6 }}>Start anywhere — switch anytime. Your XP follows you.</p>
        <div className="pills">
          <span className="pill" style={{ background: '#161616', color: 'var(--phosphor)' }}>🐍 Python</span>
          <span className="pill" style={{ background: 'var(--yellow)', color: '#161616' }}>⚡ JavaScript</span>
          <span className="pill" style={{ background: 'var(--surface2)' }}>📘 TypeScript</span>
          <span className="pill" style={{ background: 'var(--orange)', color: '#fff' }}>☕ Java</span>
          <span className="pill" style={{ background: '#161616', color: 'var(--yellow)' }}>⚙️ C</span>
          <span className="pill" style={{ background: 'var(--grey)', color: '#fff' }}>🔧 C++</span>
          <span className="pill" style={{ background: 'var(--phosphor)', color: '#161616' }}>🐹 Go</span>
          <span className="pill" style={{ background: 'var(--orange)', color: '#fff' }}>🦀 Rust</span>
          <span className="pill" style={{ background: '#161616', color: 'var(--yellow)' }}>🎯 Kotlin</span>
          <span className="pill" style={{ background: 'var(--orange)', color: '#fff' }}>🍎 Swift</span>
          <span className="pill" style={{ background: 'var(--grey)', color: '#fff' }}>🎮 C#</span>
          <span className="pill" style={{ background: 'var(--orange)', color: '#fff' }}>💎 Ruby</span>
          <span className="pill" style={{ background: 'var(--phosphor)', color: '#161616' }}>🐘 PHP</span>
        </div>
      </section>

      <section className="cta" id="cta">
        <div className="cta-grid" />
        <div className="wrap" style={{ position: 'relative' }}>
          <h2>Start your first pixel.</h2>
          <p className="mono">Free forever. No credit card. CRT included.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
            <Link href={user ? '/app' : '/signup'} className="btn btn-dark">Create Free Account →</Link>
            <Link href="/kids" className="btn" style={{ background: 'var(--surface)', border: '3px solid #161616', boxShadow: '4px 4px 0 #161616' }}>👾 Try Kids Mode</Link>
          </div>
        </div>
      </section>

      <div className="pixel-dissolve" aria-hidden="true">
        <div className="pixel-grid" ref={gridRef} />
      </div>
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">PIXELCODE</div>
            <p className="mono footer-brand-desc">Learn to code the retro way. Brutally simple, weirdly fun, built for beginners and the teachers who guide them.</p>
            <div className="footer-icons">
              <span className="footer-icon" style={{ background: '#BFFF00', color: '#161616' }}>◐</span>
              <span className="footer-icon" style={{ background: '#FF6B1A', color: '#fff' }}>✦</span>
              <span className="footer-icon" style={{ background: '#FFE600', color: '#161616' }}>≡</span>
            </div>
          </div>
          <div>
            <div className="footer-col-title">PLATFORM</div>
            <nav className="footer-links mono">
              <a href="#features">Courses</a>
              <a href="#playground">Playground</a>
              <a href="#features">Challenges</a>
              <a href="#features">Duels & Leaderboards</a>
              <a href="#classrooms">Classrooms</a>
              <a href="#features">Kids Mode</a>
            </nav>
          </div>
          <div>
            <div className="footer-col-title">SUPPORT</div>
            <nav className="footer-links mono">
              <a href="#library">Library / Docs</a>
              <a href="#features">AI Tutor Help</a>
              <a href="#classrooms">Teachers</a>
              <a href="#cta">Pricing</a>
              <a href="#cta">Contact — hello@pixelcode.camp</a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom mono">
          <span>© 2024 PIXELCODE · BEIGE COMPUTER CLUB</span>
          <span>MADE WITH ◆ PIXELS AND CRTs</span>
        </div>
        <div className="footer-robot" aria-hidden="true">
          <div className="footer-bubble">LET&apos;S CODE?</div>
          <div className="footer-robot-img"><span style={{ fontSize: 32 }}>🤖</span></div>
        </div>
        <div className="footer-stripe"><div style={{ flex: 1, background: 'var(--footer-dot)' }} /><div style={{ flex: 1, background: 'var(--orange)' }} /><div style={{ flex: 1, background: 'var(--footer-bg)' }} /></div>
      </footer>
    </div>
  );
}
