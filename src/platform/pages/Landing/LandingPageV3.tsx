'use client';

import './neo-minimal.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import oldComputer from '@/assets/old computer.png';
import {
  ArrowRight, ArrowLeft, Zap, Brain, Trophy,
  GraduationCap, BookOpen, Sparkles, Globe, Cpu,
  Star, ChevronRight,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useAuth } from '../../../core/hooks/useAuth';
import { Logo } from '../../../shared/ui/Logo';

// ─── Pixel Sprite Decorations ─────────────────────────────────────────────────

const PIXEL_SPRITES = [
  { char: '✦', color: '#4f7cff', top: '15%', left: '8%', size: 18, delay: '0s' },
  { char: '⬡', color: '#8b6cf0', top: '70%', left: '93%', size: 14, delay: '0.8s' },
  { char: '◆', color: '#34b892', top: '30%', left: '95%', size: 12, delay: '1.6s' },
  { char: '★', color: '#ff8360', top: '80%', left: '5%', size: 16, delay: '0.4s' },
  { char: '▣', color: '#4f7cff', top: '55%', left: '3%', size: 10, delay: '2s' },
  { char: '◇', color: '#8b6cf0', top: '10%', left: '88%', size: 11, delay: '1.2s' },
];

const SpriteDecorations = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {PIXEL_SPRITES.map((s, i) => (
      <motion.div
        key={i}
        className="nm-sprite nm-sprite-float"
        style={{
          top: s.top,
          left: s.left,
          fontSize: s.size,
          color: s.color,
          animationDelay: s.delay,
          opacity: 0.5,
        }}
        aria-hidden
      >
        {s.char}
      </motion.div>
    ))}
  </div>
);

// ─── Language Switcher ────────────────────────────────────────────────────────

