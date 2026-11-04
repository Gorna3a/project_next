'use client';

import './landing-editorial.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import oldComputer from '@/assets/old computer.png';
import { useAuth } from '../../../core/hooks/useAuth';
import { useTheme } from '../../../core/context/ThemeContext';

const INDEX = [
  { n: '01', t: 'COURSES', d: '13+ language tracks, leveled from zero', href: '/app/courses' },
  { n: '02', t: 'PLAYGROUND', d: 'Write and run code in the browser', href: '/app/playground' },
  { n: '03', t: 'DUELS & BOARDS', d: 'Ranked 1v1 battles and XP', href: '/app/arena' },
  { n: '04', t: 'CLASSROOMS', d: 'Teacher-led groups, one board', href: '/app/classroom' },
  { n: '05', t: 'LIBRARY', d: 'Cheatsheets, glossary, examples', href: '/app/library' },
];

const SPEC = [
  { i: '01', lang: 'Python', taste: 'FIRST-CHOICE', proj: 'A tip calculator, then a scraper' },
  { i: '02', lang: 'JavaScript', taste: 'RUNS EVERYWHERE', proj: 'A click-counter game' },
  { i: '03', lang: 'TypeScript', taste: 'TYPES THAT PAY OFF', proj: 'A typed to-do app' },
  { i: '04', lang: 'Go', taste: 'SMALL AND FAST', proj: 'A tiny HTTP server' },
  { i: '05', lang: 'Rust', taste: 'STRICT, REWARDING', proj: 'A command-line decoder' },
  { i: '06', lang: 'Java', taste: 'THE CLASSIC', proj: 'A bank account class' },
  { i: '07', lang: 'C', taste: 'CLOSE TO METAL', proj: 'A pointer walk-through' },
  { i: '08', lang: 'C++', taste: 'C WITH ROOM', proj: 'A vector sandbox' },
  { i: '09', lang: 'Kotlin', taste: 'MODERN JVM', proj: 'A lambda shorthand tour' },
  { i: '10', lang: 'Swift', taste: 'APPLE-NATIVE', proj: 'A guard/optional drill' },
  { i: '11', lang: 'SQL', taste: 'ASK DATA NICELY', proj: 'Filter a store table' },
  { i: '12', lang: 'HTML+CSS', taste: 'THE SKELETON', proj: 'A pixel portfolio card' },
  { i: '13', lang: 'PHP', taste: 'STILL STANDING', proj: 'A contact form echo' },
];

const LEADERS = [
  { n: 'you', x: '1,240 XP', d: '▲ +3', top: true },
  { n: 'sarah.codes', x: '1,180 XP', d: '—' },
  { n: 'pixel_joe', x: '1,102 XP', d: '▼ 1' },
];

const PLAY_CODE = [
  { c: 'cm', s: '# article: your first program' },
  { c: 'kw', s: 'def greet(name):' },
  { c: '', s: '    return f"hi, {name} ✦"' },
  { c: '', s: '' },
  { c: '', s: 'print(greet("future coder"))' },
];

const ARENA_CODE = [
  { c: 'cm', s: '# duel round — beat the clock' },
  { c: 'kw', s: 'def solve(nums):' },
  { c: '', s: '    return sum(n * n for n in nums)' },
  { c: '', s: '' },
  { c: 'cm', s: '# 00:42.3 — submitted ✓  +10 XP' },
];

