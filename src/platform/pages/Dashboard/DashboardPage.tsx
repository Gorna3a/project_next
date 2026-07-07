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
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../../core/hooks/useAuth";
import { useLanguage } from "../../../core/context/LanguageContext";
import { AvatarPicker } from "../../../shared/ui/AvatarPicker";
import { socialService } from "../../../core/services/socialService";

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const XP_PER_LEVEL = 1000;

// ─── Component ────────────────────────────────────────────────────────────────

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
    // Show avatar picker if user is logged in but has no photo
    if (profile && !profile.photoURL) {
      const timer = setTimeout(() => setShowAvatarPicker(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    socialService.getFriends(user.uid).then(f => setFriends(f.slice(0, 5)));
    socialService.getFriendRequests(user.uid).then(setRequests);
  }, [user]);

  const quickActionsFixed = [
    {
      to: "/app/courses",
      icon: BookOpen,
      label: t('nav.courses'),
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40",
    },
    {
      to: "/app/playground",
      icon: Terminal,
      label: t('nav.playground'),
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40",
    },
    {
      to: "/app/arena/training",
      icon: Trophy,
      label: t('nav.arena'),
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40",
    },
    {
      to: "/app/chat",
      icon: Bot,
      label: t('nav.chat'),
      color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40",
    },
  ] as const;

  const greeting = t('dashboard.welcome');

  return (
    <>
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <AvatarPicker uid={user!.uid} onComplete={() => setShowAvatarPicker(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-8 max-w-6xl mx-auto pb-12"
      >
        {/* ── Welcome banner ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-500/20"
        >
          {/* Decorative pixel grid */}
          <div className={`absolute ${isRTL ? 'left-8' : 'right-8'} top-0 bottom-0 flex items-center opacity-20 pointer-events-none select-none`}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex flex-col gap-2 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className={`rounded-sm bg-white ${(i + j) % 2 === 0 ? "w-4 h-4" : "w-3 h-3"}`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="relative">
            <p className="text-brand-200 text-sm mb-1">{greeting},</p>
            <h1 className="text-4xl font-black mb-4 tracking-tight">{name} 👋</h1>

          {/* XP progress */}
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-brand-200">
                {t('dashboard.level')} {level}
              </span>
              <span className="text-brand-200">
                {xpPercent.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] font-bold text-brand-200 uppercase tracking-wide">
              {xpToNextLevel} {t('dashboard.xpRemaining')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Pending Requests Alert ────────────────────────────────────────── */}
      {requests.length > 0 && (
        <motion.div 
          variants={fadeUp}
          className="bg-orange-50 border-2 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800/40 rounded-3xl p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-orange-900 dark:text-orange-200 uppercase tracking-widest">{t('profile.requests')}</p>
              <p className="text-xs text-orange-700 dark:text-orange-400 font-bold">{t('profile.pendingRequests').replace('{count}', requests.length.toString())}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate.push('/app/profile?tab=friends')}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
          >
            {t('common.review')}
          </button>
        </motion.div>
      )}

      {/* ── Content Grid ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Stat cards */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Star,
                label: t('dashboard.totalXP'),
                value: xp.toLocaleString(),
                color: "text-yellow-500",
              },
              { icon: Zap, label: t('dashboard.level'), value: level, color: "text-brand-500" },
              {
                icon: Flame,
                label: t('dashboard.dayStreak'),
                value: `${streak}🔥`,
                color: "text-orange-500",
              },
              {
                icon: TrendingUp,
                label: t('dashboard.rank'),
                value: "#12",
                color: "text-green-500",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <motion.div key={label} variants={fadeUp} className="card p-5">
                <Icon className={`w-5 h-5 ${color} mb-3`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              {t('dashboard.quickActions')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActionsFixed.map(({ to, icon: Icon, label, color }) => (
                <Link
                  key={to}
                  href={to}
                  className={`flex flex-col items-center gap-3 p-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md ${color}`}
                >
                  <Icon className="w-6 h-6" />
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div variants={fadeUp}>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              {t('dashboard.recentActivity')}
            </h2>
            <div className="card divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
              {[
                {
                  icon: "📚",
                  text: t('dashboard.activityEmpty'),
                  sub: t('dashboard.getStarted'),
                  to: "/app/courses",
                },
                {
                  icon: "⚡",
                  text: t('dashboard.playgroundPromo'),
                  sub: t('dashboard.openPlayground'),
                  to: "/app/playground",
                },
                {
                  icon: "🏆",
                  text: t('dashboard.challengePromo'),
                  sub: t('dashboard.browseChallenges'),
                  to: "/app/arena/training",
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.to}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.text}
                    </p>
                    <p className={`text-[10px] font-black text-brand-500 dark:text-brand-400 uppercase tracking-widest mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.sub}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Sidebar Widgets ─────────────────────────────────────────────── */}
        <div className="space-y-8">
          {/* Friends Widget */}
          <motion.div variants={fadeUp} className="card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('dashboard.codersOnline')}</h3>
              <Link href="/app/profile?tab=friends" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">{t('common.viewAll')}</Link>
            </div>
            
            <div className="space-y-4">
              {friends.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mx-auto text-gray-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-gray-400 font-bold">{t('dashboard.noFriends')}</p>
                  <Link href="/app/arena/rankings" className="inline-block text-[10px] font-black text-brand-500 uppercase tracking-widest underline">{t('dashboard.findCoders')}</Link>
                </div>
              ) : (
                friends.map((friend) => (
                  <div 
                    key={friend.uid} 
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-brand-500 transition-all">
                      <img 
                        src={friend.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.displayName}`} 
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">{friend.displayName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{t('dashboard.level')} {friend.level}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-all ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                ))
              )}
            </div>

            <Link 
              href="/app/arena/rankings" 
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-600 transition-colors border border-dashed border-gray-200 dark:border-gray-800"
            >
              <Users className="w-4 h-4" /> {t('dashboard.globalLeaderboard')}
            </Link>
          </motion.div>

          {/* Achievement Progress Widget */}
          <motion.div variants={fadeUp} className="card p-6 bg-brand-50/30 dark:bg-brand-900/10 border-brand-100 dark:border-brand-800/40">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                   <Trophy className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-[10px] font-black text-brand-900 dark:text-brand-200 uppercase tracking-widest">{t('dashboard.nextAchievement')}</h3>
                   <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{t('arena.arenaGladiator')}</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-brand-600 dark:text-brand-400">
                   <span>{t('arena.win3Duels')}</span>
                   <span>1/3</span>
                </div>
                <div className="h-1.5 bg-brand-100 dark:bg-brand-900/60 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-500 rounded-full w-[33%]" />
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
    </>
  );
}
