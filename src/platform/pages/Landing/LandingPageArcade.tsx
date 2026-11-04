'use client';

import './landing-arcade.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../core/hooks/useAuth';
import { useTheme } from '../../../core/context/ThemeContext';

const LEVELS = [
  { plate: '1-1', tag: 'VIDEO', title: 'Courses', desc: '13+ language tracks from scratch. Bite-sized lessons, checks, projects.', href: '/app/courses', enter: 'PRESS 1 ▸' },
  { plate: '1-2', tag: 'LIVE', title: 'Playground', desc: 'Write and run code in the browser. 13 runtimes, zero setup, one share link.', href: '/app/playground', enter: 'PRESS 2 ▸' },
  { plate: '1-3', tag: 'VS', title: 'Challenges & Duels', desc: 'Daily puzzles and ranked 1v1 duels. XP, streaks and a ladder to climb.', href: '/app/training', enter: 'PRESS 3 ▸' },
  { plate: '1-4', tag: 'TEAM', title: 'Classrooms', desc: 'Teacher-led groups with assignments and a shared progress board.', href: '/app/classroom', enter: 'PRESS 4 ▸' },
  { plate: '1-5', tag: 'REF', title: 'Library', desc: 'Cheatsheets, glossary and examples for when you need the answer, now.', href: '/app/library', enter: 'PRESS 5 ▸' },
];

const CHARS = [
  { ico: '🐍', name: 'PYTHON' }, { ico: '⚡', name: 'JS' }, { ico: '📘', name: 'TYPESCRIPT' },
  { ico: '☕', name: 'JAVA' }, { ico: '⚙️', name: 'C' }, { ico: '🔧', name: 'C++' },
  { ico: '🐹', name: 'GO' }, { ico: '🦀', name: 'RUST' }, { ico: '🎯', name: 'KOTLIN' },
  { ico: '🍎', name: 'SWIFT' }, { ico: '🎮', name: 'C#' }, { ico: '💎', name: 'RUBY' },
  { ico: '🐘', name: 'PHP' },
];

const SCORES = [
  { n: 'you', x: '1,240 XP', d: '▲ +3', top: true },
  { n: 'sarah.codes', x: '1,180 XP', d: '—' },
  { n: 'pixel_joe', x: '1,102 XP', d: '▼ 1' },
  { n: 'mira.dev', x: '987 XP', d: '—' },
];

const SCREEN_CODE = [
  { c: 'cm', s: '# player one — first run' },
  { c: '', s: 'score = 1240' },
  { c: 'kw', s: 'if streak >= 12:' },
  { c: '', s: '    print("FIRE MODE ON")' },
];

const TICKER = ['★ PRESS START', '★ 13+ LANGUAGES', '★ ZERO SETUP', '★ RANKED DUELS', '★ AI TUTOR 24/7', '★ FREE FOREVER'];

