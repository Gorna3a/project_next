'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { motion, type Variants } from 'framer-motion';
import { Search, Trophy, Star, Zap } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useLanguage } from '../../../core/context/LanguageContext';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
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

const DIFFICULTY_TABS = ['all', 'easy', 'medium', 'hard', 'expert'] as const;
type DifficultyTab = typeof DIFFICULTY_TABS[number];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Challenge {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  language: string;
  xp: number;
  tags?: string[];
  description?: string;
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="card p-5 space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-3 rounded w-1/3" style={{ backgroundColor: 'var(--bg-subtle)' }} />
      <div className="h-3 rounded w-12" style={{ backgroundColor: 'var(--bg-subtle)' }} />
    </div>
    <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--bg-subtle)' }} />
    <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--bg-subtle)' }} />
    <div className="h-8 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }} />
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChallengesPage() {
  const { t, isRTL } = useLanguage();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [diffTab,    setDiffTab]    = useState<DifficultyTab>('all');
  const [langFilter, setLangFilter] = useState('all');

  const DIFFICULTY_CONFIG = {
    easy:   { label: t('common.easy'),   color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'  },
    medium: { label: t('common.medium'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
    hard:   { label: t('common.hard'),   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'  },
    expert: { label: t('common.expert'), color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)' },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'challenges'));
        setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() } as Challenge)));
      } catch (e) {
        console.error('[ChallengesPage] Firestore fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const languages = useMemo(() => {
    const langs = new Set(challenges.map(c => c.language).filter(Boolean));
    return ['all', ...Array.from(langs).sort()];
  }, [challenges]);

  const filtered = useMemo(() => {
    return challenges.filter(c => {
      const matchDiff   = diffTab === 'all' || c.difficulty === diffTab;
      const matchLang   = langFilter === 'all' || c.language === langFilter;
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
      return matchDiff && matchLang && matchSearch;
    });
  }, [challenges, diffTab, langFilter, search]);

  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className={`flex items-start justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🎯 {t('arena.training')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {t('arena.trainingSub')}
          </p>
        </div>

        {challenges.length > 0 && (
          <div
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
          >
            <Trophy className="w-3.5 h-3.5" />
            {t('arena.challengesAvailable').replace('{count}', challenges.length.toString())}
          </div>
        )}
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">

        {/* Difficulty tabs */}
        <div className={`flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {DIFFICULTY_TABS.map(tab => {
            const cfg      = tab !== 'all' ? DIFFICULTY_CONFIG[tab] : null;
            const isActive = diffTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setDiffTab(tab)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize"
                style={{
                  backgroundColor: isActive ? (cfg?.bg ?? 'var(--accent-subtle)') : 'transparent',
                  borderColor:     isActive ? (cfg?.border ?? 'var(--accent)')     : 'var(--border)',
                  color:           isActive ? (cfg?.color ?? 'var(--accent-text)') : 'var(--text-muted)',
                }}
              >
                {tab === 'all' ? t('common.all') : cfg?.label}
              </button>
            );
          })}
        </div>

        {/* Search + language dropdown */}
        <div className={`flex gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            className={`input ${isRTL ? 'text-right' : ''}`}
            style={{ minWidth: '160px' }}
          >
            {languages.map(l => (
              <option key={l} value={l}>
                {l === 'all'
                  ? t('arena.allLanguages')
                  : `${LANGUAGE_META[l]?.emoji ?? ''} ${l.charAt(0).toUpperCase() + l.slice(1)}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Challenge grid ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>

      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Trophy
            className="w-12 h-12 mx-auto opacity-20"
            style={{ color: 'var(--text-muted)' }}
          />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {challenges.length === 0 ? t('arena.noChallengesYet') : t('arena.noChallengesMatch')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {challenges.length === 0
              ? t('arena.addChallengesDesc')
              : t('arena.tryDifferentFilters')}
          </p>
        </div>

      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map(challenge => {
            const diff     = DIFFICULTY_CONFIG[challenge.difficulty] ?? DIFFICULTY_CONFIG.easy;
            const langMeta = LANGUAGE_META[challenge.language];

            return (
              <motion.div
                key={challenge.id}
                variants={fadeUp}
                className={`card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {/* Top row — difficulty + XP */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: diff.bg,
                      borderColor:     diff.border,
                      color:           diff.color,
                    }}
                  >
                    {diff.label}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`}
                    style={{ color: '#f59e0b' }}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {challenge.xp} {t('common.xp')}
                  </div>
                </div>

                {/* Title + description */}
                <div>
                  <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {langMeta && <span className="text-lg">{langMeta.emoji}</span>}
                    <h3
                      className="font-semibold text-sm leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {challenge.title}
                    </h3>
                  </div>
                  {challenge.description && (
                    <p
                      className="text-xs line-clamp-2 leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {challenge.description}
                    </p>
                  )}
                </div>

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div className={`flex flex-wrap gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {challenge.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          color:           'var(--text-muted)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          color:           'var(--text-muted)',
                        }}
                      >
                        +{challenge.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/app/arena/training/${challenge.id}`}
                  className={`btn-primary w-full justify-center text-xs py-2 mt-auto ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {t('arena.startTraining')}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          {t('arena.showingOf').replace('{count}', filtered.length.toString()).replace('{total}', challenges.length.toString())}
        </p>
      )}
    </div>
  );
}
