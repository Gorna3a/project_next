'use client';

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Terminal,
  Trophy,
  Bot,
  Flame,
  Star,
  Zap,
  TrendingUp,
  Users,
  UserPlus,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../../core/hooks/useAuth";
import { useLanguage } from "../../../core/context/LanguageContext";
import { AvatarPicker } from "../../../shared/ui/AvatarPicker";
import { socialService } from "../../../core/services/socialService";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const XP_PER_LEVEL = 1000;

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const name = profile?.displayName?.split(" ")[0] ?? "Coder";
  const xp = profile?.totalXP ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const xpPercent = (xpIntoLevel / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel;

  useEffect(() => {
    if (profile && !profile.photoURL) {
      const timer = setTimeout(() => setShowAvatarPicker(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [profile]);
  useEffect(() => {
    if (!user) return;
    socialService.getFriends(user.uid).then((f) => setFriends(f.slice(0, 5)));
    socialService.getFriendRequests(user.uid).then(setRequests);
  }, [user]);

  const greeting = t("dashboard.welcome");

  return (
    <>
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-[1px]">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}>
              <div className="bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000]">
                <AvatarPicker uid={user!.uid} onComplete={() => setShowAvatarPicker(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto pb-12 space-y-6">
        {/* ── Masthead — newspaper brutalism ──────────────────────────────── */}
        <motion.div variants={fadeUp} className="bg-black text-white border-[3px] border-black flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em]">PIXEL CODE — DASHBOARD // ISSUE #001</span>
          <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest bg-white text-black px-2 py-1 border-[2px] border-white">
            <span className="w-2 h-2 bg-[#FFD23F] border border-black" /> SYSTEM READY • LVL {level} • {xp.toLocaleString()} XP
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
            {new Date().toLocaleDateString("en-GB").toUpperCase()}
          </span>
        </motion.div>

        {/* ── Hero — hard bento, not soft gradient ────────────────────────── */}
        <motion.div variants={fadeUp} className="grid lg:grid-cols-[1.35fr_0.85fr] gap-4">
          {/* left: greeting + XP */}
          <div className="relative bg-[#FFD23F] border-[3px] border-black shadow-[6px_6px_0_0_#000] p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white border-[3px] border-black rotate-12 hidden md:grid place-items-center shadow-[4px_4px_0_0_#000]">
              <span className="font-black text-5xl leading-none text-black" style={{ fontFamily: "'Syne', sans-serif" }}>
                {level}
              </span>
              <span className="font-mono text-[9px] font-black uppercase tracking-widest -mt-1">LVL</span>
            </div>
            <div className="relative">
              <p className="font-mono text-[11px] font-black uppercase tracking-[0.18em] text-black/60">{greeting.toUpperCase()} —</p>
              <h1 className="mt-1 font-black text-[40px] md:text-[48px] leading-[0.9] tracking-tighter text-black" style={{ fontFamily: "'Syne', sans-serif" }}>
                {name}
                <span className="ml-2 inline-flex translate-y-[-2px] bg-black text-white border-[3px] border-black px-2.5 py-1 text-[22px] leading-none rotate-[-1.5deg] shadow-[3px_3px_0_0_#000]">✦</span>
              </h1>
              <div className="mt-5 max-w-[420px] bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_0_#000]">
                <div className="flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  <span>LEVEL {level}</span>
                  <span>{xpPercent.toFixed(0)}% • {xp.toLocaleString()} XP</span>
                </div>
                <div className="mt-2 h-[16px] bg-white border-[3px] border-black p-[3px] flex gap-[3px]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className={`flex-1 h-full ${i < Math.round((xpPercent / 100) * 20) ? "bg-black" : "bg-black/10"}`} />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-widest text-black">{xpToNextLevel} XP → NEXT LEVEL</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-black" />
          </div>

          {/* right: streak + rank as hard tickets */}
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-[#FF6B6B] border-[3px] border-black shadow-[6px_6px_0_0_#000] p-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/70">Day Streak</p>
                <p className="font-black text-4xl leading-none tracking-tight text-black flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <Flame className="w-7 h-7 text-black" /> {streak}
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 mt-1">KEEP IT BURNING</p>
              </div>
              <div className="hidden sm:grid place-items-center w-16 h-16 bg-white border-[3px] border-black rotate-[-2deg] shadow-[3px_3px_0_0_#000]">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
            <div className="bg-[#74B9FF] border-[3px] border-black shadow-[6px_6px_0_0_#000] p-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/70">Global Rank</p>
                <p className="font-black text-4xl leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  #12
                </p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 mt-1">TOP 3% THIS WEEK</p>
              </div>
              <div className="w-16 h-16 bg-black text-white border-[3px] border-black grid place-items-center rotate-[1.5deg] shadow-[3px_3px_0_0_#000]">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Requests — hard inline alert ────────────────────────────────── */}
        {requests.length > 0 && (
          <motion.div variants={fadeUp} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-0 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <span className="w-11 h-11 bg-[#88D498] border-[3px] border-black grid place-items-center shrink-0">
                <UserPlus className="w-5 h-5 text-black" />
              </span>
              <span>
                <span className="block font-mono text-xs font-black uppercase tracking-widest text-black">
                  {t("profile.requests")} • {requests.length}
                </span>
                <span className="block font-mono text-[11px] font-bold text-black/60">{t("profile.pendingRequests").replace("{count}", String(requests.length))}</span>
              </span>
            </div>
            <button onClick={() => navigate.push("/app/profile?tab=friends")} className="sm:ml-auto bg-black text-white border-t-[3px] sm:border-t-0 sm:border-l-[3px] border-black px-6 py-4 font-mono text-xs font-black uppercase tracking-widest hover:bg-[#FFD23F] hover:text-black transition-colors flex items-center justify-center gap-2">
              {t("common.review")} <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* ── Stats — 2x2 hard bento, rotated ─────────────────────────────── */}
        <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t("dashboard.totalXP"), value: xp.toLocaleString(), bg: "bg-[#FFD23F]", icon: Star, rot: "rotate-[-0.6deg]" },
            { label: t("dashboard.level"), value: String(level), bg: "bg-white", icon: Zap, rot: "rotate-[0.7deg]" },
            { label: t("dashboard.dayStreak"), value: `${streak}`, bg: "bg-white", icon: Flame, rot: "rotate-[-0.8deg]" },
            { label: t("dashboard.rank"), value: "#12", bg: "bg-[#88D498]", icon: Trophy, rot: "rotate-[0.5deg]" },
          ].map(({ label, value, bg, icon: Icon, rot }) => (
            <motion.div key={label} variants={fadeUp} className={`${bg} border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 ${rot} hover:rotate-0 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#000] transition-all`}>
              <span className="inline-flex items-center gap-1.5 bg-black text-white border-[2px] border-black px-2 py-1 font-mono text-[9px] font-black uppercase tracking-widest">
                <Icon className="w-3 h-3" /> {label}
              </span>
              <span className="block mt-3 font-black text-3xl leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main 2-col ──────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick actions — brutalist big buttons, 0 radius, 3px/5px */}
            <motion.div variants={fadeUp}>
              <h2 className="inline-flex items-center gap-2 bg-black text-white border-[3px] border-black px-3 py-1 font-mono text-[11px] font-black uppercase tracking-widest mb-3">
                <span className="w-2 h-2 bg-[#FFD23F] border border-white" /> {t("dashboard.quickActions")}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { to: "/app/courses", icon: BookOpen, label: t("nav.courses"), bg: "bg-[#FFD23F]", sub: "LEARN →" },
                  { to: "/app/ide", icon: Terminal, label: t("nav.ide"), bg: "bg-[#88D498]", sub: "CODE →" },
                  { to: "/app/arena/training", icon: Trophy, label: t("nav.arena"), bg: "bg-[#FF6B6B]", sub: "BATTLE →" },
                  { to: "/app/chat", icon: Bot, label: t("nav.chat"), bg: "bg-[#B8A9FA]", sub: "ASK →" },
                ].map(({ to, icon: Icon, label, bg, sub }) => (
                  <Link key={to} href={to} className={`${bg} border-[3px] border-black shadow-[5px_5px_0_0_#000] p-5 flex flex-col gap-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group`}>
                    <span className="w-11 h-11 bg-black border-[2px] border-black grid place-items-center group-hover:rotate-[-3deg] transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </span>
                    <span className="font-black text-sm leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
                    <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black">{sub}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent activity — hard newspaper list */}
            <motion.div variants={fadeUp}>
              <h2 className="inline-flex items-center gap-2 bg-black text-white border-[3px] border-black px-3 py-1 font-mono text-[11px] font-black uppercase tracking-widest mb-3">
                <span className="w-2 h-2 bg-white" /> {t("dashboard.recentActivity")}
              </h2>
              <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] divide-y-[3px] divide-black overflow-hidden">
                {[
                  { icon: "📚", text: t("dashboard.activityEmpty"), sub: t("dashboard.getStarted"), to: "/app/courses", stripe: "bg-[#FFD23F]" },
                  { icon: "⚡", text: t("dashboard.playgroundPromo"), sub: t("dashboard.openPlayground"), to: "/app/ide", stripe: "bg-[#74B9FF]" },
                  { icon: "🏆", text: t("dashboard.challengePromo"), sub: t("dashboard.browseChallenges"), to: "/app/arena/training", stripe: "bg-[#FF6B6B]" },
                ].map((item, i) => (
                  <Link key={i} href={item.to} className="flex items-center gap-4 p-4 hover:bg-black hover:text-white group transition-colors">
                    <span className={`w-11 h-11 ${item.stripe} border-[3px] border-black grid place-items-center text-lg shrink-0 group-hover:bg-white transition-colors`}>{item.icon}</span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className={`block font-bold text-sm leading-tight ${isRTL ? "text-right" : "text-left"} group-hover:text-white`} style={{ fontFamily: "'Inter', sans-serif" }}>{item.text}</span>
                      <span className={`block font-mono text-[10px] font-black uppercase tracking-widest mt-1 ${isRTL ? "text-right" : "text-left"} text-black/60 group-hover:text-white/70`}>{item.sub} →</span>
                    </span>
                    <span className="hidden sm:grid place-items-center w-8 h-8 bg-white border-[2px] border-black group-hover:bg-[#FFD23F] transition-colors">
                      <ChevronRight className={`w-4 h-4 text-black ${isRTL ? "rotate-180" : ""}`} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar — hard cards ────────────────────────────────────── */}
          <div className="space-y-6">
            <motion.div variants={fadeUp} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] overflow-hidden">
              <div className="bg-[#74B9FF] border-b-[3px] border-black px-4 py-3 flex items-center justify-between gap-3">
                <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black">{t("dashboard.codersOnline")}</h3>
                <Link href="/app/profile?tab=friends" className="bg-black text-white border-[2px] border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  {t("common.viewAll")} →
                </Link>
              </div>
              <div className="p-5 space-y-3">
                {friends.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t("dashboard.noFriends")}</p>
                    <Link href="/app/arena/rankings" className="inline-flex bg-black text-white border-[2px] border-black px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                      {t("dashboard.findCoders")} →
                    </Link>
                  </div>
                ) : (
                  friends.map((f) => (
                    <div key={f.uid} onClick={() => navigate.push(`/app/profile/${f.uid}`)} className="flex items-center gap-3 border-[2px] border-black p-2 pr-3 hover:bg-[#FFF4CC] cursor-pointer transition-colors">
                      <span className="w-10 h-10 border-[2px] border-black overflow-hidden bg-white shrink-0">
                        <img src={f.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.displayName}`} className="w-full h-full object-cover" alt="" />
                      </span>
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block font-mono text-xs font-black uppercase truncate text-black">{f.displayName}</span>
                        <span className="block font-mono text-[10px] font-bold uppercase text-black/60">LVL {f.level}</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 text-black ${isRTL ? "rotate-180" : ""}`} />
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 pt-0">
                <Link href="/app/arena/rankings" className="flex items-center justify-center gap-2 w-full bg-[#FFD23F] border-[3px] border-black py-3 font-mono text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                  <Users className="w-4 h-4" /> {t("dashboard.globalLeaderboard")}
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-black border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 text-white">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 bg-[#FFD23F] border-[2px] border-white grid place-items-center">
                  <Trophy className="w-5 h-5 text-black" />
                </span>
                <span>
                  <span className="block font-mono text-[10px] font-black uppercase tracking-widest text-white/60">Next Achievement</span>
                  <span className="block font-black text-sm leading-none text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("arena.arenaGladiator")}</span>
                </span>
              </div>
              <div className="mt-4 bg-white border-[2px] border-white p-2">
                <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  <span>{t("arena.win3Duels")}</span>
                  <span>1/3</span>
                </div>
                <div className="mt-2 h-[14px] bg-white border-[2px] border-black p-1 flex gap-1">
                  <span className="flex-1 bg-black" />
                  <span className="flex-1 bg-black/15" />
                  <span className="flex-1 bg-black/15" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom ticker — maximalist brutalism ────────────────────────── */}
        <motion.div variants={fadeUp} className="bg-[#FFD23F] border-[3px] border-black shadow-[4px_4px_0_0_#000] overflow-hidden py-2.5">
          <div className="flex whitespace-nowrap font-mono text-[11px] font-black uppercase tracking-[0.16em] text-black animate-[marquee_18s_linear_infinite]">
            <span>PIXEL CODE • HARD SHADOWS • THICK BORDERS • 0 RADIUS • FLAT COLOR • BOLD TYPE • VISIBLE STRUCTURE •&nbsp;</span>
            <span>PIXEL CODE • HARD SHADOWS • THICK BORDERS • 0 RADIUS • FLAT COLOR • BOLD TYPE • VISIBLE STRUCTURE •&nbsp;</span>
          </div>
        </motion.div>
      </motion.div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </>
  );
}
