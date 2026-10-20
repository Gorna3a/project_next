import { Trophy, Zap, Target, Users, Play, Sword, History, Crown } from 'lucide-react';
import Link from "next/link";
import { useLanguage } from '../../../core/context/LanguageContext';

export default function ArenaHub() {
  const { t, isRTL } = useLanguage();

  const stats = [
    { label: t('arena.duelsWon'), value: '0', icon: Sword, bg: 'var(--orange)' },
    { label: t('arena.globalRank'), value: 'N/A', icon: Trophy, bg: 'var(--amber)' },
    { label: t('arena.rating'), value: '1000', icon: Zap, bg: 'var(--phosphor)' },
  ];

  return (
    <div className="space-y-4">
      {/* Hero — CRT cabinet */}
      <div className="crt scan">
        <div className={`relative z-10 max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{
              backgroundColor: 'var(--border)',
              color: 'var(--phosphor)',
              border: '3px solid var(--border)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
            }}
          >
            <span style={{ width: 8, height: 8, backgroundColor: '#FF3B30', border: '2px solid var(--phosphor)', display: 'inline-block' }} className="animate-pulse" />
            {t('arena.liveArena')}
          </div>
          <h1>{t('arena.tagline')}</h1>
          <p className="sub mt-4">
            {t('arena.description')}
          </p>
          <div className={`flex flex-wrap gap-3 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link
              href="/app/arena/duels"
              className="big-btn inline-flex items-center gap-2 !w-auto px-6"
              style={{ backgroundColor: 'var(--border)', color: 'var(--phosphor)' }}
            >
              <Sword style={{ width: 14, height: 14 }} /> {t('arena.findDuel')}
            </Link>
            <Link
              href="/app/training"
              className="big-btn inline-flex items-center gap-2 !w-auto px-6 yellow"
            >
              <Target style={{ width: 14, height: 14 }} /> {t('arena.training')}
            </Link>
          </div>
        </div>
      </div>

      <div className={`grid lg:grid-cols-3 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
        {/* Left Column: Daily quest + stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Daily Challenge */}
          <section>
            <span className="section-label">
              <span className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Crown style={{ width: 12, height: 12 }} /> {t('arena.dailyQuest')}
              </span>
            </span>
            <div className="panel">
              <div className="panel-head">
                <span>{t('arena.expertLogic')}</span>
                <span>{t('arena.endsIn')} 14h 22m</span>
              </div>
              <div className="p-4 space-y-3" style={{ backgroundColor: 'var(--surface)' }}>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="text-lg font-black mb-1" style={{ color: 'var(--fg)' }}>{t('arena.recursiveFibTitle')}</h3>
                  <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--muted)' }}>
                    {t('arena.recursiveFibDesc')}
                  </p>
                </div>
                <div
                  className={`flex items-center justify-between pt-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                  style={{ borderTop: '3px solid var(--border)' }}
                >
                  <div className={`flex items-center gap-4 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--muted)' }}>
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Users style={{ width: 14, height: 14 }} /> {isRTL ? '١،٢٤٢' : '1,242'} {t('arena.joined')}</span>
                    <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><Trophy style={{ width: 14, height: 14, color: 'var(--amber)' }} /> +500 XP</span>
                  </div>
                  <button className={`big-btn yellow !w-auto px-5 inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {t('arena.acceptQuest')} <Play style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Grid */}
          <div className="stats !mt-0">
            {stats.map((stat, i) => (
              <div key={i} className="stat flex flex-col items-center text-center">
                <div
                  className="grid place-items-center mb-2"
                  style={{ width: 44, height: 44, backgroundColor: stat.bg, border: '3px solid var(--border)', boxShadow: '3px 3px 0 var(--border)' }}
                >
                  <stat.icon style={{ width: 20, height: 20, color: '#000' }} />
                </div>
                <b>{stat.value}</b>
                <span className="tag mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity & Top Players */}
        <div className="space-y-4">
          <section>
            <span className="section-label">
              <span className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <History style={{ width: 12, height: 12 }} /> {t('arena.matchHistory')}
              </span>
            </span>
            <div className="panel p-8 text-center text-sm font-bold" style={{ color: 'var(--muted)' }}>
              {t('arena.noRecentDuels')}
            </div>
          </section>

          <section>
            <span className="section-label">
              <span className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Crown style={{ width: 12, height: 12 }} /> {t('arena.topGladiators')}
              </span>
            </span>
            <div className="list">
              {[
                { name: 'pixel_master', rating: 2840, avatar: '🦊' },
                { name: 'bug_hunter', rating: 2715, avatar: '🐱' },
                { name: 'algo_god', rating: 2690, avatar: '🤖' },
              ].map((player, i) => (
                <div key={i} className={`row !cursor-default ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="mono text-xs font-black" style={{ color: 'var(--muted)', width: 24 }}>#{i + 1}</div>
                  <div
                    className="grid place-items-center text-lg"
                    style={{ width: 34, height: 34, backgroundColor: 'var(--surface-2)', border: '3px solid var(--border)', flexShrink: 0 }}
                  >
                    {player.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-sm" style={{ color: 'var(--fg)' }}>{player.name}</div>
                    <div className="mono text-[10px] font-black" style={{ color: 'var(--phosphor-dark)' }}>{player.rating} {t('arena.rating')}</div>
                  </div>
                </div>
              ))}
              <Link href="/app/rankings" className="row justify-center mono text-[10px] font-black" style={{ color: 'var(--fg)' }}>
                {t('arena.viewAllRankings')} →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
