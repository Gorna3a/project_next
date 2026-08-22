'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Edit2, Check, X, Star, Flame, Zap, BookOpen, Trophy, TrendingUp, Users, UserMinus } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { getAllCourseProgress } from '../../../core/services/progress';
import { socialService } from '../../../core/services/socialService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const XP_PER_LEVEL = 1000;

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();
  const [editing,     setEditing]     = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [saving,      setSaving]      = useState(false);
  const [activeTab,   setActiveTab]   = useState<'stats' | 'friends'>('stats');
  const [friends,     setFriends]     = useState<any[]>([]);

  const [coursesStarted, setCoursesStarted] = useState<number | string>('—');
  const [lessonsCompleted, setLessonsCompleted] = useState<number | string>('—');

  const ROLE_BADGE: Record<string, { label: string; bg: string; text: string }> = {
    student: { label: t('common.student'),  bg: 'bg-[#FFD23F]', text: 'text-black' },
    teacher: { label: t('common.teacher'),  bg: 'bg-[#88D498]', text: 'text-black' },
    admin:   { label: t('common.admin'),    bg: 'bg-[#74B9FF]', text: 'text-black' },
  };

  useEffect(() => {
    if (!user) return;
    getAllCourseProgress(user.uid)
      .then(progressList => {
        setCoursesStarted(progressList.length);
        const totalLessons = progressList.reduce((acc, curr) => acc + (curr.completedLessons?.length || 0), 0);
        setLessonsCompleted(totalLessons);
      })
      .catch(e => console.error('Failed to load stats:', e));

    socialService.getFriends(user.uid).then(setFriends);
  }, [user]);

  const xp     = profile?.totalXP ?? 0;
  const level  = profile?.level   ?? 1;
  const streak = profile?.streak  ?? 0;
  const xpIntoLevel   = xp % XP_PER_LEVEL;
  const xpPercent     = (xpIntoLevel / XP_PER_LEVEL) * 100;
  const xpToNextLevel = XP_PER_LEVEL - xpIntoLevel;

  const initials = profile?.displayName
    ? profile.displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? 'U');

  const roleCfg = ROLE_BADGE[profile?.role ?? 'student'] || ROLE_BADGE['student'];

  const handleSave = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await updateDoc(doc(db, 'users', user.uid), { displayName: displayName.trim() });
      toast.success(t('profile.profileUpdated'));
      setEditing(false);
    } catch {
      toast.error(t('profile.failedUpdateProfile'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profile?.displayName ?? '');
    setEditing(false);
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={`max-w-3xl mx-auto space-y-6 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>

      {/* ── Masthead ── */}
      <motion.div variants={fadeUp} className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white hidden sm:inline-block" />
            {t('nav.profile') ?? 'Profile'}
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/60 mt-1">
            LVL {level} • {xp.toLocaleString()} XP • {streak} 🔥 STREAK
          </p>
        </div>
        <span className={`inline-flex items-center gap-2 border-[3px] px-3 py-1 font-mono text-[11px] font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] ${roleCfg.bg} ${roleCfg.text} border-black`}>
          {roleCfg.label}
        </span>
      </motion.div>

      {/* Profile card — hard brutalist */}
      <motion.div variants={fadeUp} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 md:p-8">
        <div className={`flex items-start gap-6 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Avatar — hard square */}
          <div className="w-20 h-20 bg-[#FFD23F] border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-2xl font-black shrink-0 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {profile?.photoURL
              ? <img src={profile.photoURL} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-black">{initials}</span>}
          </div>

          {/* Name + meta */}
          <div className={`flex-1 min-w-0 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {editing ? (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className={`flex-1 bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2 font-mono text-sm font-black placeholder:text-black/40 focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter')  handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <button onClick={handleSave} disabled={saving} className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] p-2 hover:bg-[#FFD23F] hover:text-black transition-colors disabled:opacity-50">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] p-2 hover:bg-black hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="font-black text-2xl tracking-tight text-black" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {profile?.displayName ?? t('common.user')}
                </h2>
                <button onClick={() => setEditing(true)} className="bg-white text-black border-[2px] border-black p-1.5 hover:bg-black hover:text-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="font-mono text-xs font-bold text-black/60">{user?.email}</p>
            <span className={`inline-flex border-[3px] border-black px-3 py-1 font-mono text-[11px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_#000] ${roleCfg.bg} ${roleCfg.text}`}>
              {roleCfg.label}
            </span>
          </div>
        </div>

        {/* XP Progress — segmented brutalist bar */}
        <div className="mt-6 space-y-2">
          <div className={`flex justify-between font-mono text-[11px] font-black uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-black">
              {isRTL ? (
                <>{t('common.level')} {level} &larr; {level + 1}</>
              ) : (
                <>{t('common.level')} {level} &rarr; {level + 1}</>
              )}
            </span>
            <span className="text-black/60">
              {xpIntoLevel} / {XP_PER_LEVEL} {t('common.xp')} · {t('profile.toGo').replace('{count}', xpToNextLevel.toString())}
            </span>
          </div>
          <div className="h-[18px] bg-white border-[3px] border-black p-[3px] flex gap-[3px]">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className={`flex-1 h-full ${i < Math.round((xpPercent / 100) * 20) ? "bg-black" : "bg-black/10"}`} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs — hard brutalist */}
      <div className={`flex gap-2 bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2.5 px-4 font-mono text-xs font-black uppercase tracking-widest border-[3px] transition-all ${activeTab === 'stats' ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
        >
          {t('common.overview')}
        </button>
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 px-4 font-mono text-xs font-black uppercase tracking-widest border-[3px] transition-all ${activeTab === 'friends' ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
        >
          {t('profile.friends')} ({friends.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'stats' ? (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Stats — hard bento */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
              {[
                { icon: Star,       label: t('dashboard.totalXP'),  value: xp.toLocaleString(), bg: 'bg-[#FFD23F]' },
                { icon: Zap,        label: t('profile.level'),      value: level,              bg: 'bg-white' },
                { icon: Flame,      label: t('profile.dayStreak'),  value: `${streak}`,        bg: 'bg-[#FF6B6B]' },
                { icon: TrendingUp, label: t('profile.rank'),       value: '#—',               bg: 'bg-[#88D498]' },
              ].map(({ icon: Icon, label, value, bg }) => (
                <div key={label} className={`${bg} border-[3px] border-black shadow-[5px_5px_0_0_#000] p-4 text-center space-y-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#000] transition-all`}>
                  <span className="w-10 h-10 bg-black border-[2px] border-black grid place-items-center mx-auto">
                    <Icon className="w-5 h-5 text-white" />
                  </span>
                  <p className="font-black text-2xl leading-none tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/70">{label}</p>
                </div>
              ))}
            </div>

            {/* Activity — hard card */}
            <div className={`bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className={`font-mono text-xs font-black uppercase tracking-widest flex items-center gap-2 text-black ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-2 h-2 bg-[#FFD23F] border border-black" /> 📊 {t('dashboard.recentActivity')}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, label: t('profile.coursesStarted'),   value: coursesStarted, bg: '#74B9FF' },
                  { icon: Trophy,   label: t('profile.challengesSolved'), value: '—', bg: '#FFD23F' },
                  { icon: Star,     label: t('profile.lessonsCompleted'), value: lessonsCompleted, bg: '#88D498' },
                ].map(({ icon: Icon, label, value, bg }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 bg-[#FFFDF5] border-[3px] border-black shadow-[3px_3px_0_0_#000] ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="w-9 h-9 border-[2px] border-black grid place-items-center shrink-0" style={{ backgroundColor: bg }}>
                      <Icon className="w-4 h-4 text-black" />
                    </span>
                    <div>
                      <p className="font-black text-lg leading-none text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
                      <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`grid sm:grid-cols-2 gap-4 ${isRTL ? 'direction-rtl' : ''}`}
          >
            {friends.length === 0 ? (
              <div className="col-span-full bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-12 text-center space-y-4">
                <span className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
                  <Users className="w-7 h-7 text-black" />
                </span>
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t('profile.noFriends')}</p>
                <button onClick={() => navigate.push('/app/arena/rankings')} className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-6 py-2 hover:bg-[#FFD23F] hover:text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">{t('profile.findFriends')}</button>
              </div>
            ) : (
              friends.map(friend => (
                <div key={friend.uid} className={`bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 flex items-center gap-4 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_#000] transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div 
                    className="w-12 h-12 border-[3px] border-black overflow-hidden cursor-pointer active:scale-95 transition-transform shrink-0 bg-[#FFFDF5]"
                    onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                  >
                    <img 
                      src={friend.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.displayName}`} 
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p 
                      className="font-mono text-xs font-black uppercase tracking-widest truncate text-black cursor-pointer hover:underline"
                      onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                    >
                      {friend.displayName}
                    </p>
                    <p className="font-mono text-[10px] font-bold uppercase text-black/60">
                      {t('profile.level')} {friend.level} · {friend.totalXP} {t('common.xp')}
                    </p>
                  </div>
                  <button className="bg-white text-black border-[2px] border-black p-2 hover:bg-[#FF6B6B] hover:text-black opacity-0 group-hover:opacity-100 transition-all">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
