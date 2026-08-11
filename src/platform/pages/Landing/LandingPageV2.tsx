'use client';

import './neo-brutalism.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import oldComputer from '@/assets/old computer.png';
import {
  ArrowRight, ArrowLeft, Zap, Brain, Trophy,
  GraduationCap, BookOpen, Sparkles, Globe,
  ChevronRight, Cpu,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useAuth } from '../../../core/hooks/useAuth';
import { Logo } from '../../../shared/ui/Logo';

// ─── Floating Pixel Squares ───────────────────────────────────────────────────

const FloatingPixels = () => {
  const squares = [
    { color: '#ffe600', size: 20, top: '12%', left: '5%',  dur: '5s',  delay: '0s' },
    { color: '#ff2d55', size: 14, top: '25%', left: '90%', dur: '4s',  delay: '0.5s' },
    { color: '#0055ff', size: 24, top: '60%', left: '8%',  dur: '6s',  delay: '1s' },
    { color: '#00e676', size: 16, top: '75%', left: '85%', dur: '4.5s',delay: '0.3s' },
    { color: '#b400ff', size: 12, top: '40%', left: '94%', dur: '7s',  delay: '2s' },
    { color: '#ff6d00', size: 18, top: '88%', left: '15%', dur: '5.5s',delay: '1.5s' },
    { color: '#00e5ff', size: 22, top: '5%',  left: '75%', dur: '6.5s',delay: '0.7s' },
    { color: '#ff3ea5', size: 14, top: '50%', left: '2%',  dur: '3.5s',delay: '2.5s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {squares.map((s, i) => (
        <div
          key={i}
          className="nb-pixel-sq"
          style={{
            background: s.color,
            width: s.size,
            height: s.size,
            top: s.top,
            left: s.left,
            '--dur': s.dur,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};



// ─── Marquee bar content ──────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '★ LEARN TO CODE',
  '★ PIXEL BY PIXEL',
  '★ AI TUTORING',
  '★ LIVE COMPILER',
  '★ 13+ LANGUAGES',
  '★ FREE FOREVER',
  '★ DAILY CHALLENGES',
  '★ CLASSROOMS',
  '★ LEARN TO CODE',
  '★ PIXEL BY PIXEL',
  '★ AI TUTORING',
  '★ LIVE COMPILER',
  '★ 13+ LANGUAGES',
  '★ FREE FOREVER',
  '★ DAILY CHALLENGES',
  '★ CLASSROOMS',
];

// ─── Features data ────────────────────────────────────────────────────────────

const FEATURES = [
  { key: 'aiTutor',     icon: Brain,        bg: '#b400ff', fg: '#fffef7', accent: '#ffe600' },
  { key: 'liveCompiler',icon: Zap,          bg: '#ffe600', fg: '#0d0d0d', accent: '#ff2d55' },
  { key: 'challenges',  icon: Trophy,       bg: '#ff2d55', fg: '#fffef7', accent: '#ffe600' },
  { key: 'classrooms',  icon: GraduationCap,bg: '#0055ff', fg: '#fffef7', accent: '#00e5ff' },
  { key: 'courses',     icon: BookOpen,     bg: '#00e676', fg: '#0d0d0d', accent: '#0055ff' },
  { key: 'kidsMode',    icon: Sparkles,     bg: '#ff3ea5', fg: '#fffef7', accent: '#ffe600' },
];

// ─── Languages data ───────────────────────────────────────────────────────────

const LANGUAGES = [
  { name: 'Python',     emoji: '🐍', bg: '#0055ff', fg: '#fffef7' },
  { name: 'JavaScript', emoji: '⚡', bg: '#ffe600', fg: '#0d0d0d' },
  { name: 'TypeScript', emoji: '📘', bg: '#00e5ff', fg: '#0d0d0d' },
  { name: 'Java',       emoji: '☕', bg: '#ff2d55', fg: '#fffef7' },
  { name: 'C',          emoji: '⚙️', bg: '#0d0d0d', fg: '#ffe600' },
  { name: 'C++',        emoji: '🔧', bg: '#b400ff', fg: '#fffef7' },
  { name: 'Go',         emoji: '🐹', bg: '#00e676', fg: '#0d0d0d' },
  { name: 'Rust',       emoji: '🦀', bg: '#ff6d00', fg: '#fffef7' },
  { name: 'Kotlin',     emoji: '🎯', bg: '#b400ff', fg: '#fffef7' },
  { name: 'Swift',      emoji: '🍎', bg: '#ff6d00', fg: '#fffef7' },
  { name: 'C#',         emoji: '🎮', bg: '#0055ff', fg: '#fffef7' },
  { name: 'Ruby',       emoji: '💎', bg: '#ff2d55', fg: '#fffef7' },
  { name: 'PHP',        emoji: '🐘', bg: '#00e676', fg: '#0d0d0d' },
];

// ─── Language Switcher ────────────────────────────────────────────────────────

const NbLanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="nb-btn nb-btn-outline flex items-center gap-1.5"
        style={{ fontSize: '0.65rem', padding: '0.5rem 0.8rem' }}
      >
        <Globe className="w-4 h-4" />
        <span>{language.toUpperCase()}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 z-50"
            style={{
              background: '#fffef7',
              border: '3px solid #0d0d0d',
              boxShadow: '4px 4px 0 #0d0d0d',
              minWidth: 140,
              padding: '0.5rem',
            }}
          >
            {[
              { id: 'en', label: 'English', flag: '🇺🇸' },
              { id: 'ar', label: 'العربية', flag: '🇸🇦' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => { setLanguage(lang.id as 'en' | 'ar'); setOpen(false); }}
                className="nb-mono flex items-center gap-2 w-full px-3 py-2 text-xs font-bold"
                style={{
                  background: language === lang.id ? '#ffe600' : 'transparent',
                  border: language === lang.id ? '2px solid #0d0d0d' : '2px solid transparent',
                  color: '#0d0d0d',
                  cursor: 'pointer',
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sparkle decoration ───────────────────────────────────────────────────────

const SparkleDecor = ({ style }: { style?: React.CSSProperties }) => (
  <span
    className="nb-sparkle select-none pointer-events-none"
    style={{ fontSize: '1.2rem', ...style }}
    aria-hidden
  >
    ✦
  </span>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPageV2() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  return (
    <div className={`nb-root nb-grid-bg ${isRTL ? 'text-right' : 'text-left'}`}>

      {/* ── Navbar ── */}
      <header className="nb-nav">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Logo />

          <nav className={`hidden md:flex items-center gap-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
            <a
              href="#features"
              className="nb-mono font-bold text-xs px-3.5 py-2"
              style={{
                border: '2px solid #0d0d0d',
                background: '#fffef7',
                color: '#0d0d0d',
                boxShadow: '3px 3px 0 #0d0d0d',
              }}
            >
              {t('landing.features')}
            </a>
            <a
              href="#languages"
              className="nb-mono font-bold text-xs px-3.5 py-2"
              style={{
                border: '2px solid #0d0d0d',
                background: '#fffef7',
                color: '#0d0d0d',
                boxShadow: '3px 3px 0 #0d0d0d',
              }}
            >
              {t('landing.languages')}
            </a>
            <Link
              href="/about"
              className="nb-mono font-bold text-xs px-3.5 py-2"
              style={{
                border: '2px solid #0d0d0d',
                background: '#fffef7',
                color: '#0d0d0d',
                boxShadow: '3px 3px 0 #0d0d0d',
              }}
            >
              {t('landing.about')}
            </Link>
          </nav>

          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-3`}>
            <NbLanguageSwitcher />
            {/* Theme switch links */}
            <Link
              href="/v3"
              className="nb-btn nb-btn-outline hidden sm:inline-flex"
              style={{ fontSize: '0.65rem', padding: '0.5rem 0.85rem' }}
            >
              ✦ Minimal
            </Link>
            <Link
              href="/classic"
              className="nb-btn nb-btn-outline hidden sm:inline-flex"
              style={{ fontSize: '0.65rem', padding: '0.5rem 0.85rem' }}
            >
              ← Classic
            </Link>
            {user ? (
              <Link href="/app" className="nb-btn nb-btn-black">
                Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/signup" className="nb-btn nb-btn-black">
                Start Free <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Marquee bar ── */}
      <div className="nb-marquee-bar">
        <div className="nb-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} style={{ padding: '0 2rem', borderRight: '3px solid #ffe600' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ borderBottom: '3px solid #0d0d0d' }}>
        <FloatingPixels />

        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className="nb-badge"
                style={{ background: '#ffe600', color: '#0d0d0d' }}
              >
                <Cpu className="w-4 h-4" />
                {t('landing.nowWithAi')}
                <SparkleDecor style={{ fontSize: '0.9rem', animationDelay: '0.5s' }} />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="nb-pixel font-bold"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.6rem)', lineHeight: 1.5, color: '#0d0d0d' }}
            >
              <span
                className="nb-glitch"
                data-text="CODE"
                style={{ color: '#0d0d0d' }}
              >
                CODE
              </span>
              {' '}
              <span style={{ color: '#0055ff', display: 'inline-block', textDecoration: 'underline', textDecorationColor: '#ffe600', textDecorationThickness: 6 }}>PIXEL</span>
              <br />
              <span style={{ color: '#ff2d55' }}>BY</span>
              {' '}
              <span style={{ color: '#0d0d0d' }}>PIXEL</span>
              {' '}
              <SparkleDecor style={{ fontSize: '1.2rem', animationDelay: '0.8s' }} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="nb-mono text-base font-bold leading-relaxed max-w-lg"
              style={{ color: '#2a2a2a' }}
            >
              {t('landing.heroSub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Link
                href={user ? '/app' : '/signup'}
                className="nb-btn nb-btn-yellow"
                style={{ fontSize: '0.75rem', padding: '1rem 1.8rem' }}
              >
                {user ? t('landing.goDashboard') : t('landing.startFree')}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link
                href="/kids"
                className="nb-btn nb-btn-red"
                style={{ fontSize: '0.75rem', padding: '1rem 1.8rem' }}
              >
                👾 {t('landing.kidsMode')}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="nb-mono text-xs font-bold"
              style={{ color: '#555' }}
            >
              ★ {t('landing.freeForever')}
            </motion.p>
          </motion.div>

          {/* Old computer image */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: -1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src={oldComputer}
                alt="Old computer"
                className="w-full max-w-md h-auto"
                style={{ imageRendering: 'pixelated' }}
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ borderBottom: '3px solid #0d0d0d', background: '#0d0d0d' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-0">
          {[
            { value: '13+',    label: t('landing.stats.languages'), color: '#ffe600' },
            { value: '10K+',   label: t('landing.stats.exercises'), color: '#ff2d55' },
            { value: 'AI ✦',   label: t('landing.stats.aiTutoring'), color: '#00e676' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center py-6"
              style={{
                borderRight: i < 2 ? '3px solid #ffe600' : 'none',
              }}
            >
              <div
                className="nb-pixel font-bold"
                style={{ fontSize: 'clamp(1.1rem, 3.5vw, 2rem)', color: stat.color, marginBottom: '0.5rem' }}
              >
                {stat.value}
              </div>
              <div
                className="nb-mono text-xs font-bold uppercase tracking-widest"
                style={{ color: '#ccc' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <SparkleDecor style={{ animationDelay: '0.2s' }} />
            <h2
              className="nb-pixel font-bold"
              style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.8rem)', color: '#0d0d0d' }}
            >
              {t('landing.everythingYouNeed')}
            </h2>
            <SparkleDecor style={{ animationDelay: '0.9s' }} />
          </div>
          <p className="nb-mono text-base font-bold" style={{ color: '#444', maxWidth: '550px' }}>
            {t('landing.platformTools')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ key, icon: Icon, bg, fg, accent }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className={`nb-card p-7 ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ background: bg, color: fg }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 flex items-center justify-center mb-6"
                style={{
                  border: '3px solid #0d0d0d',
                  background: accent,
                  color: '#0d0d0d',
                  boxShadow: '4px 4px 0 #0d0d0d',
                }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h3
                className="nb-silkscreen font-bold mb-3"
                style={{ fontSize: '1.05rem', letterSpacing: '0.02em' }}
              >
                {t(`landing.featuresList.${key}.title`)}
              </h3>
              <p
                className="nb-mono text-sm font-medium leading-relaxed"
                style={{ opacity: 0.95 }}
              >
                {t(`landing.featuresList.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Languages ── */}
      <section
        id="languages"
        style={{
          borderTop: '3px solid #0d0d0d',
          borderBottom: '3px solid #0d0d0d',
          background: '#fffef7',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="nb-pixel font-bold mb-4"
              style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)', color: '#0d0d0d' }}
            >
              {t('landing.heroTitle').split(',')[0]}
            </h2>
            <p className="nb-mono text-base font-bold" style={{ color: '#444' }}>
              {t('landing.languages')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3.5"
          >
            {LANGUAGES.map((lang, idx) => (
              <motion.span
                key={lang.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="nb-lang-pill"
                style={{ background: lang.bg, color: lang.fg }}
              >
                <span>{lang.emoji}</span>
                {lang.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="nb-cta-section relative overflow-hidden" style={{ background: '#0055ff' }}>
        <FloatingPixels />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-28 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex justify-center gap-4 mb-4">
              <SparkleDecor style={{ fontSize: '1.5rem', animationDelay: '0s' }} />
              <SparkleDecor style={{ fontSize: '2rem', animationDelay: '0.6s' }} />
              <SparkleDecor style={{ fontSize: '1.2rem', animationDelay: '1.2s' }} />
            </div>
            <h2
              className="nb-pixel font-bold"
              style={{
                fontSize: 'clamp(1.3rem, 3.8vw, 2.2rem)',
                color: '#ffe600',
                textShadow: '4px 4px 0 #0d0d0d',
                lineHeight: 1.5,
              }}
            >
              {t('landing.journeyToday')}
            </h2>
            <p className="nb-mono text-base font-bold max-w-md mx-auto" style={{ color: '#fffef7' }}>
              {t('landing.joinMillions')}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href={user ? '/app' : '/signup'}
                className="nb-btn nb-btn-yellow"
                style={{ fontSize: '0.75rem', padding: '1.1rem 2.2rem' }}
              >
                {user ? t('landing.goDashboard') : t('landing.startFree')}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link
                href="/kids"
                className="nb-btn"
                style={{
                  fontSize: '0.75rem',
                  padding: '1.1rem 2.2rem',
                  background: '#ffe600',
                  color: '#0d0d0d',
                  border: '3px solid #0d0d0d',
                  boxShadow: '5px 5px 0 #0d0d0d',
                }}
              >
                👾 Kids Mode
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="nb-footer">
        <div
          className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <Logo size="sm" />

          <div className="nb-mono text-xs font-bold text-center" style={{ color: '#aaa' }}>
            © {new Date().getFullYear()} PixelCode. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/v3"
              className="nb-mono text-xs font-bold hover:underline"
              style={{ color: '#00e5ff' }}
            >
              ✦ Minimal
            </Link>
            <Link
              href="/classic"
              className="nb-mono text-xs font-bold hover:underline"
              style={{ color: '#ffe600' }}
            >
              ← Classic
            </Link>
            <Link
              href="/kids"
              className="nb-mono text-xs font-bold hover:underline"
              style={{ color: '#00e676' }}
            >
              Kids Mode 👾
            </Link>
          </div>
        </div>

        {/* Bottom pixel row decoration */}
        <div
          style={{
            borderTop: '3px solid #ffe600',
            display: 'flex',
            height: 10,
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i % 3 === 0 ? '#ffe600' : i % 3 === 1 ? '#ff2d55' : '#0055ff',
              }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
