'use client';

import './landing-terminal.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../core/hooks/useAuth';
import { useTheme } from '../../../core/context/ThemeContext';

const BOOT_LINES = [
  'PXLCODE BIOS v2.6 — 640K RAM ............ OK',
  'MOUNTING /courses ................. [OK] 13 TRACKS',
  'MOUNTING /playground .............. [OK] 0 INSTALLS',
  'MOUNTING /arena ................... [OK] RANKED 1V1',
  'MOUNTING /tutor ................... [OK] AI 24/7',
  '',
  'ALL SYSTEMS READY, HUMAN.',
  '$ signup --free --beginner-mode',
];

const FEATURES = [
  { n: '01', t: 'Structured Courses', d: '13+ languages on leveled paths from scratch — bite-sized lessons, checks and projects.' },
  { n: '02', t: 'Interactive Playground', d: 'Write and run code in the browser. Instant output, zero setup.' },
  { n: '03', t: 'Challenges & Duels', d: 'Daily puzzles and ranked 1v1 duels. Earn XP, keep the streak, climb the board.' },
  { n: '04', t: 'Classrooms', d: 'Invite by code, get assignments, track the whole class on one board.' },
  { n: '05', t: 'Library & Docs', d: 'Cheatsheets, glossary and curated references that get to the point.' },
  { n: '06', t: 'AI Chat Tutor', d: 'Stuck at 3AM? It explains, fixes and hints — without giving away the answer.' },
  { n: '07', t: 'Levels & Streaks', d: 'Every lesson, save and duel pays XP. Keep the flame with daily streaks.' },
  { n: '08', t: 'Leaderboards', d: 'Global, friends and classroom boards. See exactly where you stand.' },
];

const DIRS = [
  { d: 'javascript/', n: 'LIVE' }, { d: 'python/', n: 'LIVE' },
  { d: 'typescript/', n: 'LIVE' }, { d: 'sql/', n: 'LIVE' },
  { d: 'html-css/', n: 'BETA' }, { d: 'go/', n: 'BETA' },
  { d: 'rust/', n: 'BETA' }, { d: 'java/', n: 'BETA' },
  { d: 'c/', n: 'BETA' }, { d: 'cpp/', n: 'BETA' },
  { d: 'kotlin/', n: 'BETA' }, { d: 'swift/', n: 'BETA' },
  { d: 'php/', n: 'BETA' },
];

const PLAY_CODE = [
  { c: 'cm', s: '# welcome — first pixel' },
  { c: 'kw', s: 'def greet(name):' },
  { c: 'pl', s: '    return f"hello, {name} ✦"' },
  { c: 'pl', s: '' },
  { c: 'kw', s: 'for lang in ["Python", "JS", "Go"]:' },
  { c: 'pl', s: '    print(greet(lang))' },
];

const SESSION = [
  ['python doctor', 'python ready — zero setup ✓'],
  ['node doctor', 'node ready — zero setup ✓'],
  ['go doctor', 'go ready — zero setup ✓'],
  ['rustc doctor', 'rust ready — zero setup ✓'],
  ['java doctor', 'java ready — zero setup ✓'],
  ['ts-node doctor', 'typescript ready ✓'],
  ['gcc doctor', 'c ready — zero setup ✓'],
  ['g++ doctor', 'c++ ready — zero setup ✓'],
  ['kotlinc doctor', 'kotlin ready ✓'],
  ['swiftc doctor', 'swift ready ✓'],
  ['sqlite3 doctor', 'sql ready ✓'],
  ['php doctor', 'php ready ✓'],
  ['html5 doctor', 'html + css ready ✓'],
];

const LEADERS = [
  { n: 'you', x: '1,240 XP', d: '▲ +3', you: true },
  { n: 'sarah.codes', x: '1,180 XP', d: '—' },
  { n: 'pixel_joe', x: '1,102 XP', d: '▼ 1' },
  { n: 'mira.dev', x: '987 XP', d: '—' },
];

