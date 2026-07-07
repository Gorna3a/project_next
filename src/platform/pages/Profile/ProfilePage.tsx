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

  const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
    student: { label: t('common.student'),  color: 'var(--accent-text)', bg: 'var(--accent-subtle)' },
    teacher: { label: t('common.teacher'),  color: '#059669', bg: 'rgba(5,150,105,0.12)' },
    admin:   { label: t('common.admin'),    color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
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

      {/* Profile card */}
      <motion.div variants={fadeUp} className="card p-8">
        <div className={`flex items-start gap-6 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover, var(--accent)))', color: 'white' }}
          >
            {profile?.photoURL
              ? <img src={profile.photoURL} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
              : initials}
          </div>

          {/* Name + meta */}
          <div className={`flex-1 min-w-0 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {editing ? (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className={`input text-xl font-bold py-1.5 ${isRTL ? 'text-right' : 'text-left'}`}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter')  handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <button onClick={handleSave} disabled={saving} className="btn-primary p-2">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="btn-ghost p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {profile?.displayName ?? t('common.user')}
                </h1>
                <button onClick={() => setEditing(true)} className="btn-ghost p-1.5">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <span
              className="inline-block text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ backgroundColor: roleCfg.bg, color: roleCfg.color }}
            >
              {roleCfg.label}
            </span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6 space-y-2">
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isRTL ? (
                <>{t('common.level')} {level} &larr; {level + 1}</>
              ) : (
                <>{t('common.level')} {level} &rarr; {level + 1}</>
              )}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {xpIntoLevel} / {XP_PER_LEVEL} {t('common.xp')} &middot; {t('profile.toGo').replace('{count}', xpToNextLevel.toString())}
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <motion.div
              className={`h-full rounded-full ${isRTL ? 'float-right' : ''}`}
              style={{ backgroundColor: 'var(--accent)' }}
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' as const }}
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className={`flex border-b border-gray-100 dark:border-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all
            ${activeTab === 'stats' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          {t('common.overview')}
        </button>
        <button 
          onClick={() => setActiveTab('friends')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all
            ${activeTab === 'friends' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
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
            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
              {[
                { icon: Star,       label: t('dashboard.totalXP'),  value: xp.toLocaleString(), color: '#f59e0b' },
                { icon: Zap,        label: t('profile.level'),      value: level,              color: 'var(--accent)' },
                { icon: Flame,      label: t('profile.dayStreak'),  value: `${streak}`,        color: '#f97316' },
                { icon: TrendingUp, label: t('profile.rank'),       value: '#—',               color: '#8b5cf6' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="card p-4 text-center space-y-1">
                  <Icon className="w-5 h-5 mx-auto" style={{ color }} />
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Activity */}
            <div className={`card p-6 space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className={`font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-primary)' }}>
                <span>📊</span> {t('dashboard.recentActivity')}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, label: t('profile.coursesStarted'),   value: coursesStarted, color: '#3b82f6' },
                  { icon: Trophy,   label: t('profile.challengesSolved'), value: '—', color: '#f59e0b' },
                  { icon: Star,     label: t('profile.lessonsCompleted'), value: lessonsCompleted, color: '#22c55e' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`} style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
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
              <div className="col-span-full py-12 text-center space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                <Users className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('profile.noFriends')}</p>
                <button onClick={() => navigate.push('/app/arena/rankings')} className="btn-primary px-6 py-2">{t('profile.findFriends')}</button>
              </div>
            ) : (
              friends.map(friend => (
                <div key={friend.uid} className={`card p-4 flex items-center gap-4 group hover:border-brand-500 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div 
                    className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-sm"
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
                      className="font-black text-gray-900 dark:text-white truncate cursor-pointer hover:text-brand-600 transition-colors"
                      onClick={() => navigate.push(`/app/profile/${friend.uid}`)}
                    >
                      {friend.displayName}
                    </p>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      {t('profile.level')} {friend.level} &middot; {friend.totalXP} {t('common.xp')}
                    </p>
                  </div>
                  <button className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
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
