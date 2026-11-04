'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Terminal, Trophy, Bot, Flame, Zap, Users, UserPlus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../core/hooks/useAuth';
import { useLanguage } from '../../../core/context/LanguageContext';
import { AvatarPicker } from '../../../shared/ui/AvatarPicker';
import { socialService } from '../../../core/services/socialService';
import { pixelAvatarFor } from '../../../shared/ui/avatarFallback';

const XP_PER_LEVEL = 1000;

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useRouter();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const name = profile?.displayName?.split(' ')[0] ?? 'Coder';
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
    socialService.getFriends(user.uid).then(f => setFriends(f.slice(0, 5)));
    socialService.getFriendRequests(user.uid).then(setRequests);
  }, [user]);

  return (
    <>
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="border-[4px] shadow-[8px_8px_0_#000]" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <AvatarPicker uid={user!.uid} onComplete={() => setShowAvatarPicker(false)} />
          </div>
        </div>
      )}

      <div className="wrap">
        <div className="sys">
          <span>PIXEL CODE — DASHBOARD</span>
          <span>{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}</span>
        </div>

        <div className="hero-row">
          <div className="welcome scan">
            <div className="sub">{t('dashboard.welcome').toUpperCase()} —</div>
            <h1>{name}</h1>
            <div className="meter-box">
              <div className="mono meter-row">
                <span>LEVEL {level}</span>
                <span>{xpPercent.toFixed(0)}%</span>
              </div>
              <div className="bar" style={{ marginTop: 8 }}><i style={{ width: `${xpPercent}%` }} /></div>
              <div className="mono meter-foot">{xpToNextLevel} XP → NEXT LEVEL</div>
            </div>
          </div>
          <div className="side-stack">
            <div className="mini red">
              <div>
                <div className="mono" style={{ fontSize: 9, fontWeight: 800 }}>{t('dashboard.dayStreak').toUpperCase()}</div>
                <div className="pixel" style={{ fontSize: 20, marginTop: 4 }}>{streak}</div>
              </div>
              <div className="icon-box"><Flame className="w-5 h-5" /></div>
            </div>
            <div className="mini green">
              <div>
                <div className="mono" style={{ fontSize: 9, fontWeight: 800 }}>{t('dashboard.totalXP').toUpperCase()}</div>
                <div className="pixel" style={{ fontSize: 20, marginTop: 4 }}>{xp.toLocaleString()}</div>
              </div>
              <div className="icon-box" style={{ transform: 'rotate(-2deg)' }}><Zap className="w-5 h-5" /></div>
            </div>
          </div>
        </div>

        {requests.length > 0 && (
          <div className="mt-4 border-[4px] shadow-[4px_4px_0_#000] p-3 flex items-center justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B1A] grid place-items-center" style={{ border: '3px solid var(--border)' }}><UserPlus className="w-5 h-5 text-white" /></div>
              <div>
                <p className="mono text-xs font-black uppercase tracking-widest" style={{ color: 'var(--fg)' }}>{t('profile.requests')} • {requests.length}</p>
                <p className="mono text-[11px] font-bold opacity-60">{t('profile.pendingRequests').replace('{count}', String(requests.length))}</p>
              </div>
            </div>
            <button onClick={() => navigate.push('/app/profile?tab=friends')} className="px-4 py-2 font-mono text-xs font-black uppercase tracking-widest" style={{ background: 'var(--border)', color: 'var(--phosphor)', border: '3px solid var(--border)' }}>{t('dashboard.review')}</button>
          </div>
        )}

        <div className="bottom">
          <div>
            <div className="section-label">▣ {t('dashboard.quickActions').toUpperCase()}</div>
            <div className="qgrid">
              <Link href="/app/courses" className="q yellow"><div className="q-icon"><BookOpen className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>{t('dashboard.qaCourses')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{t('dashboard.qaLearn')}</div></Link>
              <Link href="/app/playground" className="q green"><div className="q-icon"><Terminal className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>{t('dashboard.qaPlayground')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{t('dashboard.qaRun')}</div></Link>
              <Link href="/app/arena" className="q orange"><div className="q-icon"><Trophy className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>{t('dashboard.qaArena')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{t('dashboard.qaBattle')}</div></Link>
              <Link href="/app/chat" className="q purple"><div className="q-icon"><Bot className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>{t('dashboard.qaChat')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>{t('dashboard.qaAsk')}</div></Link>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span>{t('dashboard.codersOnline').toUpperCase()}</span>
              <Link href="/app/profile?tab=friends" style={{ background: 'var(--border)', color: 'var(--phosphor)', padding: '4px 6px', border: '2px solid var(--border)', fontSize: 10, fontWeight: 800 }}>{t('common.viewAll').toUpperCase()} →</Link>
            </div>
            <div style={{ padding: 22, textAlign: 'center' }}>
              {friends.length === 0 ? (
                <>
                  <div style={{ width: 46, height: 46, background: 'var(--phosphor)', border: '3px solid var(--border)', boxShadow: '3px 3px 0 var(--border)', display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}><Users className="w-4 h-4" /></div>
                  <div className="pixel" style={{ fontSize: 8 }}>{t('dashboard.noFriends')}</div>
                  <Link href="/app/rankings" className="big-btn yellow" style={{ marginTop: 12, display: 'block', textAlign: 'center' }}>{t('dashboard.findFriends').toUpperCase()} →</Link>
                </>
              ) : (
                <div className="space-y-2">
                  {friends.map((f: any) => (
                    <div key={f.uid} onClick={() => navigate.push(`/app/profile/${f.uid}`)} className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[var(--surface-2)]" style={{ border: '2px solid var(--border)' }}>
                      <img src={f.photoURL || pixelAvatarFor(f.displayName || 'player')} className="w-8 h-8 object-cover" style={{ border: '2px solid var(--border)' }} alt="" />
                      <span className="font-mono text-xs font-black truncate" style={{ color: 'var(--fg)' }}>{f.displayName}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Link href="/app/chat" className="tutor-loop">
          <span className="tl-chip">24/7 AI</span>
          <span className="tl-text">{t('dashboard.tutorCta')}</span>
        </Link>
      </div>
    </>
  );
}