export default function LandingPageEditorial() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const dark = theme === 'dark';
  const cta = user ? '/app' : '/signup';
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="edi">
      <div className="edi-topline">
        <div className="edi-topline-inner">
          <span>EST. 2026 — BEIGE COMPUTER CLUB</span>
          <span>PAGE 01 · LGTM — 100% OF USERS ACCEPT ALL TERMS OF FUN</span>
          <span>FREE FOREVER</span>
        </div>
      </div>
      <div className="edi-masthead">
        <div className="edi-masthead-inner">
          <h1>PIXELCODE</h1>
          <div className="edi-issue">
            <b>ISSUE 001</b>
            THE BEGINNER&rsquo;S MACHINE<br />
            13+ LANGUAGES · 1 PLAYGROUND · 0 INSTALLS
          </div>
          <div className="edi-barcode" aria-hidden />
        </div>
      </div>

      <nav className="edi-nav">
        <div className="edi-nav-inner">
          <div className="edi-nav-links">
            <a href="#courses">01 · Courses</a>
            <a href="#playground">02 · Playground</a>
            <a href="#arena">03 · Duels</a>
            <a href="#classrooms">04 · Classrooms</a>
            <a href="#index">05 · Index</a>
          </div>
          <div className="edi-nav-right">
            <button className="edi-theme-btn" onClick={() => setTheme(dark ? 'light' : 'dark')}>{mounted && dark ? '☀ LIGHT' : '● DARK'}</button>
            <Link href={cta} className="edi-sub">SUBSCRIBE FREE</Link>
          </div>
        </div>
      </nav>

      <section className="edi-cover">
        <span className="edi-reg tr" aria-hidden /><span className="edi-reg bl" aria-hidden />
        <span className="edi-sticker">FREE<br />FOREVER</span>
        <div className="edi-cover-grid">
          <div>
            <span className="edi-kicker">FEATURE STORY — FIRST BUG, FIRST SHIP</span>
            <h1 className="edi-cover-title">LEARNING TO CODE, <span className="box">FOR REAL</span> — NO SMILE REQUIRED.</h1>
            <p className="edi-cover-stand">PixelCode is the beginner-first studio: structured courses, a playground that is the browser, ranked duels for XP, classrooms for teachers, and an AI tutor on the night shift. Written for people who start at zero.</p>
            <div className="edi-cover-actions">
              <Link href={cta} className="edi-btn">START READING →</Link>
              <Link href="/app/playground" className="edi-btn edi-btn-ghost">SKIP TO PLAYGROUND</Link>
            </div>
            <div className="edi-cover-meta"><span>★ No credit card</span><span>·</span><span>Bite-sized lessons</span><span>·</span><span>Actually runs your code</span></div>
          </div>
          <div className="edi-cover-art">
            <Image src={oldComputer} alt="The PixelCode machine — an old beige computer" width={460} height={340} priority style={{ imageRendering: 'pixelated' }} />
            <p className="edi-caption">STILL THE BEST LEARNING MACHINE EVER MADE</p>
          </div>
        </div>
      </section>

      <section className="edi-index" id="index">
        <div className="edi-index-inner">
          {INDEX.map(item => (
            <Link key={item.n} href={item.href}>
              <span className="num">{item.n}</span>
              <span className="t">{item.t}</span>
              <span className="d">{item.d}</span>
              <span className="arw">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="edi-spread" id="playground">
        <div className="edi-spread-inner">
          <div>
            <span className="edi-kick">SPREAD 02 — THE PLAYGROUND</span>
            <h2>THE MACHINE YOU ALREADY OWN.</h2>
            <p className="body">Everything runs in your browser — 13 runtimes, live output, one share link. No installs, no drivers, no &ldquo;it works on my machine.&rdquo; Open a tab, break something, fix it. That is the whole method.</p>
            <div className="edi-specs">
              <span><b>RUN</b> Instant ⏱ output</span>
              <span><b>SHARE</b> One ⚡ link</span>
              <span><b>TUTOR</b> Inline 🧠 on request</span>
            </div>
          </div>
          <div className="edi-window">
            <div className="edi-window-head"><span>playground.py — PAGE 02</span><span className="btn">▶ RUN</span></div>
            <div className="edi-window-code">
              {PLAY_CODE.map((l, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{l.s || '\u00A0'}</div>)}
            </div>
            <div className="edi-window-foot"><span>stdout ▸</span><b>hi, future coder ✦</b></div>
          </div>
        </div>
      </section>

      <section className="edi-quote">
        <blockquote>
          &ldquo;WRITE CODE ON <b>DAY ONE</b>. NOT WEEK FOUR.&rdquo;
          <cite>— THE PIXELCODE MASTHEAD PROMISE</cite>
        </blockquote>
      </section>

      <section className="edi-spread edi-spread flip" id="courses">
        <div className="edi-spread-inner">
          <div>
            <span className="edi-kick">SPREAD 01 — THE COURSES</span>
            <h2>13 TRACKS. ONE PATH AT A TIME.</h2>
            <p className="body">Leveled paths from absolute zero. Every lesson is bite-sized, checked, and ends in something you built. Your XP, streak and level travel with you across tracks.</p>
            <div className="edi-specs">
              <span><b>LEVELS</b> XP ▲ streaks 🔥</span>
              <span><b>CHECKS</b> Quizzes + ⌁ projects</span>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 10, fontSize: 10, letterSpacing: '.18em', fontWeight: 800 }}>LEADERBOARD — WEEKLY · PAGE 01</div>
            {LEADERS.map((l, i) => (
              <div key={l.n} className={`edi-leader${l.top ? ' top' : ''}`}>
                <span className="rk">{i + 1}</span><span>{l.n}</span><span className="xp">{l.x} · {l.d}</span>
              </div>
            ))}
            <Link href="/app/rankings" className="edi-btn edi-btn-ghost" style={{ fontSize: 8, padding: '10px 12px', marginTop: 6 }}>FULL SPREAD →</Link>
          </div>
        </div>
      </section>

      <section className="edi-spread" id="arena">
        <div className="edi-spread-inner">
          <div>
            <span className="edi-kick">SPREAD 03 — THE ARENA</span>
            <h2>RANKED. 1v1. FOR XP.</h2>
            <p className="body">Daily puzzles and timed duels against a real opponent. Win one, take the ladder. The AI grade keeps it fair; the streak keeps you honest.</p>
            <div className="edi-specs">
              <span><b>DUELS</b> 1v1 ⚔ ranked</span>
              <span><b>GRADER</b> AI ✓ strict</span>
            </div>
          </div>
          <div className="edi-window">
            <div className="edi-window-head"><span>duel/round_03.py — PAGE 03</span><span className="btn">▶ RUN</span></div>
            <div className="edi-window-code">
              {ARENA_CODE.map((l, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{l.s || '\u00A0'}</div>)}
            </div>
            <div className="edi-window-foot"><span>result ▸</span><b>WIN ✦ +10 XP · LADDER 12→9</b></div>
          </div>
        </div>
      </section>

      <section className="edi-spread edi-spread flip" id="classrooms">
        <div className="edi-spread-inner">
          <div>
            <span className="edi-kick">SPREAD 04 — THE CLASSROOMS</span>
            <h2>TEACHER-LED. STUDENT-PACED.</h2>
            <p className="body">Invite the class with one code. Hand out assignments. Watch completion climb on a shared board. Built for teachers who would rather teach than wrangle tools.</p>
            <div className="edi-specs">
              <span><b>INVITE</b> One ⌁ code</span>
              <span><b>BOARD</b> Class ▲ progress</span>
            </div>
          </div>
          <div className="edi-window">
            <div className="edi-window-head"><span>classroom/cs101 — ROSTER</span><span className="btn">24 CR</span></div>
            <div className="edi-window-code" style={{ minHeight: 190 }}>
              <div>CS101 — INTRO TO CODE</div>
              <div className="cm">────────────────────────</div>
              <div>students ......... <span className="kw">24</span></div>
              <div>assignments ...... <span className="kw">12</span></div>
              <div>avg completion ... <span className="or">78%</span> ▲</div>
              <div>join code ........ <span className="kw">PX-482</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="edi-specsheet" id="library">
        <div className="edi-specsheet-inner">
          <span className="edi-kick">SUPPLEMENT — THE SPEC SHEET</span>
          <h2 style={{ fontFamily: "'Silkscreen'", fontSize: 'clamp(21px,2.6vw,30px)', marginTop: 10 }}>13 LANGUAGES. SERIOUS OR SERIOUSLY FUN.</h2>
          <p className="body" style={{ fontSize: 13, fontWeight: 700, color: 'var(--e-muted)', marginTop: 10, lineHeight: 1.75, maxWidth: 560 }}>Pick your entry point below. Technical support: cheatsheets, glossary and runnable examples live in the <Link href="/app/library" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Library</Link>.</p>
          <table className="edi-table">
            <thead>
              <tr><th>№</th><th>LANGUAGE</th><th>ON SET</th><th>FIRST SCENE</th></tr>
            </thead>
            <tbody>
              {SPEC.map(r => (
                <tr key={r.i}>
                  <td>{r.i}</td>
                  <td className="lang">{r.lang}</td>
                  <td>{r.taste}</td>
                  <td>{r.proj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="edi-cta" id="cta">
        <h2>START — <span style={{ background: '#161616', color: 'var(--e-phos)', padding: '4px 10px', display: 'inline-block', transform: 'rotate(-.6deg)' }}>FREE FOREVER</span></h2>
        <p>NO CREDIT CARD. NO ADS. JUST BUGS YOU GET TO KEEP.</p>
        <div className="edi-acts">
          <Link href={cta} className="edi-btn">SUBSCRIBE FREE →</Link>
          <Link href="/app/playground" className="edi-btn edi-btn-ghost">VISIT THE PLAYGROUND</Link>
        </div>
        <div className="edi-cta-barcode" aria-hidden />
      </section>

      <footer className="edi-colophon">
        <div className="edi-colophon-inner">
          <div>
            <div className="brand">PIXELCODE PRESS</div>
            <p>The friendly path from first line to real projects. Brutally simple, weirdly fun, built for beginners and the teachers who guide them.</p>
          </div>
          <div>
            <h4>DEPARTMENTS</h4>
            <nav>
              <Link href="/app/courses">Courses</Link>
              <Link href="/app/playground">Playground</Link>
              <Link href="/app/arena">Arena</Link>
              <Link href="/app/classroom">Classrooms</Link>
              <Link href="/app/library">Library</Link>
            </nav>
          </div>
          <div>
            <h4>LETTERS</h4>
            <nav>
              <a href="mailto:hello@pixelcode.camp">hello@pixelcode.camp</a>
              <a href="#index">Back to index ↑</a>
            </nav>
          </div>
        </div>
        <div className="edi-colophon-bottom">
          <span>© {new Date().getFullYear()} PIXELCODE · PRINTED WITH ◆ PIXELS</span>
          <span>100% BEIGE RECYCLED CRT</span>
          <span>MASTHEAD V4 — EDITORIAL EDITION</span>
        </div>
      </footer>
    </div>
  );
}
