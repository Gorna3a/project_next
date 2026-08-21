import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  Brain,
  Trophy,
  GraduationCap,
  BookOpen,
  Sparkles,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../../core/hooks/useTheme";
import { useLanguage } from "../../../core/context/LanguageContext";
import { Logo } from "../../../shared/ui/Logo";

// ─── Landing Language Switcher ───────────────────────────────────────────────

const LandingLanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold"
        title="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{language}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl shadow-xl border p-2 min-w-[120px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            {[
              { id: 'en', label: 'English', flag: '🇺🇸' },
              { id: 'ar', label: 'العربية', flag: '🇸🇦' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id as any);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold transition-all
                  ${language === lang.id ? 'bg-brand-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
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
import { ThemePicker } from "../../../shared/ui/ThemePicker";
import { UserMenu } from "../../../shared/ui/UserMenu";
import { useAuth } from "../../../core/hooks/useAuth";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    key: 'aiTutor',
    icon: Brain,
    color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  },
  {
    key: 'liveCompiler',
    icon: Zap,
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  },
  {
    key: 'challenges',
    icon: Trophy,
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  {
    key: 'classrooms',
    icon: GraduationCap,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    key: 'courses',
    icon: BookOpen,
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  {
    key: 'kidsMode',
    icon: Sparkles,
    color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  },
];

const LANGUAGES = [
  {
    name: "Python",
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    emoji: "🐍",
  },
  {
    name: "JavaScript",
    color:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
    emoji: "⚡",
  },
  {
    name: "TypeScript",
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    emoji: "📘",
  },
  {
    name: "Java",
    color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
    emoji: "☕",
  },
  {
    name: "C",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    emoji: "⚙️",
  },
  {
    name: "C++",
    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    emoji: "🔧",
  },
  {
    name: "Go",
    color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
    emoji: "🐹",
  },
  {
    name: "Rust",
    color:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    emoji: "🦀",
  },
  {
    name: "Kotlin",
    color:
      "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
    emoji: "🎯",
  },
  {
    name: "Swift",
    color:
      "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
    emoji: "🍎",
  },
  {
    name: "C#",
    color:
      "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
    emoji: "🎮",
  },
  {
    name: "Ruby",
    color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
    emoji: "💎",
  },
  {
    name: "PHP",
    color:
      "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
    emoji: "🐘",
  },
];

// ─── Code snippet mini-editor ─────────────────────────────────────────────────

const CodeSnippet = () => (
  <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-800 font-mono text-sm">
    {/* Window chrome */}
    <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
      <div className="w-3 h-3 rounded-full bg-red-500" />
      <div className="w-3 h-3 rounded-full bg-yellow-500" />
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="ml-3 text-gray-500 text-xs">main.py</span>
    </div>
    {/* Code body */}
    <div className="bg-gray-950 p-5 space-y-1 text-[13px] leading-6">
      <div>
        <span className="text-purple-400">def </span>
        <span className="text-blue-300">learn</span>
        <span className="text-gray-300">(</span>
        <span className="text-orange-300">language</span>
        <span className="text-gray-300">, </span>
        <span className="text-orange-300">days</span>
        <span className="text-gray-300">):</span>
      </div>
      <div className="pl-6">
        <span className="text-gray-500"># pixel by pixel</span>
      </div>
      <div className="pl-6">
        <span className="text-purple-400">return </span>
        <span className="text-orange-300">language</span>
        <span className="text-gray-300"> + </span>
        <span className="text-green-400">" mastered in "</span>
        <span className="text-gray-300"> + </span>
        <span className="text-blue-300">str</span>
        <span className="text-gray-300">(</span>
        <span className="text-orange-300">days</span>
        <span className="text-gray-300">) + </span>
        <span className="text-green-400">" days"</span>
      </div>
      <div className="pt-1">
        <span className="text-blue-300">print</span>
        <span className="text-gray-300">(</span>
        <span className="text-blue-300">learn</span>
        <span className="text-gray-300">(</span>
        <span className="text-green-400">"Python"</span>
        <span className="text-gray-300">, </span>
        <span className="text-yellow-300">30</span>
        <span className="text-gray-300">))</span>
      </div>
      <div className="pt-2 text-green-400 flex items-center gap-1">
        <span className="text-gray-600">{">"}</span>
        <span> Python mastered in 30 days</span>
        <span className="inline-block w-2 h-4 bg-brand-400 animate-pulse ml-0.5" />
      </div>
    </div>
  </div>
);

// ─── Nav Theme Picker ────────────────────────────────────────────────────────

const NavThemePicker = () => {
  const { themeData } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost p-2 rounded-xl flex items-center gap-1"
        title="Change theme"
      >
        <div className="flex gap-0.5">
          {themeData.preview.map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl shadow-xl border p-3"
            style={{
              width: "260px",
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold mb-3 px-1"
              style={{ color: "var(--text-muted)" }}
            >
              CHOOSE THEME
            </p>
            <ThemePicker onSelect={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className={`max-w-7xl mx-auto px-6 h-16 flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Logo linkTo="/" />

          <nav className="hidden md:flex items-center gap-6 ml-4">
            <a
              href="#features"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('landing.features')}
            </a>
            <a
              href="#languages"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('landing.languages')}
            </a>
            <Link
              href="/about"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('landing.about')}
            </Link>
          </nav>

          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex items-center gap-3`}>
            <Link
              href="/v3"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
            >
              ✦ Minimal
            </Link>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
            >
              ✦ Neo-Brutalist
            </Link>
            <LandingLanguageSwitcher />
            <NavThemePicker />
            <UserMenu variant="landing" />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Decorative floating pixel squares */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-sm hero-particle"
              style={{
                width: `${8 + (i % 4) * 6}px`,
                height: `${8 + (i % 4) * 6}px`,
                left: `${(i * 17 + 5) % 90}%`,
                top: `${(i * 23 + 10) % 80}%`,
                background:
                  i % 3 === 0 ? "#6272f5" : i % 3 === 1 ? "#a5bcfd" : "#4141d0",
              }}
              animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className={`max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center relative ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Left copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-medium border border-brand-200 dark:border-brand-800">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                {t('landing.nowWithAi')}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-black leading-tight tracking-tight"
            >
              {t('landing.heroTitle').split(',')[0]},{" "}
              <span className="text-brand-600 dark:text-brand-400">pixel</span>{" "}
              {isRTL ? 'بـ' : 'by'}{" "}
              <span className="text-brand-600 dark:text-brand-400">pixel</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg"
            >
              {t('landing.heroSub')}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Link href={user ? "/app" : "/signup"} className="btn-primary px-6 py-3 text-base">
                {user ? t('landing.goDashboard') : t('landing.startFree')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link href="/kids" className="btn-secondary px-6 py-3 text-base">
                👾 {t('landing.kidsMode')}
              </Link>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs text-gray-400 dark:text-gray-600"
            >
              {t('landing.freeForever')}
            </motion.p>
          </motion.div>

          {/* Right code snippet */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <CodeSnippet />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className={`max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-8 text-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {[
            { value: "13+", label: t('landing.stats.languages') },
            { value: "10,000+", label: t('landing.stats.exercises') },
            { value: "AI", label: t('landing.stats.aiTutoring') },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Features ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            {t('landing.everythingYouNeed')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            {t('landing.platformTools')}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map(({ key, icon: Icon, color }) => (
            <motion.div
              key={key}
              variants={fadeUp}
              className={`card p-8 hover:shadow-xl transition-all hover:-translate-y-1 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg ${isRTL ? 'mr-0 ml-auto' : ''}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">
                {t(`landing.featuresList.${key}.title`)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {t(`landing.featuresList.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Languages ── */}
      <section
        id="languages"
        className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              {t('landing.heroTitle').split(',')[0]}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t('landing.languages')}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {LANGUAGES.map((lang) => (
              <motion.span
                key={lang.name}
                variants={fadeUp}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest ${lang.color} cursor-default select-none shadow-sm transition-transform hover:scale-105`}
              >
                <span>{lang.emoji}</span>
                {lang.name}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center relative">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8 relative z-10"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            {t('landing.journeyToday')}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-500 dark:text-gray-400 max-w-md mx-auto"
          >
            {t('landing.joinMillions')}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex justify-center gap-4 flex-wrap"
          >
            <Link href={user ? "/app" : "/signup"} className={`btn-primary px-8 py-3 text-base ${isRTL ? 'flex-row-reverse' : ''}`}>
              {user ? t('landing.goDashboard') : t('landing.startFree')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" linkTo="/" />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} PixelCode. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/v3"
              className="text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-medium"
            >
              ✦ Minimal
            </Link>
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-medium"
            >
              ✦ Neo-Brutalist
            </Link>
            <Link
              href="/kids"
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              PixelCode for Kids 👾
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
