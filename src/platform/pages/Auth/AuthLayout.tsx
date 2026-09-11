'use client';

import { type ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "../../../shared/ui/Logo";
import { useLanguage } from "../../../core/context/LanguageContext";

interface AuthLayoutProps {
  children?: ReactNode;
}

// Route order for slide direction: login=0, signup=1
const ROUTE_ORDER: Record<string, number> = { "/login": 0, "/signup": 1 };

// ─── CRT boot terminal auth shell ────────────────────────────────────────────
// Shared layout inside (auth) route group — stays mounted across /login ↔ /signup
// so AnimatePresence can animate the form swap with a smooth horizontal slide.

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const { t, isRTL } = useLanguage();
  const isLogin = pathname === "/login";
  const compact = !isLogin;

  // track previous route to determine slide direction
  const prevRoute = useRef(pathname);
  const dir = (ROUTE_ORDER[pathname] ?? 0) >= (ROUTE_ORDER[prevRoute.current] ?? 0) ? 1 : -1;
  prevRoute.current = pathname;

  const slidedir = isRTL ? -dir : dir;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-8'} font-sans relative overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "repeating-linear-gradient(transparent 0 3px, rgba(0,0,0,0.05) 3px 4px)" }}
      />
      {/* corner pixels */}
      <div aria-hidden className="pointer-events-none absolute top-8 left-8 w-4 h-4 hidden sm:block" style={{ background: "var(--accent)", border: "3px solid var(--border)" }} />
      <div aria-hidden className="pointer-events-none absolute bottom-8 right-8 w-5 h-5 hidden sm:block" style={{ background: "var(--orange)", border: "3px solid var(--border)" }} />

      {/* Back to Home */}
      <Link
        href="/"
        className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} z-10 flex items-center gap-2 text-xs font-bold group`}
        style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span
          className="p-2 transition-transform group-hover:-translate-x-0.5"
          style={{ backgroundColor: "var(--bg-surface)", border: "3px solid var(--border)", boxShadow: "3px 3px 0 var(--border)" }}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        </span>
        <span className="hidden sm:block uppercase tracking-widest">{t('auth.backToHome')}</span>
      </Link>

      {/* ── CRT card ── */}
      <div
        className="relative w-full max-w-md"
        style={{ backgroundColor: "var(--bg-surface)", border: "4px solid var(--border)", boxShadow: "8px 8px 0 var(--border)" }}
      >
        {/* title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ backgroundColor: "var(--accent)", borderBottom: "4px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 inline-block" style={{ background: "var(--orange)", border: "2px solid var(--border)" }} />
            <span className="w-3 h-3 inline-block" style={{ background: "var(--yellow)", border: "2px solid var(--border)" }} />
            <span className="w-3 h-3 inline-block" style={{ background: "var(--bg-surface)", border: "2px solid var(--border)" }} />
            {/* crossfade title */}
            <AnimatePresence mode="wait">
              <motion.span
                key={pathname}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-[10px] font-extrabold tracking-widest ml-1"
                style={{ color: "var(--accent-text)", fontFamily: "'Press Start 2P', monospace" }}
              >
                {isLogin ? "LOGIN.EXE" : "SIGNUP.EXE"}
              </motion.span>
            </AnimatePresence>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5"
            style={{ color: "var(--accent-text)", border: "2px solid var(--border)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            v1.0
          </span>
        </div>

        {/* phosphor boot strip */}
        <div className={`px-4 ${compact ? 'py-2' : 'py-3'}`} style={{ background: "#0F110F", borderBottom: "4px solid var(--border)" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={pathname}
              initial={{ opacity: 0, x: slidedir * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -slidedir * 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="text-xs font-bold tracking-wider"
              style={{ color: "#BFFF00", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {">"} {isLogin ? "RESUME GAME" : "NEW SAVE FILE"}
              <span className="crt-cursor">▊</span>
            </motion.p>
          </AnimatePresence>
          <p className="text-[10px] mt-1 tracking-widest" style={{ color: "#6B7A60", fontFamily: "'JetBrains Mono', monospace" }}>
            AUTH MODULE — READY · NO CARTRIDGE REQUIRED
          </p>
        </div>

        {/* body — slides horizontally on route change */}
        <div className={compact ? 'p-5' : 'p-6 sm:p-8'}>
          <div className={`flex justify-center ${compact ? 'mb-3' : 'mb-6'}`}>
            <Logo size={compact ? 'sm' : 'md'} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: slidedir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -slidedir * 60 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <h1
                className="text-sm leading-relaxed"
                style={{ fontFamily: "'Press Start 2P', monospace", color: "var(--text-primary)" }}
              >
                {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
              </h1>
              <p
                className={`text-xs font-bold mt-2 ${compact ? 'mb-4' : 'mb-6'}`}
                style={{ color: "var(--text-secondary)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {isLogin ? t('auth.loginSub') : t('auth.signupSub')}
              </p>

              {children}

              {/* mode switch */}
              <div
                className={`${compact ? 'mt-4' : 'mt-6'} flex items-center justify-between gap-3 px-3 py-2`}
                style={{ backgroundColor: "var(--bg-subtle)", border: "3px solid var(--border)" }}
              >
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {isLogin ? t('auth.newHere') : t('auth.oneOfUs')}
                </span>
                <Link href={isLogin ? "/signup" : "/login"} className="btn-secondary !py-2 !px-4 !text-[11px]">
                  {isLogin ? t('auth.signUp') : t('auth.signIn')}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* footer strip */}
      <p
        className={`relative ${compact ? 'mt-3' : 'mt-6'} text-[10px] font-bold tracking-[0.2em] uppercase`}
        style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
      >
        ★ insert coin to continue ★
      </p>

      <style>{`.crt-cursor{display:inline-block;margin-left:4px;animation:crtBlink 1.1s steps(1) infinite}@keyframes crtBlink{50%{opacity:0}}`}</style>
    </div>
  );
};
