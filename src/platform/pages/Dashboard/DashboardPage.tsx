'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Terminal, Trophy, Bot, Flame, Star, Zap, TrendingUp, Users, UserPlus, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../core/hooks/useAuth';
import { useLanguage } from '../../../core/context/LanguageContext';
import { AvatarPicker } from '../../../shared/ui/AvatarPicker';
import { socialService } from '../../../core/services/socialService';

const XP_PER_LEVEL = 1000;

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useRouter();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200); };

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

  useEffect(() => {
    const says = ["HI HAMI! ♡", "LET'S CODE!", "LVL UP!", "YOU GOT THIS!", "KEEP GOING!"];
    let si = 0;
    const id = setInterval(() => {
      si = (si + 1) % says.length;
      const el = document.getElementById('speech-retro');
      if (el) { el.style.opacity = '0'; setTimeout(() => { el.textContent = says[si]; el.style.opacity = '1'; }, 200); }
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="border-[4px] border-black shadow-[8px_8px_0_#000] bg-white">
            <AvatarPicker uid={user!.uid} onComplete={() => setShowAvatarPicker(false)} />
          </div>
        </div>
      )}

      <div className="wrap" style={{ maxWidth: 1160, margin: '0 auto', padding: '18px 18px 60px', width: '100%' }}>
        <div className="sys">
          <span>PIXEL CODE — DASHBOARD // CRT #001</span>
          <span className="badge"><span className="dot" /> SYSTEM READY · LVL {level} · {xp} XP</span>
          <span>{new Date().toLocaleDateString('en-GB')}</span>
        </div>

        <div className="hero-grid">
          <div className="crt scan">
            <div className="sub">WELCOME BACK —</div>
            <h1>{name} <span style={{ background: 'var(--border)', color: 'var(--phosphor)', padding: '4px 6px', fontSize: 14, verticalAlign: 'middle' }}>✦</span></h1>
            <div className="level-box">
              <div className="mono" style={{ fontSize: 9, fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}><span>LEVEL {level}</span><span>{xpPercent.toFixed(0)}% · {xp} XP</span></div>
              <div className="bar" style={{ marginTop: 6 }}><i style={{ width: `${xpPercent}%`, background: 'var(--border)' }} /><b style={{ flex: 1, opacity: 0.15, background: 'var(--phosphor)' }} /></div>
              <div className="mono" style={{ fontSize: 8, opacity: 0.5, marginTop: 6 }}>{xpToNextLevel} XP → NEXT LEVEL</div>
            </div>
            <div style={{ position: 'absolute', right: 10, top: 14, background: 'var(--surface)', border: '3px solid var(--border)', boxShadow: '3px 3px 0 var(--border)', padding: '8px 10px', transform: 'rotate(5deg)' }} className="mono"><div style={{ fontSize: 7, fontWeight: 800 }}>LVL</div><div style={{ fontFamily: "'Press Start 2P'", fontSize: 12 }}>{String(level).padStart(2, '0')}</div></div>
          </div>
          <div className="side-stack">
            <div className="mini red"><div><div className="mono" style={{ fontSize: 9, fontWeight: 800 }}>DAY STREAK</div><div className="pixel" style={{ fontSize: 18, marginTop: 4 }}>{streak}</div><div className="mono" style={{ fontSize: 8, opacity: 0.7 }}>KEEP IT BURNING</div></div><div className="icon-box"><Flame className="w-5 h-5" /></div></div>
            <div className="mini green"><div><div className="mono" style={{ fontSize: 9, fontWeight: 800 }}>GLOBAL RANK</div><div className="pixel" style={{ fontSize: 18, marginTop: 4 }}>#12</div><div className="mono" style={{ fontSize: 8, opacity: 0.7 }}>TOP 3% THIS WEEK</div></div><div className="icon-box" style={{ transform: 'rotate(-2deg)' }}><TrendingUp className="w-5 h-5" /></div></div>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><span className="tag">TOTAL XP</span><b>{xp.toLocaleString()}</b><span className="mono" style={{ fontSize: 8, opacity: 0.5 }}>ALL TIME</span></div>
          <div className="stat"><span className="tag">LEVEL</span><b>{String(level).padStart(2, '0')}</b><span className="mono" style={{ fontSize: 8, opacity: 0.5 }}>ROOKIE</span></div>
          <div className="stat"><span className="tag">STREAK</span><b>{streak}</b><span className="mono" style={{ fontSize: 8, opacity: 0.7 }}>DAYS</span></div>
          <div className="stat"><span className="tag">RANK</span><b>#12</b><span className="mono" style={{ fontSize: 8, opacity: 0.6 }}>GLOBAL</span></div>
        </div>

        {requests.length > 0 && (
          <div className="mt-4 bg-white border-[4px] border-black shadow-[4px_4px_0_#000] p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B1A] border-[3px] border-black grid place-items-center"><UserPlus className="w-5 h-5 text-white" /></div>
              <div>
                <p className="mono text-xs font-black uppercase tracking-widest">{t('profile.requests')} • {requests.length}</p>
                <p className="mono text-[11px] font-bold opacity-60">{t('profile.pendingRequests').replace('{count}', String(requests.length))}</p>
              </div>
            </div>
            <button onClick={() => navigate.push('/app/profile?tab=friends')} className="bg-black text-white border-[3px] border-black px-4 py-2 font-mono text-xs font-black uppercase tracking-widest">Review →</button>
          </div>
        )}

        <div className="bottom">
          <div>
            <div className="section-label">▣ QUICK ACTIONS</div>
            <div className="qgrid">
              <Link href="/app/courses" className="q yellow"><div className="q-icon"><BookOpen className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>Courses</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>LEARN →</div></Link>
              <Link href="/app/ide" className="q green"><div className="q-icon"><Terminal className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>Code Studio</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>CODE →</div></Link>
              <Link href="/app/arena/training" className="q orange"><div className="q-icon"><Trophy className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>Arena</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>BATTLE →</div></Link>
              <Link href="/app/chat" className="q purple"><div className="q-icon"><Bot className="w-4 h-4" /></div><div style={{ fontWeight: 800 }}>Smart Chat</div><div className="mono" style={{ fontSize: 9, opacity: 0.6 }}>ASK →</div></Link>
            </div>
            <div style={{ marginTop: 14 }} className="list">
              <div className="mono" style={{ padding: '10px 12px', borderBottom: '4px solid var(--border)', background: 'var(--border)', color: 'var(--phosphor)', fontSize: 7, fontFamily: "'Press Start 2P'" }}>◼ RECENT ACTIVITY</div>
              <Link href="/app/courses" className="row"><span className="row-icon yellow"><BookOpen className="w-3.5 h-3.5" /></span><div><div style={{ fontWeight: 800, fontSize: 13 }}>{t('dashboard.activityEmpty')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.5 }}>{t('dashboard.getStarted')} →</div></div><span className="arrow">›</span></Link>
              <Link href="/app/ide" className="row"><span className="row-icon green"><Zap className="w-3.5 h-3.5" /></span><div><div style={{ fontWeight: 800, fontSize: 13 }}>{t('dashboard.playgroundPromo')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.5 }}>{t('dashboard.openPlayground')} →</div></div><span className="arrow">›</span></Link>
              <Link href="/app/arena/training" className="row"><span className="row-icon orange"><Star className="w-3.5 h-3.5" /></span><div><div style={{ fontWeight: 800, fontSize: 13 }}>{t('dashboard.challengePromo')}</div><div className="mono" style={{ fontSize: 9, opacity: 0.5 }}>{t('dashboard.browseChallenges')} →</div></div><span className="arrow">›</span></Link>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="panel">
              <div className="panel-head"><span>CODERS ONLINE</span><Link href="/app/profile?tab=friends" style={{ background: 'var(--border)', color: 'var(--phosphor)', padding: '4px 6px', border: '2px solid var(--border)', fontSize: 10, fontWeight: 800 }}>VIEW ALL →</Link></div>
              <div style={{ padding: 22, textAlign: 'center' }}>
                {friends.length === 0 ? (
                  <>
                    <div style={{ width: 46, height: 46, background: 'var(--phosphor)', border: '3px solid var(--border)', boxShadow: '3px 3px 0 var(--border)', display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}><Users className="w-4 h-4" /></div>
                    <div className="pixel" style={{ fontSize: 8 }}>NO FRIENDS YET</div>
                    <Link href="/app/arena/rankings" className="big-btn" style={{ marginTop: 10, background: 'var(--border)', color: 'var(--phosphor)', display: 'block', textAlign: 'center' }}>FINDCODERS →</Link>
                    <Link href="/app/arena/rankings" className="big-btn yellow" style={{ marginTop: 10, display: 'block', textAlign: 'center' }}>★ GLOBAL LEADERBOARD</Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    {friends.map((f: any) => (
                      <div key={f.uid} onClick={() => navigate.push(`/app/profile/${f.uid}`)} className="flex items-center gap-2 border-[2px] border-black p-2 cursor-pointer hover:bg-[var(--surface2)]">
                        <img src={f.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.displayName}`} className="w-8 h-8 border-[2px] border-black object-cover" alt="" />
                        <span className="font-mono text-xs font-black truncate">{f.displayName}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="ach">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><div style={{ width: 36, height: 36, background: 'var(--phosphor)', border: '3px solid var(--surface)', display: 'grid', placeItems: 'center', color: '#000' }}><Trophy className="w-4 h-4" /></div><div><div className="mono" style={{ fontSize: 8, opacity: 0.6 }}>NEXT UP</div><div style={{ fontFamily: "'Press Start 2P'", fontSize: 9 }}>Arena Gladiator</div></div><span style={{ marginLeft: 'auto', background: 'var(--phosphor)', color: '#000', border: '3px solid var(--surface)', padding: '4px 6px', fontFamily: "'Press Start 2P'", fontSize: 7 }}>1/3</span></div>
              <div className="ach-grid"><div className="mono" style={{ fontSize: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}><span>WIN 3 DUELS</span><span>33%</span></div><div className="bar" style={{ marginTop: 8, height: 12 }}><i style={{ width: '33%', background: 'var(--phosphor)' }} /><i style={{ flex: 1, background: 'var(--surface-2)' }} /></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="robot-corner" onClick={() => showToast('Beep boop! 🤖')} style={{ position: 'fixed', right: 12, bottom: 12, width: 98, zIndex: 30, cursor: 'pointer', filter: 'drop-shadow(4px 4px 0 #000)' }}>
        <div className="speech" id="speech-retro" style={{ position: 'absolute', top: -18, left: -46, background: 'var(--surface)', border: '3px solid var(--border)', boxShadow: '3px 3px 0 var(--border)', padding: '6px 8px', fontFamily: "'Press Start 2P'", fontSize: 6, whiteSpace: 'nowrap', transform: 'rotate(-2deg)' }}>HI {name.toUpperCase()}! ♡</div>
        <div style={{ width: 98, height: 98, background: 'var(--surface)', border: '3px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 32 }}>🤖</div>
      </div>
      {toast && <div className="toast show" style={{ position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: 'var(--border)', color: 'var(--phosphor)', border: '4px solid var(--border)', boxShadow: '6px 6px 0 #000', padding: '12px 16px', fontFamily: "'Press Start 2P'", fontSize: 7, zIndex: 50 }}>✦ {toast}</div>}
    </>
  );
}
