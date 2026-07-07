import { motion } from 'framer-motion';
import { Trophy, Zap, Target, Users, Play, Sword, History, Crown } from 'lucide-react';
import Link from "next/link";
import { useLanguage } from '../../../core/context/LanguageContext';

export default function ArenaHub() {
  const { t, isRTL } = useLanguage();

  const stats = [
    { label: t('arena.duelsWon'), value: '0', icon: Sword, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { label: t('arena.globalRank'), value: 'N/A', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { label: t('arena.rating'), value: '1000', icon: Zap, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 md:p-12 text-white">
        <div className={`relative z-10 max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            {t('arena.liveArena')}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            {t('arena.tagline').split(' ').map((word, i, arr) => (
              <span key={i}>
                {word === 'Coding' || word === 'قوتك' ? <span className="text-yellow-400">{word}</span> : word}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="text-lg text-indigo-100 font-medium mb-8">
            {t('arena.description')}
          </p>
          <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href="/app/arena/duels" className={`px-8 py-4 rounded-2xl bg-white text-indigo-600 font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sword className="w-5 h-5" /> {t('arena.findDuel')}
            </Link>
            <Link href="/app/arena/training" className={`px-8 py-4 rounded-2xl bg-indigo-500 text-white font-black text-lg hover:bg-indigo-400 transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-5 h-5" /> {t('arena.training')}
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-1/2 h-full opacity-10 pointer-events-none`}>
          <Zap className={`w-full h-full ${isRTL ? '-rotate-12' : 'rotate-12'}`} />
        </div>
      </div>

      <div className={`grid lg:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
        {/* Left Column: Stats & Daily */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Challenge */}
          <section className="space-y-4">
            <h2 className={`text-xl font-black flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <Crown className="w-6 h-6 text-yellow-500" /> {t('arena.dailyQuest')}
            </h2>
            <div className="card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase border border-indigo-500/30">
                    {t('arena.expertLogic')}
                  </span>
                  <span className="text-xs font-bold text-gray-400">{t('arena.endsIn')} 14h 22m</span>
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-2xl font-black mb-2">{t('arena.recursiveFibTitle')}</h3>
                  <p className="text-gray-400 text-sm font-medium line-clamp-2">
                    {t('arena.recursiveFibDesc')}
                  </p>
                </div>
                <div className={`flex items-center justify-between pt-4 border-t border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 text-xs font-bold text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Users className="w-3.5 h-3.5" /> {isRTL ? '١،٢٤٢' : '1,242'} {t('arena.joined')}</span>
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Trophy className="w-3.5 h-3.5 text-yellow-500" /> +500 XP</span>
                  </div>
                  <button className={`px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-black text-sm transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('arena.acceptQuest')} <Play className={`w-3.5 h-3.5 fill-current ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {/* Background Glow */}
              <div className={`absolute -top-24 ${isRTL ? '-left-24' : '-right-24'} w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-all`} />
            </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="card p-5 flex flex-col items-center text-center space-y-2">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity & Top Players */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className={`text-xl font-black flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <History className="w-6 h-6 text-indigo-500" /> {t('arena.matchHistory')}
            </h2>
            <div className="card divide-y divide-gray-100 dark:divide-gray-800">
              <div className="p-8 text-center text-sm text-gray-500 font-medium">
                {t('arena.noRecentDuels')}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className={`text-xl font-black flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <Crown className="w-6 h-6 text-amber-500" /> {t('arena.topGladiators')}
            </h2>
            <div className="card p-4 space-y-3">
              {[
                { name: 'pixel_master', rating: 2840, avatar: '🦊' },
                { name: 'bug_hunter', rating: 2715, avatar: '🐱' },
                { name: 'algo_god', rating: 2690, avatar: '🤖' },
              ].map((player, i) => (
                <div key={i} className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-6 text-xs font-black text-gray-400">#{i + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">{player.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{player.name}</div>
                    <div className={`text-[10px] font-black text-indigo-500 uppercase ${isRTL ? 'text-left' : 'text-right'}`}>{player.rating} {t('arena.rating')}</div>
                  </div>
                </div>
              ))}
              <Link href="/app/arena/rankings" className="block text-center text-xs font-bold text-indigo-600 hover:underline pt-2">
                {t('arena.viewAllRankings')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
