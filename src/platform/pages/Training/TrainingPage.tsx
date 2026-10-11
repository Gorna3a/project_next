'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { motion, type Variants } from 'framer-motion';
import { Search, Trophy, Star, Zap, Target, Flame, Calendar } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05 } },
};

// ─── Config ───────────────────────────────────────────────────────────────────

const LANGUAGE_META: Record<string, { emoji: string }> = {
  python:     { emoji: '🐍' },
  javascript: { emoji: '⚡' },
  typescript: { emoji: '📘' },
  java:       { emoji: '☕' },
  c:          { emoji: '⚙️' },
  cpp:        { emoji: '🔧' },
  go:         { emoji: '🐹' },
  rust:       { emoji: '🦀' },
  kotlin:     { emoji: '🎯' },
  swift:      { emoji: '🍎' },
  csharp:     { emoji: '🎮' },
  ruby:       { emoji: '💎' },
  php:        { emoji: '🐘' },
};

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'expert'] as const;
type Difficulty = typeof DIFFICULTY_ORDER[number];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  easy:   { label: 'Easy',   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  emoji: '🌱' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', emoji: '🔥' },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  emoji: '💀' },
  expert: { label: 'Expert', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', emoji: '👑' },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Challenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  language: string;
  xp: number;
  type?: 'quiz' | 'fix-code' | 'missing-word' | 'optimal-solution' | 'write-solution' | 'run-code';
  tags?: string[];
  description?: string;
}

interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  difficulty: Difficulty;
  language: string;
  xp: number;
  type?: Challenge['type'];
  challengeId?: string;
}

const TYPE_META: Record<NonNullable<Challenge['type']>, { label: string; emoji: string; color: string }> = {
  quiz:              { label: 'Quiz',              emoji: '❓', color: '#38bdf8' },
  'fix-code':        { label: 'Fix the Code',      emoji: '🔧', color: '#f97316' },
  'missing-word':    { label: 'Missing Word',      emoji: '🧩', color: '#a855f7' },
  'optimal-solution':{ label: 'Optimal Solution',  emoji: '⚡', color: '#22c55e' },
  'write-solution':  { label: 'Write Solution',    emoji: '✍️', color: '#ec4899' },
  'run-code':        { label: 'Run Code',          emoji: '▶', color: '#14b8b6' },
};

interface CompletedChallenge {
  challengeId?: string;
  xp?: number;
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="h-14 rounded-xl animate-pulse mb-2" style={{ backgroundColor: 'var(--bg-subtle)' }} />
);

// ─── Challenge row (shared by quest sections + Completed section) ────────────