export default function LandingPageArcade() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  const cta = user ? '/app' : '/signup';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = 'PIXELCODE — Insert Coin';
  }, []);

  return (
    <div className="arc">
      <nav className="arc-hud">
        <div className="arc-hud-logo">
          <span className="arc-hud-chip">PC</span>
          <span className="arc-hud-name">PIXEL<br /><span>CODE</span></span>
        </div>
        <div className="arc-hud-coins" aria-hidden>
          <span className="coin" /><span>CREDIT 1</span>
        </div>
        <div className="arc-cells" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => <i key={i} className={`arc-cell${i < 8 ? ' on' : ''}`} />)}
        </div>
        <div className="arc-hud-right">
          <button className="arc-theme-btn" onClick={() => setTheme(dark ? 'light' : 'dark')}>{mounted && dark ? '☀ LIGHT' : '● DARK'}</button>
          <Link href={cta} className="arc-start-sm">START</Link>
        </div>
      </nav>

      <div className="arc-ticker">
        <div className="track">
          {[0, 1].map(half => TICKER.map((t, i) => <span key={`${half}-${i}`}>{t}</span>))}
        </div>
      </div>

      <section className="arc-hero">
        <div className="arc-hero-grid">
          <div>
            <div className="arc-art" aria-hidden><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <h1 className="arc-hero-title">THE BEGINNER&rsquo;S<br /><span className="drop">ARCADE</span> FOR CODE.</h1>
            <p className="arc-stand">Pick a language, press run, level up. Structured courses, a live playground, ranked duels and an AI tutor — all inside one chunky CRT.</p>
            <span className="arc-insert">⟵ INSERT COIN:</span>
            <div className="arc-actions">
              <Link href={cta} className="arc-start">▶ START FREE</Link>
              <Link href="/app/playground" className="arc-ghost-btn">TRY PLAYGROUND</Link>
            </div>
            <p style={{ marginTop: 14, fontSize: 11, fontWeight: 800, color: 'var(--a-muted)' }}>★ FREE PLAY FOREVER — NO CREDIT CARD · HI-SCORES BASED ON REAL XP</p>
          </div>
          <div className="arc-cab">
            <div className="arc-lights" aria-hidden><i /><i /><i /><i /><i /><i /></div>
            <div className="arc-marq">PIXEL CODE</div>
            <div className="arc-screen">
              {SCREEN_CODE.map((l, i) => <div key={i} className={l.c}>{l.s || '\u00A0'}</div>)}
              <div style={{ marginTop: 6 }}>LEVEL 04 · CREDIT 1 ▮ <span className="cursor" /></div>
            </div>
            <div className="arc-ctrl" aria-hidden>
              <span className="arc-joy" style={{ transform: 'rotate(-8deg)' }} />
              <span className="arc-face" /><span className="arc-face g" />
              <span className="arc-coin" />
            </div>
            <div className="arc-plate" />
          </div>
        </div>
      </section>

      <section className="arc-section arc-wrap" id="worldmap">
        <div className="arc-head"><span className="arc-dot" style={{ background: 'var(--a-phos)' }} /><h2 className="arc-h2">WORLD 1 — SELECT ZONE</h2><span className="arc-eyebrow">· 5 LEVELS TO SHIP</span></div>
        <p className="arc-sub">Every level is real project time. Clear one, the next unlocks — order is your choice.</p>
        <div className="arc-map">
          {LEVELS.map(l => (
            <Link key={l.plate} href={l.href} className="arc-level">
              <div className="arc-level-plate">LEVEL {l.plate}<i>{l.tag}</i></div>
              <div className="arc-level-body">
                <h3>{l.title}</h3>
                <p>{l.desc}</p>
                <span className="arc-level-enter">{l.enter}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="arc-section arc-wrap" id="chars" style={{ background: 'var(--a-panel)' }}>
        <div className="arc-head"><span className="arc-dot" style={{ background: 'var(--a-yellow)' }} /><h2 className="arc-h2">SELECT YOUR DIALECT</h2><span className="arc-eyebrow">· 13 PLAYABLE</span></div>
        <p className="arc-sub">Start anywhere, switch anytime — your XP and streak follow you between characters.</p>
        <div className="arc-select">
          {CHARS.map(c => (
            <div className="arc-char" key={c.name}><span className="ico">{c.ico}</span><b>{c.name}</b></div>
          ))}
        </div>
      </section>

      <section className="arc-section arc-wrap" id="boards">
        <div className="arc-head"><span className="arc-dot" style={{ background: 'var(--a-orange)' }} /><h2 className="arc-h2">HIGH SCORES & SIDE QUESTS</h2></div>
        <div className="arc-boards">
          <div className="arc-cab-box">
            <div className="arc-cab-head"><span>WEEKLY LEADERBOARD</span><span>TOP ▲</span></div>
            <div className="arc-cab-body">
              {SCORES.map((s, i) => (
                <div key={s.n} className={`arc-score${s.top ? ' top' : ''}`}>
                  <span className="rk">{i + 1}</span><span>{s.n}</span><span className="xp">{s.x} · {s.d}</span>
                </div>
              ))}
              <Link href="/app/rankings" className="arc-ghost-btn" style={{ alignSelf: 'flex-start', fontSize: 8, padding: '10px 12px' }}>FULL BOARD →</Link>
            </div>
          </div>
          <div className="arc-cab-box">
            <div className="arc-cab-head"><span>SIDE QUESTS</span><span>+XP</span></div>
            <div className="arc-cab-body">
              <div className="arc-tutor-row"><b>TUTOR</b><p>&ldquo;I&rsquo;m stuck at 3AM.&rdquo; <span>→ explains, fixes, hints — never hands the answer over.</span></p></div>
              <div className="arc-tutor-row"><b>DUELS</b><p>&ldquo;1v1 ranked battles.&rdquo; <span>→ queue, race the clock, take the ladder.</span></p></div>
              <div className="arc-tutor-row"><b>STREAK</b><p>&ldquo;Ship daily.&rdquo; <span>→ earn XP, keep the flame, freeze when offline.</span></p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="arc-cta" id="cta">
        <span className="arc-cta-insert">INSERT COIN = 0.00 USD</span>
        <h2>GAME OVER?<br /><span>NOT EVEN CLOSE.</span></h2>
        <p>Free forever. No credit card. Your first hi-score is waiting.</p>
        <div style={{ marginTop: 18 }}>
          <Link href={cta} className="arc-start">▶ CONTINUE?</Link>
        </div>
      </section>

      <footer className="arc-footer">
        <div className="arc-footer-inner">
          <span className="arc-credit">CREDIT 1 — FREE PLAY</span>
          <div className="arc-footer-links">
            <a href="#worldmap">Zones</a>
            <a href="#chars">Dialects</a>
            <a href="#boards">Scores</a>
            <a href="mailto:hello@pixelcode.camp">hello@pixelcode.camp</a>
          </div>
          <span className="arc-credit">© {new Date().getFullYear()} PIXELCODE</span>
        </div>
        <div className="arc-footer-bars">
          <span>MADE WITH ◆ PIXELS</span><span>BEIGE COMPUTER CLUB</span><span>ATTRACT MODE: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
