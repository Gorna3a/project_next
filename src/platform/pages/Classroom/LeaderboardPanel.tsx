'use client';

import { useEffect, useState } from 'react';
import { Crown, Loader2, Medal, Star, Trophy } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { fetchLeaderboard } from './classroomService';
import type { LeaderboardRow } from './classroomTypes';

export const LeaderboardPanel = ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const next = await fetchLeaderboard(classroomId);
        if (!cancelled) setRows(next);
      } catch (e) {
        console.error('[Classroom] Failed to build leaderboard:', e);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [classroomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      </div>
    );
  }

  const rankIcon = (rank: number) =>
    rank === 1 ? <Crown className="w-4 h-4 text-[#f59e0b]" />
    : rank === 2 ? <Medal className="w-4 h-4 text-[#9ca3af]" />
    : rank === 3 ? <Medal className="w-4 h-4 text-[#b45309]" />
    : <span className="font-mono text-xs font-black text-black">{rank}</span>;

  return (
    <div className="space-y-3">
      <div className="bg-black text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-[#FFD23F]" />
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-widest text-[#FFD23F]">{t('classroom.leaderboard')}</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/60">{t('classroom.leaderboardDesc')}</p>
        </div>
      </div>

      {error ? (
        <div className="bg-[#FF6B6B] border-[3px] border-black shadow-[4px_4px_0_0_#000] p-3 font-mono text-xs font-bold text-black">
          {t('classroom.loadLeaderboardFailed')}
        </div>
      ) : rows.length === 0 ? (
        <p className="font-mono text-xs text-black/60 text-center py-8">{t('classroom.noStudentsYet')}</p>
      ) : (
        rows.map((row, idx) => {
          const isMe = row.uid === user?.uid;
          const initials = (row.displayName || 'P')
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
          return (
            <div
              key={row.uid}
              className={`border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 flex items-center gap-3 ${isMe ? 'bg-[#FFF4CC]' : 'bg-white'} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="w-8 h-8 grid place-items-center bg-white border-[2px] border-black shrink-0">
                {rankIcon(idx + 1)}
              </span>
              <span className="w-10 h-10 bg-black text-[#FFD23F] border-[2px] border-black grid place-items-center font-mono text-xs font-black shrink-0 overflow-hidden">
                {row.photoURL ? (
                  <img src={row.photoURL} alt="" className="w-full h-full object-cover" />
                ) : initials}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs font-black uppercase tracking-widest text-black truncate">
                  {row.displayName || row.uid.slice(0, 10)}
                  {isMe && <span className="text-[#b45309]"> · {t('classroom.you')}</span>}
                </p>
                <p className="font-mono text-[10px] font-bold text-black/60 uppercase tracking-widest">
                  {row.completed} {t('classroom.completedShort')} · Lv.{row.level} · {row.totalXP.toLocaleString()} XP
                </p>
              </div>
              <div className={`shrink-0 ${isRTL ? 'text-left' : 'text-right'}`}>
                <p className="font-black text-lg text-black leading-none">{row.points}</p>
                <p className="font-mono text-[9px] font-black uppercase tracking-widest text-black/50 flex items-center gap-1"><Star className="w-3 h-3" /> {t('classroom.pointsShort')}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