const NmLanguageSwitcher = () => {
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
        className="nm-btn-ghost flex items-center gap-1.5 text-sm rounded-full"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium uppercase">{language}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[140px] rounded-2xl p-2"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--nm-glass-border)',
              boxShadow: '0 8px 30px var(--nm-shadow-strong)',
            }}
          >
            {[
              { id: 'en', label: 'English', flag: '🇺🇸' },
              { id: 'ar', label: 'العربية', flag: '🇸🇦' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => { setLanguage(lang.id as 'en' | 'ar'); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: language === lang.id ? 'var(--nm-bg-soft)' : 'transparent',
                  color: 'var(--nm-text)',
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

// ─── Features data ────────────────────────────────────────────────────────────

const FEATURES = [
  { key: 'aiTutor', icon: Brain, gradient: 'from-blue-500 to-purple-500' },
  { key: 'liveCompiler', icon: Zap, gradient: 'from-yellow-400 to-orange-500' },
  { key: 'challenges', icon: Trophy, gradient: 'from-orange-400 to-red-500' },
  { key: 'classrooms', icon: GraduationCap, gradient: 'from-blue-400 to-cyan-500' },
  { key: 'courses', icon: BookOpen, gradient: 'from-green-400 to-emerald-500' },
  { key: 'kidsMode', icon: Sparkles, gradient: 'from-pink-400 to-purple-500' },
];

// ─── Languages data ───────────────────────────────────────────────────────────

const LANGUAGES = [
  { name: 'Python', emoji: '🐍' },
  { name: 'JavaScript', emoji: '⚡' },
  { name: 'TypeScript', emoji: '📘' },
  { name: 'Java', emoji: '☕' },
  { name: 'C', emoji: '⚙️' },
  { name: 'C++', emoji: '🔧' },
  { name: 'Go', emoji: '🐹' },
  { name: 'Rust', emoji: '🦀' },
  { name: 'Kotlin', emoji: '🎯' },
  { name: 'Swift', emoji: '🍎' },
  { name: 'C#', emoji: '🎮' },
  { name: 'Ruby', emoji: '💎' },
  { name: 'PHP', emoji: '🐘' },
];

// ─── Marquee items ────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  '// LEARN TO CODE', 'PIXEL BY PIXEL',
  'AI-POWERED TUTORING', 'LIVE COMPILER',
  '13+ LANGUAGES', 'FREE FOREVER',
  'DAILY CHALLENGES', 'CLASSROOMS',
  '// LEARN TO CODE', 'PIXEL BY PIXEL',
  'AI-POWERED TUTORING', 'LIVE COMPILER',
  '13+ LANGUAGES', 'FREE FOREVER',
  'DAILY CHALLENGES', 'CLASSROOMS',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPageV3() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="nm-root" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Navbar ── */}
      <header className={`nm-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          <Logo />

          <nav className="hidden md:flex items-center gap-1 ml-4">
            <a href="#features" className="nm-btn-ghost text-sm rounded-full">
              {t('landing.features')}
            </a>
            <a href="#languages" className="nm-btn-ghost text-sm rounded-full">
              {t('landing.languages')}
            </a>
            <Link href="/about" className="nm-btn-ghost text-sm rounded-full">
              {t('landing.about')}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <NmLanguageSwitcher />
            <Link href="/v2" className="nm-btn-ghost text-xs rounded-full nm-pixel" style={{ fontSize: '0.5rem', padding: '0.5rem 0.9rem' }}>
              ✦ Neo-Brutalist
            </Link>
            <Link href="/classic" className="nm-btn-ghost text-xs rounded-full nm-pixel" style={{ fontSize: '0.5rem', padding: '0.5rem 0.9rem' }}>
              ← Classic
            </Link>
            {user ? (
              <Link href="/app" className="nm-btn nm-btn-primary text-sm">
                Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/signup" className="nm-btn nm-btn-primary text-sm">
                Start Free <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Marquee bar ── */}
      <div className="nm-marquee-bar">
        <div className="nm-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="nm-pixel">{item}</span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <SpriteDecorations />

        <div className="nm-section grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="nm-badge nm-badge-pixel">
                <Cpu className="w-3 h-3" style={{ color: 'var(--nm-accent-blue)' }} />
                {t('landing.nowWithAi')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="nm-display"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              {t('landing.heroTitle').split(',')[0]},{' '}
              <span className="nm-gradient-text">pixel</span>{' '}
              {isRTL ? 'بـ' : 'by'}{' '}
              <span className="nm-gradient-text">pixel</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="nm-body"
              style={{ fontSize: '1.1rem', color: 'var(--nm-text-secondary)', maxWidth: '500px' }}
            >
              {t('landing.heroSub')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href={user ? '/app' : '/signup'}
                className="nm-btn nm-btn-primary"
              >
                {user ? t('landing.goDashboard') : t('landing.startFree')}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link href="/kids" className="nm-btn nm-btn-secondary">
                👾 {t('landing.kidsMode')}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs font-medium"
              style={{ color: 'var(--nm-text-secondary)' }}
            >
              <Star className="w-3 h-3 inline mr-1" style={{ color: 'var(--nm-accent-coral)' }} />
              {t('landing.freeForever')}
            </motion.p>
          </motion.div>

          {/* Old computer image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <Image
              src={oldComputer}
              alt="Old computer"
              className="w-full max-w-md h-auto"
              style={{ boxShadow: '0 8px 32px rgba(31,41,61,0.12)' }}
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="nm-section-alt border-y"
        style={{ borderColor: 'var(--nm-glass-border)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '13+', label: t('landing.stats.languages') },
            { value: '10K+', label: t('landing.stats.exercises') },
            { value: 'AI', label: t('landing.stats.aiTutoring') },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="nm-stat-value">{stat.value}</div>
              <div className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: 'var(--nm-text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Features ── */}
      <section id="features" className="nm-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="nm-badge nm-badge-pixel mb-4 inline-block">
            <Sparkles className="w-3 h-3" style={{ color: 'var(--nm-accent-blue)' }} />
            FEATURES
          </span>
          <h2 className="nm-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            {t('landing.everythingYouNeed')}
          </h2>
          <p className="nm-body" style={{ color: 'var(--nm-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            {t('landing.platformTools')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ key, icon: Icon, gradient }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="nm-card p-7"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br shadow-sm" style={{ background: `linear-gradient(135deg, ${gradient.includes('blue') ? 'var(--nm-accent-blue)' : gradient.includes('purple') ? 'var(--nm-accent-purple)' : gradient.includes('yellow') ? '#facc15' : gradient.includes('orange') ? '#fb923c' : gradient.includes('red') ? '#f87171' : gradient.includes('cyan') ? '#22d3ee' : gradient.includes('green') ? '#4ade80' : gradient.includes('emerald') ? '#34d399' : gradient.includes('pink') ? '#f472b6' : 'var(--nm-accent-blue)'})` }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--nm-text)' }}>
                {t(`landing.featuresList.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--nm-text-secondary)' }}>
                {t(`landing.featuresList.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Languages ── */}
      <section id="languages" className="nm-section-alt border-y" style={{ borderColor: 'var(--nm-glass-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="nm-badge nm-badge-pixel mb-4 inline-block">
              ⌨️ LANGUAGES
            </span>
            <h2 className="nm-display mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              {t('landing.heroTitle').split(',')[0]}
            </h2>
            <p className="nm-body" style={{ color: 'var(--nm-text-secondary)' }}>
              {t('landing.languages')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {LANGUAGES.map((lang, idx) => (
              <motion.span
                key={lang.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="nm-lang-pill"
              >
                <span>{lang.emoji}</span>
                {lang.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--nm-accent-blue), var(--nm-accent-purple))' }}>
        <SpriteDecorations />
        <div className="nm-section text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="nm-display" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#fff' }}>
              {t('landing.journeyToday')}
            </h2>
            <p className="nm-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>
              {t('landing.joinMillions')}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href={user ? '/app' : '/signup'}
                className="nm-btn"
                style={{
                  background: '#fff',
                  color: 'var(--nm-accent-blue)',
                  fontWeight: 700,
                }}
              >
                {user ? t('landing.goDashboard') : t('landing.startFree')}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link
                href="/kids"
                className="nm-btn"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                👾 {t('landing.kidsMode')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="nm-footer">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />

          <div className="text-xs font-medium" style={{ color: 'var(--nm-text-secondary)' }}>
            © {new Date().getFullYear()} PixelCode. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/v2" className="nm-pixel text-xs hover:underline" style={{ color: 'var(--nm-accent-blue)', fontSize: '0.45rem' }}>
              ✦ Neo-Brutalist
            </Link>
            <Link href="/classic" className="nm-pixel text-xs hover:underline" style={{ color: 'var(--nm-accent-purple)', fontSize: '0.45rem' }}>
              ← Classic
            </Link>
            <Link href="/kids" className="text-xs font-medium hover:underline" style={{ color: 'var(--nm-text-secondary)' }}>
              Kids Mode 👾
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