export default function LandingPageTerminal() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  const cta = user ? '/app' : '/signup';
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const full = BOOT_LINES.join('\n');
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(full); setDone(true); return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) { setDone(true); clearInterval(id); }
    }, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="trm">
      <nav className="trm-nav">
        <div className="trm-nav-path"><span style={{ color: '#FFE600' }}>admin@pixelcode</span>:~$ ./pixelcode</div>
        <div className="trm-nav-links">
          <a href="#panes">-panes</a>
          <a href="#man">-features</a>
          <a href="#session">-languages</a>
          <a href="#windows">-classrooms</a>
        </div>
        <div className="trm-nav-cta">
          <button className="trm-theme-btn" onClick={() => setTheme(dark ? 'light' : 'dark')}>{mounted && dark ? '☀ LIGHT' : '● DARK'}</button>
          <Link href={cta} className="trm-nav-start">SIGN UP</Link>
        </div>
      </nav>

      <section className="trm-hero">
        <div className="trm-hero-grid">
          <div>
            <div className="trm-kicker"><i />BEGINNER-FIRST — ZERO TO SHIPPING</div>
            <h1 className="trm-h1">LEARN TO CODE ON<br /><span className="block">A REAL TERMINAL.</span></h1>
            <p className="trm-stand">PixelCode boots you from first line to real projects: structured courses, a live playground, ranked duels and an AI tutor that answers at 3AM.</p>
            <div className="trm-actions">
              <Link href={cta} className="trm-btn">$ START FREE →</Link>
              <Link href="/app/playground" className="trm-btn trm-btn-ghost">OPEN TERMINAL</Link>
            </div>
            <div className="trm-meta"><span>★ No credit card</span><span>·</span><span>Everything runs in your browser</span></div>
          </div>
          <div className="trm-term">
            <div className="trm-term-head"><i /><i /><i /><span>admin@pixelcode: ~/boot</span></div>
            <div className="trm-term-body">
              {typed.split('\n').map((line, i) => (
                <div className="trm-bootline" key={i}>{line || '\u00A0'}{!done && i === typed.split('\n').length - 1 && <span className="trm-cursor" />}</div>
              ))}
              {done && <div className="trm-bootline"><span className="trm-cursor" /></div>}
            </div>
          </div>
        </div>
      </section>

      <section className="trm-strip">
        <div className="trm-strip-inner">
          <div className="trm-strip-cell"><div className="trm-strip-num">13+</div><div className="trm-strip-label">LANGUAGES</div></div>
          <div className="trm-strip-cell"><div className="trm-strip-num">0</div><div className="trm-strip-label">SETUP</div></div>
          <div className="trm-strip-cell"><div className="trm-strip-num">1v1</div><div className="trm-strip-label">RANKED DUELS</div></div>
          <div className="trm-strip-cell"><div className="trm-strip-num">24/7</div><div className="trm-strip-label">AI TUTOR</div></div>
        </div>
      </section>

      <section className="trm-panes" id="panes">
        <div className="trm-panes-head">
          <span className="trm-dot" style={{ background: 'var(--t-phos)' }} /><h2 className="trm-h2">TILED WORKSPACES</h2><span className="trm-dot" style={{ background: 'var(--t-orange)' }} />
          <span className="trm-eyebrow">— THREE PANES · ONE PLATFORM</span>
        </div>
        <div className="trm-panes-grid">
          <div className="trm-pane">
            <div className="trm-pane-head"><span className="trm-pane-title">~/courses</span><span className="trm-pane-meta">13 TRACKS</span></div>
            <div className="trm-pane-body">
              <ul className="trm-list">
                {DIRS.map((d) => (
                  <li key={d.d}><span className="dir">/{d.d}</span><span style={{ opacity: .6 }}>{d.n}</span></li>
                ))}
              </ul>
              <Link href="/app/courses" className="trm-btn trm-btn-ghost" style={{ fontSize: 8, padding: '10px 12px', marginTop: 'auto' }}>cat courses.md →</Link>
            </div>
          </div>
          <div className="trm-pane">
            <div className="trm-pane-head"><span className="trm-pane-title">~/playground</span><span className="trm-pane-meta">FREE</span></div>
            <div className="trm-pane-body">
              <div className="trm-code">
                {PLAY_CODE.map((l, i) => <div key={i} className={l.c === 'pl' ? '' : l.c} style={{ whiteSpace: 'pre-wrap' }}>{l.s || '\u00A0'}</div>)}
              </div>
              <div className="trm-out"><b>OUT ▸</b><span>hello, Python ✦ · hello, JS ✦ · hello, Go ✦</span></div>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <Link href="/app/playground" className="trm-btn" style={{ fontSize: 8, padding: '10px 12px' }}>▶ RUN NOW →</Link>
                <span className="trm-tag" style={{ fontSize: 10, fontWeight: 800, border: '2px solid var(--t-ink)', padding: '5px 8px', background: 'var(--t-panel2)' }}>shares with one link</span>
              </div>
            </div>
          </div>
          <div className="trm-pane">
            <div className="trm-pane-head"><span className="trm-pane-title">~/arena</span><span className="trm-pane-meta">RANKED</span></div>
            <div className="trm-pane-body">
              <div className="trm-rows">
                {LEADERS.map((r, i) => (
                  <div key={r.n} className={`trm-row${r.you ? ' you' : ''}`}>
                    <span className="rk">{i + 1}</span><span>{r.n}</span>
                    <span className="xp">{r.x} · {r.d}</span>
                  </div>
                ))}
              </div>
              <Link href="/app/arena" className="trm-btn trm-btn-ghost" style={{ fontSize: 8, padding: '10px 12px', marginTop: 'auto' }}>queue for a duel →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="trm-man" id="man">
        <div className="trm-man-inner">
          <div className="trm-man-top"><span>PIXELCODE(1) — THE BEGINNER MACHINE</span><span>BEIGE COMPUTER CLUB</span></div>
          <h2>NAME</h2>
          <p>pixelcode — a beginner-first platform to learn 13+ languages, write and run real code, duel for XP, and get unstuck from an AI tutor that never sleeps.</p>
          <h2>SYNOPSIS</h2>
          <span className="trm-speccmd">$ pixelcode --courses --playground --duels --classrooms --tutor</span>
          <h2>FEATURE INDEX</h2>
          <div className="trm-man-grid">
            {FEATURES.map(f => (
              <div className="trm-man-item" key={f.n}>
                <b>{f.n}</b>
                <div><h3>{f.t}</h3><p>{f.d}</p></div>
              </div>
            ))}
          </div>
          <h2>SEE ALSO</h2>
          <div className="trm-man-seealso">
            <Link href="/app/courses">courses(1)</Link>
            <Link href="/app/playground">playground(1)</Link>
            <Link href="/app/training">challenges(1)</Link>
            <Link href="/app/arena">arena(1)</Link>
            <Link href="/app/classroom">classroom(8)</Link>
            <Link href="/app/library">library(7)</Link>
          </div>
        </div>
      </section>

      <section className="trm-session" id="session">
        <div className="trm-session-inner">
          <div className="trm-session-intro">
            <span className="trm-dot" style={{ background: 'var(--t-yellow)' }} />
            <h2 className="trm-h2" style={{ marginTop: 10 }}>ONE SHELL.<br />THIRTEEN DIALECTS.</h2>
            <p>Start anywhere, switch anytime — your XP follows you. Everything below is already wired in the playground; nothing to download, nothing to configure.</p>
          </div>
          <div className="trm-terminal-shell">
            <div className="trm-shell-head"><span>admin@pixelcode: ~/languages</span><span>80×24</span></div>
            <div className="trm-shell-body">
              {SESSION.map(([cmd, res], i) => (
                <div className="trm-shell-line" key={i}><span className="cmd">$ {cmd}</span><span className="res">{res}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trm-windows" id="windows">
        <div className="trm-windows-grid">
          <div className="trm-win">
            <div className="trm-pane-head"><span className="trm-pane-title">~/classrooms</span><span className="trm-pane-meta">TEACHERS</span></div>
            <div className="trm-win-body">
              <h3>Teacher-led. Student-paced.</h3>
              <p>Invite the class with one code, hand out assignments, and watch completion climb on a shared progress board.</p>
              <div className="trm-tags"><span className="trm-tag">Invite by code</span><span className="trm-tag hot">Progress board</span><span className="trm-tag">Assignments</span></div>
            </div>
          </div>
          <div className="trm-win">
            <div className="trm-pane-head"><span className="trm-pane-title">~/library</span><span className="trm-pane-meta">DOCS</span></div>
            <div className="trm-win-body">
              <h3>Answers, not rabbit holes.</h3>
              <p>Cheatsheets, glossary entries and runnable examples — searchable, skimmable and written for people who just started.</p>
              <div className="trm-tags"><span className="trm-tag">Cheatsheets</span><span className="trm-tag acc">Glossary</span><span className="trm-tag">Examples</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="trm-cta" id="cta">
        <p className="cmdline">$ signup --free --now</p>
        <p className="note">free forever · no credit card · CRT included</p>
        <Link href={cta} className="trm-btn">▶ RUN IT →</Link>
      </section>

      <footer className="trm-footer">
        <div className="trm-footer-inner">
          <div className="trm-exit">PIXELCODE TTY1</div>
          <div className="trm-footer-links">
            <a href="#man">Features</a>
            <a href="#session">Languages</a>
            <a href="mailto:hello@pixelcode.camp">hello@pixelcode.camp</a>
          </div>
          <div className="trm-exit">exit 0</div>
        </div>
        <div className="trm-footer-bottom">
          <span>© {new Date().getFullYear()} PIXELCODE · BEIGE COMPUTER CLUB</span>
          <span>MADE WITH ◆ PIXELS AND SCANLINES</span>
        </div>
      </footer>
    </div>
  );
}