const ChallengeRow = ({ challenge, index, solved }: { challenge: Challenge; index: number; solved: boolean }) => {
  const { t, isRTL } = useLanguage();
  const langMeta = LANGUAGE_META[challenge.language];
  return (
    <motion.div
      variants={fadeUp}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
        solved
          ? 'border-green-500/60'
          : 'hover:shadow-sm'
      }`}
      style={{
        backgroundColor: solved ? 'rgba(34,197,94,0.07)' : 'var(--bg-surface)',
        borderColor: solved ? undefined : 'var(--border)',
      }}
    >
      {/* Index / solved badge */}
      <div className="w-6 text-center">
        {solved ? (
          <span className="text-green-500 font-bold text-sm">✓</span>
        ) : (
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{index + 1}</span>
        )}
      </div>

      <Link href={`/app/training/${challenge.id}`} className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {langMeta && <span>{langMeta.emoji}</span>}
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {challenge.title}
          </h3>
          {solved && (
            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
              Solved
            </span>
          )}
        </div>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
          {challenge.description?.split('\n')[0] ?? ''}
        </p>
      </Link>

      {/* Tags */}
      {challenge.tags && challenge.tags.length > 0 && (
        <div className={`hidden sm:flex flex-wrap gap-1 justify-end ${isRTL ? 'flex-row-reverse' : ''}`}>
          {challenge.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              {tag}
            </span>
          ))}
          {challenge.tags.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
              +{challenge.tags.length - 2}
            </span>
          )}
        </div>
      )}

      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border"
        style={{ backgroundColor: DIFFICULTY_CONFIG[challenge.difficulty].bg, borderColor: DIFFICULTY_CONFIG[challenge.difficulty].border, color: DIFFICULTY_CONFIG[challenge.difficulty].color }}>
        {DIFFICULTY_CONFIG[challenge.difficulty].label}
      </span>

      {challenge.type && TYPE_META[challenge.type] && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
          style={{ borderColor: TYPE_META[challenge.type].color, color: TYPE_META[challenge.type].color }}>
          {TYPE_META[challenge.type].emoji} {TYPE_META[challenge.type].label}
        </span>
      )}

      <span className={`flex items-center gap-1 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#f59e0b' }}>
        <Star className="w-3 h-3 fill-current" />
        {challenge.xp}
      </span>

      <Link href={`/app/training/${challenge.id}`} className={`btn-primary text-[10px] px-3 py-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Zap className="w-3 h-3" />
        {solved ? t('common.review') ?? 'Review' : t('arena.startTraining')}
      </Link>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedMap, setCompletedMap] = useState<Record<string, number>>({});
  const [daily,        setDaily]        = useState<DailyChallenge[]>([]);
  const [sortMode,     setSortMode]     = useState<'difficulty' | 'type' | 'xp-desc' | 'xp-asc' | 'az'>('difficulty');
  const [showCompleted, setShowCompleted] = useState(true);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [langFilter, setLangFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'challenges'));
        setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() } as Challenge)));
      } catch (e) {
        console.error('[TrainingPage] Firestore fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadDaily = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'dailyChallenges'), orderBy('date', 'desc')));
        setDaily(snap.docs.map(d => ({ id: d.id, ...d.data() } as DailyChallenge)));
      } catch (e) {
        console.error('[TrainingPage] dailyChallenges fetch failed:', e);
      }
    };
    loadDaily();
  }, []);

  useEffect(() => {
    if (!user) {
      setCompletedMap({});
      return;
    }
    const loadCompleted = async () => {
      try {
        const snap = await getDocs(collection(db, 'users', user.uid, 'completedChallenges'));
        const map: Record<string, number> = {};
        snap.docs.forEach(d => {
          const data = d.data() as CompletedChallenge;
          if (data.challengeId) map[data.challengeId] = data.xp ?? 0;
        });
        setCompletedMap(map);
      } catch (e) {
        console.error('[TrainingPage] completedChallenges fetch failed:', e);
      }
    };
    loadCompleted();
  }, [user]);

  const languages = useMemo(() => {
    const langs = new Set(challenges.map(c => c.language).filter(Boolean));
    return ['all', ...Array.from(langs).sort()];
  }, [challenges]);

  const filtered = useMemo(() => {
    // Main quest list never mixes solved items in — they live in Completed below
    return challenges.filter(c => {
      const matchLang   = langFilter === 'all' || c.language === langFilter;
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
      const unsolved    = completedMap[c.id] === undefined;
      return matchLang && matchSearch && unsolved;
    });
  }, [challenges, langFilter, search, completedMap]);

  // Solved challenges matching search/language (ignores the hide-completed toggle)
  const solvedList = useMemo(() => {
    const term = search.trim().toLowerCase();
    return challenges.filter(c =>
      completedMap[c.id] !== undefined &&
      (langFilter === 'all' || c.language === langFilter) &&
      (!term || c.title.toLowerCase().includes(term)),
    );
  }, [challenges, completedMap, langFilter, search]);

  const solvedCount = useMemo(
    () => challenges.filter(c => completedMap[c.id] !== undefined).length,
    [challenges, completedMap],
  );

  const xpEarned = useMemo(
    () => Object.values(completedMap).reduce((sum, xp) => sum + (xp || 0), 0),
    [completedMap],
  );

  interface Section { key: string; label: string; emoji: string; color: string; items: Challenge[] }
  const sections = useMemo<Section[]>(() => {
    if (sortMode === 'type') {
      const order: NonNullable<Challenge['type']>[] = ['quiz', 'fix-code', 'missing-word', 'optimal-solution', 'write-solution', 'run-code'];
      return order
        .map(t => ({ key: t!, label: TYPE_META[t!].label, emoji: TYPE_META[t!].emoji, color: TYPE_META[t!].color, items: filtered.filter(c => (c.type ?? 'quiz') === t) }))
        .filter(s => s.items.length > 0);
    }
    if (sortMode !== 'difficulty') {
      const items = [...filtered];
      if (sortMode === 'xp-desc') items.sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));
      if (sortMode === 'xp-asc') items.sort((a, b) => (a.xp ?? 0) - (b.xp ?? 0));
      if (sortMode === 'az') items.sort((a, b) => a.title.localeCompare(b.title));
      return [{ key: 'all', label: 'All challenges', emoji: '🎯', color: 'var(--text-muted)', items }];
    }
    const grouped: Record<Difficulty, Challenge[]> = { easy: [], medium: [], hard: [], expert: [] };
    filtered.forEach(c => { if (grouped[c.difficulty]) grouped[c.difficulty].push(c); });
    return DIFFICULTY_ORDER
      .map(d => ({ key: d, label: DIFFICULTY_CONFIG[d].label, emoji: DIFFICULTY_CONFIG[d].emoji, color: DIFFICULTY_CONFIG[d].color, items: grouped[d] }))
      .filter(s => s.items.length > 0);
  }, [filtered, sortMode]);

  return (
    <div className={`max-w-6xl mx-auto space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>

      {/* ── Header — quest vibes ───────────────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent-text)' }} />
              {t('arena.training')}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('arena.trainingSub')}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Flame className="w-4 h-4" style={{ color: '#f97316' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              {solvedCount} / {challenges.length} solved
            </span>
            <span className="mx-1" style={{ color: 'var(--border-subtle)' }}>•</span>
            <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
            <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
              {xpEarned} XP earned
            </span>
          </div>
        </div>

        {/* XP progress bar */}
        <div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            <span>Progress</span>
            <span>{challenges.length === 0 ? 0 : Math.round((solvedCount / challenges.length) * 100)}%</span>
          </div>
          <div className="mt-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${challenges.length === 0 ? 0 : (solvedCount / challenges.length) * 100}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Daily challenge ────────────────────────────────────────────────── */}
      {(() => {
        const todayKey = new Date().toISOString().slice(0, 10);
        const todayDaily = daily.find(d => d.date === todayKey);
        const pastDaily = daily.filter(d => d.date !== todayKey);
        const dailyCfg = todayDaily ? DIFFICULTY_CONFIG[todayDaily.difficulty] : null;
        const dailyType = todayDaily?.type ?? 'quiz';
        // Done when the backing challenge has a solve record
        const todayDone = !!todayDaily && todayDaily.challengeId != null && completedMap[todayDaily.challengeId] !== undefined;
        return (
          <>
            {todayDaily && dailyCfg && (
              <div className="card p-6 border-2" style={{
                borderColor: todayDone ? '#22c55e' : dailyType !== 'quiz' ? TYPE_META[dailyType].color : 'var(--border)',
                backgroundColor: todayDone ? 'rgba(34,197,94,0.06)' : undefined,
              }}>
                <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: todayDone ? 'rgba(34,197,94,0.15)' : 'var(--accent-subtle)', color: todayDone ? '#22c55e' : 'var(--accent-text)' }}>
                      {todayDone ? '✓ Daily Done' : (<><Flame className="w-3 h-3" /> Daily Quest</>)}
                    </span>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{todayDaily.title}</h2>
                    <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ backgroundColor: dailyCfg.bg, borderColor: dailyCfg.border, color: dailyCfg.color }}>{dailyCfg.emoji} {dailyCfg.label}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ borderColor: TYPE_META[dailyType].color, color: TYPE_META[dailyType].color }}>{TYPE_META[dailyType].emoji} {TYPE_META[dailyType].label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>{todayDaily.language}</span>
                      <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>⭐ {todayDaily.xp} XP</span>
                      <span className="text-[10px] tracking-widest" style={{ color: 'var(--text-muted)' }}>{todayDaily.date}</span>
                    </div>
                  </div>
                  <Link href={`/app/training/${todayDaily.challengeId ?? todayDaily.id}`} className="btn-primary text-xs">
                    {todayDone ? 'Review Daily' : 'Start Daily'}
                  </Link>
                </div>
              </div>
            )}

            {pastDaily.length > 0 && (
              <div className="card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3.5 h-3.5 inline-block mr-1" /> Daily archive
                </h3>
                <div className="space-y-2">
                  {pastDaily.map(d => {
                    const wasSolved = d.challengeId != null && completedMap[d.challengeId] !== undefined;
                    return (
                    <div key={d.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${wasSolved ? '' : 'opacity-60'} ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{ borderColor: wasSolved ? '#22c55e' : 'var(--border-subtle)', backgroundColor: wasSolved ? 'rgba(34,197,94,0.06)' : undefined }}>
                      <span aria-hidden>{wasSolved ? '✅' : '🔒'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{d.title}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{d.date} · {d.difficulty}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: wasSolved ? '#22c55e' : 'var(--text-muted)' }}>
                        {wasSolved ? 'Done' : 'Expired'}
                      </span>
                    </div>
                    );
                  })}
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Past dailies are visible for reference — publishing ends, so you can still review the content but cannot earn XP anymore.
                </p>
              </div>
            )}
          </>
        );
      })()}

      {/* ── Filters: search + compact dropdowns ──────────────────────────────── */}
      <div className="space-y-3">
        <div className={`flex gap-2 flex-wrap items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative flex-1 min-w-48">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${isRTL ? 'right-3' : 'left-3'}`}
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder={t('arena.searchChallenges')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`input ${isRTL ? 'pr-9 text-right' : 'pl-9'}`}
            />
          </div>

          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className={`input !w-auto ${isRTL ? 'text-right' : ''}`}
            style={{ minWidth: '130px' }}
            aria-label="Filter by language"
          >
            {languages.map(l => (
              <option key={l} value={l}>
                {l === 'all'
                  ? t('arena.allLanguages')
                  : `${LANGUAGE_META[l]?.emoji ?? ''} ${l.charAt(0).toUpperCase() + l.slice(1)}`}
              </option>
            ))}
          </select>

          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as typeof sortMode)}
            className={`input !w-auto ${isRTL ? 'text-right' : ''}`}
            style={{ minWidth: '130px' }}
            aria-label="Sort by"
          >
            <option value="difficulty">Difficulty</option>
            <option value="type">Quiz type</option>
            <option value="xp-desc">XP: high → low</option>
            <option value="xp-asc">XP: low → high</option>
            <option value="az">Title A–Z</option>
          </select>
        </div>

        <label className={`flex items-center gap-2 text-xs font-semibold cursor-pointer select-none ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={e => setShowCompleted(e.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          Show completed ({solvedCount})
        </label>
      </div>

      {/* ── Quest list by difficulty ───────────────────────────────────────── */}
      {loading ? (
        <div>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Trophy className="w-12 h-12 mx-auto opacity-20" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {challenges.length === 0 ? t('arena.noChallengesYet') : t('arena.noChallengesMatch')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {challenges.length === 0 ? t('arena.addChallengesDesc') : t('arena.tryDifferentFilters')}
          </p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
          {sections.map(section => {
            const levelChallenges = section.items;
            const cfg = { label: section.label, emoji: section.emoji, color: section.color };
            return (
              <section key={section.key}>
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg">{cfg.emoji}</span>
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                    {cfg.label} · {levelChallenges.length} {levelChallenges.length === 1 ? 'challenge' : 'challenges'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {levelChallenges.map((challenge, idx) => (
                    <ChallengeRow
                      key={challenge.id}
                      challenge={challenge}
                      index={idx}
                      solved={completedMap[challenge.id] !== undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </motion.div>
      )}

      {/* ── Completed section ──────────────────────────────────────────────── */}
      {!loading && showCompleted && solvedList.length > 0 && (
        <section>
          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg">✅</span>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#22c55e' }}>
              Completed · {solvedList.length} {solvedList.length === 1 ? 'challenge' : 'challenges'}
            </h2>
          </div>
          <div className="space-y-2">
            {solvedList.map((challenge, idx) => (
              <ChallengeRow key={challenge.id} challenge={challenge} index={idx} solved />
            ))}
          </div>
        </section>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} / {challenges.length} shown
        </p>
      )}
    </div>
  );
}
