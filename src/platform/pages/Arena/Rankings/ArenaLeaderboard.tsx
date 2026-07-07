'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Search, Sword, UserPlus, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useRouter } from "next/navigation";
import { db } from '../../../../core/firebase/config';
import { useAuth } from '../../../../core/context/AuthContext';
import { useLanguage } from '../../../../core/context/LanguageContext';
import { socialService } from '../../../../core/services/socialService';
import { duelService } from '../DuelZone/duelService';
import { useNotifications } from '../../../../core/context/NotificationContext';

interface RankingEntry {
  uid: string;
  displayName?: string;
  totalXP: number;
  level: number;
  photoURL?: string;
}

export default function ArenaLeaderboard() {
  const { profile: currentProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('totalXP', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setRankings(snap.docs.map(d => {
          const data = d.data();
          return {
            uid: d.id,
            displayName: data.displayName,
            totalXP: data.totalXP || 0,
            level: data.level || 1,
            photoURL: data.photoURL
          };
        }));
      } catch (e) {
        console.error('Failed to load rankings:', e);
      } finally {
        setLoading(false);
      }
    };
    loadRankings();
  }, []);

  const handleQuickDuel = async (target: RankingEntry) => {
    if (!currentProfile) return;
    setActionLoading(target.uid + '_duel');
    try {
      const roomId = await duelService.createRoom(
        'quick-duel', 
        'Quick Duel Challenge', 
        currentProfile.uid, 
        currentProfile.displayName || 'PixelCoder'
      );
      await socialService.sendDuelInvite(currentProfile, target.uid, roomId);
      addNotification('success', t('arena.duelSent'), `${isRTL ? 'تمت دعوة' : 'Invited'} ${target.displayName} ${isRTL ? 'للمنافسة!' : 'to race!'}`);
      navigate.push(`/arena/duels/${roomId}`);
    } catch (err) {
      addNotification('error', t('common.failed'), isRTL ? 'تعذر إرسال دعوة المبارزة' : 'Could not send duel invite');
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickFriend = async (target: RankingEntry) => {
    if (!currentProfile) return;
    setActionLoading(target.uid + '_friend');
    try {
      await socialService.sendFriendRequest(currentProfile, target.uid);
      addNotification('success', t('common.requestSent'), isRTL ? `تم إرسال طلب صداقة إلى ${target.displayName}` : `Friend request sent to ${target.displayName}`);
    } catch (err) {
      addNotification('error', t('common.failed'), isRTL ? 'تعذر إرسال الطلب' : 'Could not send request');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = rankings.filter(r => 
    r.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`text-4xl font-black flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Crown className="w-10 h-10 text-yellow-500" /> {t('arena.hallOfFame')}
        </h1>
        <p className="text-gray-500 font-bold">{isRTL ? 'أفضل ٥٠ مبرمج في ساحة PixelCode.' : 'The top 50 Gladiators of the PixelCode Arena.'}</p>
      </div>

      {/* Podium */}
      {!loading && filtered.length > 0 && (
        <div className={`grid grid-cols-3 gap-4 items-end pt-10 pb-6 ${isRTL ? 'direction-rtl' : ''}`}>
          {/* 2nd Place */}
          {filtered.length >= 2 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="relative cursor-pointer group" onClick={() => navigate.push(`/app/profile/${filtered[1].uid}`)}>
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl border-4 border-gray-300 overflow-hidden group-hover:border-brand-500 transition-all">
                  {filtered[1].photoURL ? <img src={filtered[1].photoURL} className="w-full h-full object-cover" alt="" /> : '🥈'}
                </div>
                <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-gray-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black`}>2</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-sm truncate max-w-[100px] hover:text-brand-600 cursor-pointer" onClick={() => navigate.push(`/app/profile/${filtered[1].uid}`)}>
                  {filtered[1].displayName || (isRTL ? 'مجهول' : 'Anonymous')}
                </div>
                <div className="text-xs font-black text-brand-500">{filtered[1].totalXP.toLocaleString()} XP</div>
              </div>
              <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-t-2xl border-x-2 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg" />
            </motion.div>
          ) : <div />}

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center space-y-3"
          >
            <div className="relative cursor-pointer group" onClick={() => navigate.push(`/app/profile/${filtered[0].uid}`)}>
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl"
              >
                👑
              </motion.div>
              <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-4xl border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] overflow-hidden group-hover:scale-105 transition-all">
                {filtered[0].photoURL ? <img src={filtered[0].photoURL} className="w-full h-full object-cover" alt="" /> : '🥇'}
              </div>
              <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black`}>1</div>
            </div>
            <div className="text-center">
              <div className="font-black text-lg truncate max-w-[120px] hover:text-brand-600 cursor-pointer" onClick={() => navigate.push(`/app/profile/${filtered[0].uid}`)}>
                {filtered[0].displayName || (isRTL ? 'مجهول' : 'Anonymous')}
              </div>
              <div className="text-sm font-black text-brand-500">{filtered[0].totalXP.toLocaleString()} XP</div>
            </div>
            <div className="w-full h-32 bg-brand-600 rounded-t-2xl shadow-[0_0_30px_rgba(98,114,245,0.2)] flex items-center justify-center">
              <Crown className="w-10 h-10 text-white/20" />
            </div>
          </motion.div>

          {/* 3rd Place */}
          {filtered.length >= 3 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="relative cursor-pointer group" onClick={() => navigate.push(`/app/profile/${filtered[2].uid}`)}>
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl border-4 border-orange-400 overflow-hidden group-hover:border-brand-500 transition-all">
                  {filtered[2].photoURL ? <img src={filtered[2].photoURL} className="w-full h-full object-cover" alt="" /> : '🥉'}
                </div>
                <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black`}>3</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-sm truncate max-w-[100px] hover:text-brand-600 cursor-pointer" onClick={() => navigate.push(`/app/profile/${filtered[2].uid}`)}>
                  {filtered[2].displayName || (isRTL ? 'مجهول' : 'Anonymous')}
                </div>
                <div className="text-xs font-black text-brand-500">{filtered[2].totalXP.toLocaleString()} XP</div>
              </div>
              <div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-t-2xl border-x-2 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg" />
            </motion.div>
          ) : <div />}
        </div>
      )}

      {/* List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder={isRTL ? 'ابحث عن المبرمجين...' : 'Search hackers...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm font-bold`}
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 animate-pulse bg-gray-50/50 dark:bg-gray-900/50" />
            ))
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-bold">{isRTL ? 'لم يتم العثور على نتائج. كن أول من يبارز!' : 'No rankings found. Be the first to duel!'}</div>
          ) : (
            filtered.map((entry, i) => {
              const isMe = entry.uid === currentProfile?.uid;
              return (
                <div 
                  key={entry.uid} 
                  className={`flex items-center gap-4 p-4 transition-colors group ${isMe ? 'bg-brand-50/50 dark:bg-brand-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-900'} ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 text-sm font-black text-gray-400">#{i + 1}</div>
                  <div 
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer active:scale-90 transition-all shadow-sm"
                    onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                  >
                    {entry.photoURL ? <img src={entry.photoURL} className="w-full h-full object-cover" alt="" /> : 
                      (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤')}
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div 
                      className={`font-bold flex items-center gap-2 cursor-pointer hover:text-brand-600 transition-colors truncate ${isRTL ? 'flex-row-reverse' : ''}`}
                      onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                    >
                      {entry.displayName || (isRTL ? 'مجهول' : 'Anonymous')}
                      {isMe && <span className="text-[10px] bg-brand-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter flex-shrink-0">{t('common.you')}</span>}
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase">
                      {isRTL ? `مبرمج من المستوى ${entry.level}` : `Level ${entry.level} Coder`}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <>
                        <button 
                          onClick={() => handleQuickDuel(entry)}
                          disabled={!!actionLoading}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                          title={isRTL ? 'دعوة لمبارزة سريعة' : 'Quick Duel Invite'}
                        >
                          <Sword className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleQuickFriend(entry)}
                          disabled={!!actionLoading}
                          className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm active:scale-95"
                          title={isRTL ? 'إضافة صديق' : 'Add Friend'}
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                      className={`p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand-600 transition-all ${isRTL ? 'rotate-180' : ''}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`text-right ${isRTL ? 'mr-2 ml-0' : 'ml-2 mr-0'}`}>
                    <div className="text-lg font-black text-brand-600">{entry.totalXP.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('dashboard.totalXP')}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
