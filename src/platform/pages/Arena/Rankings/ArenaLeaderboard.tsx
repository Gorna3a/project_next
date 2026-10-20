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

const PODIUM = [
  { place: 2, h: 96, frame: 'var(--surface-2)', chip: 'var(--grey)', medal: '🥈' },
  { place: 1, h: 128, frame: 'var(--phosphor)', chip: 'var(--amber)', medal: '🥇' },
  { place: 3, h: 80, frame: 'var(--surface-2)', chip: 'var(--orange)', medal: '🥉' },
];

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
      navigate.push(`/app/arena/duels/${roomId}`);
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
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1
          className="flex items-center justify-center gap-3"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 22, color: 'var(--fg)' }}
        >
          <Crown style={{ width: 30, height: 30, color: 'var(--amber)' }} /> {t('arena.hallOfFame')}
        </h1>
        <p className="mono text-[11px] font-bold" style={{ color: 'var(--muted)' }}>{isRTL ? 'أفضل ٥٠ مبرمج في ساحة PixelCode.' : 'The top 50 Gladiators of the PixelCode Arena.'}</p>
      </div>

      {/* Podium */}
      {!loading && filtered.length > 0 && (
        <div className={`grid grid-cols-3 gap-3 items-end pt-10 pb-2 ${isRTL ? 'direction-rtl' : ''}`}>
          {PODIUM.map(({ place, h, frame, chip, medal }, pi) => {
            const entry = filtered[place - 1];
            if (!entry) return <div key={place} />;
            const first = place === 1;
            return (
              <motion.div
                key={place}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="relative cursor-pointer group" onClick={() => navigate.push(`/app/profile/${entry.uid}`)}>
                  {first && (
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl z-10"
                    >
                      👑
                    </motion.div>
                  )}
                  <div
                    className="grid place-items-center text-3xl overflow-hidden group-hover:scale-105 transition-all"
                    style={{
                      width: first ? 76 : 60,
                      height: first ? 76 : 60,
                      backgroundColor: 'var(--surface)',
                      border: '4px solid var(--border)',
                      boxShadow: first ? '4px 4px 0 var(--border)' : 'none',
                    }}
                  >
                    {entry.photoURL ? <img src={entry.photoURL} className="w-full h-full object-cover pixel-img" alt="" /> : medal}
                  </div>
                  <div
                    className="absolute -top-2 grid place-items-center mono text-[10px] font-black"
                    style={{
                      [isRTL ? 'left' : 'right']: -8,
                      width: 24, height: 24,
                      backgroundColor: chip, color: '#000',
                      border: '3px solid var(--border)',
                    }}
                  >
                    {place}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`${first ? 'font-black text-base' : 'font-bold text-sm'} truncate max-w-[110px] cursor-pointer`}
                    style={{ color: 'var(--fg)' }}
                    onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                  >
                    {entry.displayName || (isRTL ? 'مجهول' : 'Anonymous')}
                  </div>
                  <div className="mono text-xs font-black" style={{ color: 'var(--phosphor-dark)' }}>{entry.totalXP.toLocaleString()} XP</div>
                </div>
                <div
                  className="w-full grid place-items-center"
                  style={{ height: h, backgroundColor: frame, border: '4px solid var(--border)', boxShadow: '4px 4px 0 var(--border)' }}
                >
                  <Crown style={{ width: first ? 34 : 24, height: first ? 34 : 24, color: first ? '#000' : 'var(--muted)', opacity: first ? 1 : 0.5 }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className="list">
        <div className="p-3" style={{ borderBottom: '4px solid var(--border)' }}>
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} style={{ width: 15, height: 15, color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder={isRTL ? 'ابحث عن المبرمجين...' : 'Search hackers...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 mono text-xs font-bold`}
              style={{ backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', color: 'var(--fg)', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 animate-pulse" style={{ backgroundColor: 'var(--surface-2)', borderBottom: '3px solid var(--border)' }} />
            ))
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center mono text-xs font-bold" style={{ color: 'var(--muted)' }}>{isRTL ? 'لم يتم العثور على نتائج. كن أول من يبارز!' : 'No rankings found. Be the first to duel!'}</div>
          ) : (
            filtered.map((entry, i) => {
              const isMe = entry.uid === currentProfile?.uid;
              return (
                <div 
                  key={entry.uid} 
                  className={`row !cursor-default group ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="mono text-sm font-black" style={{ color: 'var(--muted)', width: 32 }}>#{i + 1}</div>
                  <div 
                    className="grid place-items-center overflow-hidden cursor-pointer active:scale-90 transition-all"
                    style={{ width: 38, height: 38, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', flexShrink: 0 }}
                    onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                  >
                    {entry.photoURL ? <img src={entry.photoURL} className="w-full h-full object-cover pixel-img" alt="" /> : 
                      (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤')}
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div 
                      className={`font-bold flex items-center gap-2 cursor-pointer truncate text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ color: 'var(--fg)' }}
                      onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                    >
                      {entry.displayName || (isRTL ? 'مجهول' : 'Anonymous')}
                      {isMe && (
                        <span className="mono text-[9px] px-1.5 py-0.5 uppercase font-black flex-shrink-0" style={{ backgroundColor: 'var(--border)', color: 'var(--phosphor)', border: '2px solid var(--border)' }}>
                          {t('common.you')}
                        </span>
                      )}
                    </div>
                    <div className="mono text-[10px] font-black uppercase" style={{ color: 'var(--muted)' }}>
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
                          className="grid place-items-center transition-all active:scale-95"
                          style={{ width: 32, height: 32, backgroundColor: 'var(--orange)', border: '3px solid var(--border)' }}
                          title={isRTL ? 'دعوة لمبارزة سريعة' : 'Quick Duel Invite'}
                        >
                          <Sword style={{ width: 14, height: 14, color: '#000' }} />
                        </button>
                        <button 
                          onClick={() => handleQuickFriend(entry)}
                          disabled={!!actionLoading}
                          className="grid place-items-center transition-all active:scale-95"
                          style={{ width: 32, height: 32, backgroundColor: 'var(--phosphor)', border: '3px solid var(--border)' }}
                          title={isRTL ? 'إضافة صديق' : 'Add Friend'}
                        >
                          <UserPlus style={{ width: 14, height: 14, color: '#000' }} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => navigate.push(`/app/profile/${entry.uid}`)}
                      className={`grid place-items-center ${isRTL ? 'rotate-180' : ''}`}
                      style={{ width: 32, height: 32, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)' }}
                    >
                      <ChevronRight style={{ width: 14, height: 14, color: 'var(--muted)' }} />
                    </button>
                  </div>

                  <div className={`${isRTL ? 'mr-2 ml-0' : 'ml-2 mr-0'}`}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: 'var(--phosphor-dark)' }}>{entry.totalXP.toLocaleString()}</div>
                    <div className="mono text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{t('dashboard.totalXP')}</div>
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
