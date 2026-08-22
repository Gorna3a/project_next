'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import { motion, type Variants } from 'framer-motion';
import { Search, Trophy, Star, Zap } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06 } },
};

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   color: '#88D498', bg: '#88D498', border: '#000'  },
  medium: { label: 'Medium', color: '#FFD23F', bg: '#FFD23F', border: '#000' },
  hard:   { label: 'Hard',   color: '#FF6B6B', bg: '#FF6B6B', border: '#000'  },
  expert: { label: 'Expert', color: '#B8A9FA', bg: '#B8A9FA', border: '#000' },
};

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

interface Challenge {
  id: string;
  title: string;
  difficulty: keyof typeof DIFFICULTY_CONFIG;
  language: string;
  xp: number;
  tags?: string[];
  description?: string;
}

const SkeletonCard = () => (
  <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-5 space-y-3 animate-pulse">
    <div className="flex justify-between">
      <div className="h-3 w-1/3 bg-black/10 border border-black" />
      <div className="h-3 w-12 bg-black/10 border border-black" />
    </div>
    <div className="h-4 w-3/4 bg-black/10 border border-black" />
    <div className="h-3 w-1/2 bg-black/10 border border-black" />
    <div className="h-8 border-[3px] border-black bg-black/10" />
  </div>
);

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [diffTab,    setDiffTab]    = useState<DifficultyTab>('all');
  const [langFilter, setLangFilter] = useState('all');

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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white" /> Challenges
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/60 mt-1">
            Test your skills and earn XP — new challenges added regularly
          </p>
        </div>
        {challenges.length > 0 && (
          <span className="inline-flex items-center gap-2 bg-white text-black border-[3px] border-black px-4 py-2 font-mono text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] self-start sm:self-auto">
            <Trophy className="w-3.5 h-3.5" />
            {challenges.length} challenges
          </span>
        )}
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTY_TABS.map(tab => {
            const cfg      = tab !== 'all' ? DIFFICULTY_CONFIG[tab] : null;
            const isActive = diffTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setDiffTab(tab)}
                className={`border-[3px] px-4 py-1.5 font-mono text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
                style={isActive && cfg ? { backgroundColor: cfg.bg, color: '#000', borderColor: '#000' } : {}}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Search challenges…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] pl-9 pr-4 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#000] transition-all"
            />
          </div>

          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-widest cursor-pointer focus:outline-none"
            style={{ minWidth: '160px' }}
          >
            {languages.map(l => (
              <option key={l} value={l}>
                {l === 'all'
                  ? 'All Languages'
                  : `${LANGUAGE_META[l]?.emoji ?? ''} ${l.charAt(0).toUpperCase() + l.slice(1)}`}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>

      ) : filtered.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <p className="font-black text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {challenges.length === 0 ? 'No challenges yet' : 'No challenges match your filters'}
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
            {challenges.length === 0
              ? 'Add challenges to the Firestore "challenges" collection'
              : 'Try different filters or clear your search'}
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
                className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] p-5 flex flex-col gap-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="border-[2px] border-black px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: diff.bg, color: '#000' }}>
                    {diff.label}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs font-black bg-black text-white border-[2px] border-black px-2 py-1">
                    <Star className="w-3.5 h-3.5 fill-current text-[#FFD23F]" />
                    {challenge.xp} XP
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {langMeta && <span className="text-lg">{langMeta.emoji}</span>}
                    <h3 className="font-black text-sm leading-snug text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {challenge.title}
                    </h3>
                  </div>
                  {challenge.description && (
                    <p className="font-mono text-xs leading-relaxed text-black/60 line-clamp-2">
                      {challenge.description}
                    </p>
                  )}
                </div>

                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {challenge.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="border-[2px] border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold">
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span className="border-[2px] border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold">
                        +{challenge.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <Link href={`/app/challenges/${challenge.id}`} className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none w-full flex items-center justify-center gap-2 py-2.5 font-mono text-xs font-black uppercase tracking-widest transition-all mt-auto">
                  <Zap className="w-3.5 h-3.5" />
                  Start Challenge
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {filtered.length > 0 && (
        <p className="font-mono text-xs font-black uppercase tracking-widest text-black/60 text-center">
          Showing {filtered.length} of {challenges.length} challenges
        </p>
      )}
    </div>
  );
}
