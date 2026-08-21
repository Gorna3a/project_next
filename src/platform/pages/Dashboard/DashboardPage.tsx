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
} from "lucide-react";
import { useAuth } from "../../../core/hooks/useAuth";
import { useLanguage } from "../../../core/context/LanguageContext";
import { AvatarPicker } from "../../../shared/ui/AvatarPicker";
import { socialService } from "../../../core/services/socialService";

// ─── Animation ──────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

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

  // Quick actions — each gets a distinct flat fill per neubrutalism.com palette
  const quickActions = [
    {
      to: "/app/courses",
      icon: BookOpen,
      label: t("nav.courses"),
      bg: "bg-[#FFD23F]",
      accent: "Courses",
    },
    {
      to: "/app/ide",
      icon: Terminal,
      label: t("nav.ide"),
      bg: "bg-[#88D498]",
      accent: "Code Studio",
    },
    {
      to: "/app/arena/training",
      icon: Trophy,
      label: t("nav.arena"),
      bg: "bg-[#FF6B6B]",
      accent: "Arena",
    },
    {
      to: "/app/chat",
      icon: Bot,
      label: t("nav.chat"),
      bg: "bg-[#B8A9FA]",
      accent: "Smart Chat",
    },
  ] as const;

  return (
    <>
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }}>
              <div className="border-[3px] border-black shadow-[8px_8px_0_0_#000] bg-white">
                <AvatarPicker uid={user!.uid} onComplete={() => setShowAvatarPicker(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* ── Page meta — exposed structure ─────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-black text-[#FFD23F] border-[3px] border-black px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-[#FFD23F] border border-black" /> Dashboard // System Ready
          </span>
          <span className="hidden sm:inline-flex h-[3px] flex-1 bg-black" />
          <span className="inline-flex bg-white border-[3px] border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000]">
            Lvl {level} • {xp.toLocaleString()} XP
          </span>
        </motion.div>

        {/* ── Welcome — hard yellow hero ────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative bg-[#FFD23F] border-[3px] border-black shadow-[8px_8px_0_0_#000] p-7 md:p-9 overflow-hidden"
        >
          {/* subtle grid + noise handled globally, add local hard grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.9) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* rotated level sticker */}
          <div className="absolute right-4 top-4 hidden md:flex items-center gap-2 bg-[#FF6B6B] border-[3px] border-black px-3 py-1.5 shadow-[3px_3px_0_0_#000] rotate-[1.5deg]">
            <span className="w-2.5 h-2.5 bg-black" />
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-black">Level {level} • {streak}🔥</span>
          </div>
          {/* big watermark */}
          <div className="pointer-events-none absolute -right-6 -bottom-8 hidden lg:block select-none">
            <span className="font-black text-[92px] leading-none tracking-tighter text-black/[0.06]" style={{ fontFamily: "'Syne', sans-serif" }}>
              PIXEL
            </span>
          </div>

          <div className="relative">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.2em] text-black/60">{greeting} —</p>
            <h1 className="mt-1 font-black text-4xl md:text-[44px] leading-none tracking-tight text-black" style={{ fontFamily: "'Syne', sans-serif" }}>
              {name}
              <span className="ml-3 inline-flex items-center justify-center bg-black text-[#FFD23F] border-[3px] border-black px-3 py-1 text-3xl md:text-[34px] rotate-[-1deg] shadow-[3px_3px_0_0_#000]">
                👋
              </span>
            </h1>

            {/* XP — hard progress */}
            <div className="mt-6 max-w-[420px] bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4">
              <div className="flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-widest text-black">
                <span>Level {level}</span>
                <span>{xpPercent.toFixed(0)}% • {xp.toLocaleString()} XP</span>
              </div>
              <div className="mt-2 h-[18px] bg-white border-[3px] border-black p-1 flex">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-widest text-black">
                {xpToNextLevel} XP TO NEXT LEVEL →
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-black" />
        </motion.div>

        {/* ── Requests — hard alert ─────────────────────────────────────────── */}
        {requests.length > 0 && (
          <motion.div variants={fadeUp} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6B6B] border-[3px] border-black flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t("profile.requests")} • {requests.length}</p>
                <p className="font-mono text-[11px] font-bold text-black/60">{t("profile.pendingRequests").replace("{count}", requests.length.toString())}</p>
              </div>
            </div>
            <button
              onClick={() => navigate.push("/app/profile?tab=friends")}
              className="w-full sm:w-auto bg-black text-[#FFD23F] border-[3px] border-black px-6 py-2.5 font-mono text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              {t("common.review")} →
            </button>
          </motion.div>
        )}

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stat cards — 4 flat fills, hard shadows */}
            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Star, label: t("dashboard.totalXP"), value: xp.toLocaleString(), bg: "bg-[#FFD23F]", border: "border-black" },
                { icon: Zap, label: t("dashboard.level"), value: String(level), bg: "bg-[#FF6B6B]", border: "border-black" },
                { icon: Flame, label: t("dashboard.dayStreak"), value: `${streak}🔥`, bg: "bg-[#74B9FF]", border: "border-black" },
                { icon: TrendingUp, label: t("dashboard.rank"), value: "#12", bg: "bg-[#88D498]", border: "border-black" },
              ].map(({ icon: Icon, label, value, bg }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`${bg} border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 flex flex-col gap-3`}
                >
                  <span className="w-9 h-9 bg-black border-[2px] border-black flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </span>
                  <span className="font-black text-3xl leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {value}
                  </span>
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/70 leading-none">{label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick actions — big square brutalist buttons */}
            <motion.div variants={fadeUp}>
              <h2 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-black mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="w-2 h-6 bg-black" /> {t("dashboard.quickActions")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map(({ to, icon: Icon, label, bg }) => (
                  <Link
                    key={to}
                    href={to}
                    className={`${bg} border-[3px] border-black shadow-[5px_5px_0_0_#000] p-5 flex flex-col items-center gap-3 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_0_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all text-center`}
                  >
                    <span className="w-12 h-12 bg-black border-[2px] border-black flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </span>
                    <span className="font-mono text-[11px] font-black uppercase tracking-widest text-black leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent activity — hard list, not soft card */}
            <motion.div variants={fadeUp}>
              <h2 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-black mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="w-2 h-6 bg-black" /> {t("dashboard.recentActivity")}
              </h2>
              <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] divide-y-[3px] divide-black overflow-hidden">
                {[
                  { icon: "📚", text: t("dashboard.activityEmpty"), sub: t("dashboard.getStarted"), to: "/app/courses", bg: "bg-[#FFD23F]" },
                  { icon: "⚡", text: t("dashboard.playgroundPromo"), sub: t("dashboard.openPlayground"), to: "/app/ide", bg: "bg-[#88D498]" },
                  { icon: "🏆", text: t("dashboard.challengePromo"), sub: t("dashboard.browseChallenges"), to: "/app/arena/training", bg: "bg-[#FF6B6B]" },
                ].map((item, i) => (
                  <Link key={i} href={item.to} className="flex items-center gap-4 p-5 hover:bg-[#FFF4CC] transition-colors group">
                    <span className={`w-12 h-12 ${item.bg} border-[3px] border-black flex items-center justify-center text-xl shrink-0 group-hover:rotate-[-2deg] transition-transform`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className={`block font-bold text-sm text-black ${isRTL ? "text-right" : "text-left"}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                        {item.text}
                      </span>
                      <span className={`block font-mono text-[10px] font-black uppercase tracking-widest text-black/60 mt-1 ${isRTL ? "text-right" : "text-left"}`}>
                        {item.sub} →
                      </span>
                    </span>
                    <ChevronRight className={`w-5 h-5 text-black shrink-0 ${isRTL ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform`} />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Coders Online */}
            <motion.div variants={fadeUp} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6">
              <div className="flex items-center justify-between gap-3 -mx-6 -mt-6 px-6 py-4 mb-6 bg-[#74B9FF] border-b-[3px] border-black">
                <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-black">{t("dashboard.codersOnline")}</h3>
                <Link
                  href="/app/profile?tab=friends"
                  className="bg-black text-white border-[2px] border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  {t("common.viewAll")} →
                </Link>
              </div>

              <div className="space-y-4">
                {friends.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-14 h-14 bg-white border-[3px] border-black flex items-center justify-center mx-auto shadow-[3px_3px_0_0_#000]">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t("dashboard.noFriends")}</p>
                    <Link href="/app/arena/rankings" className="inline-flex bg-[#FFD23F] border-[3px] border-black px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_#000] transition-all">
                      {t("dashboard.findCoders")} →
                    </Link>
                  </div>
                ) : (
                  friends.map((friend) => (
                    <div
                      key={friend.uid}
                      className="flex items-center gap-3 border-[2px] border-black p-2 pr-3 hover:bg-[#FFF4CC] cursor-pointer transition-colors group"
                      onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                    >
                      <span className="w-10 h-10 border-[2px] border-black overflow-hidden bg-white shrink-0">
                        <img src={friend.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.displayName}`} className="w-full h-full object-cover" alt="" />
                      </span>
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block font-mono text-xs font-black uppercase tracking-tight text-black truncate group-hover:underline">{friend.displayName}</span>
                        <span className="block font-mono text-[10px] font-bold uppercase text-black/60">{t("dashboard.level")} {friend.level}</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 text-black ${isRTL ? "rotate-180" : ""} group-hover:translate-x-0.5 transition-transform`} />
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/app/arena/rankings"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-white border-[3px] border-black py-3 font-mono text-[11px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <Users className="w-4 h-4" /> {t("dashboard.globalLeaderboard")}
              </Link>
            </motion.div>

            {/* Next achievement */}
            <motion.div variants={fadeUp} className="bg-[#FFD23F] border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 bg-black border-[2px] border-black flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-[#FFD23F]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black uppercase tracking-widest text-black/60">Next Achievement</span>
                  <span className="block font-black text-sm leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {t("arena.arenaGladiator")}
                  </span>
                </span>
              </div>
              <div className="mt-5 bg-white border-[3px] border-black p-3 shadow-[3px_3px_0_0_#000]">
                <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  <span>{t("arena.win3Duels")}</span>
                  <span>1/3</span>
                </div>
                <div className="mt-2 h-4 bg-white border-[2px] border-black p-1">
                  <div className="h-full bg-black w-[33%]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Marquee — visible structure ───────────────────────────────────── */}
        <motion.div variants={fadeUp} className="bg-black border-[3px] border-black text-[#FFD23F] overflow-hidden py-2.5">
          <div className="flex whitespace-nowrap font-mono text-[11px] font-black uppercase tracking-[0.18em] animate-[marquee_22s_linear_infinite]">
            <span>HARD SHADOWS • THICK BORDERS • SQUARE CORNERS • FLAT COLOR • BOLD TYPE • ZERO BLUR • VISIBLE STRUCTURE •&nbsp;</span>
            <span>HARD SHADOWS • THICK BORDERS • SQUARE CORNERS • FLAT COLOR • BOLD TYPE • ZERO BLUR • VISIBLE STRUCTURE •&nbsp;</span>
          </div>
        </motion.div>
      </motion.div>

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </>
  );
}
