'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, Lightbulb, Star,
  CheckCircle2, XCircle, ArrowRight,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { generateHint } from '../../../core/services/ai';
import { useLanguage } from '../../../core/context/LanguageContext';

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChallengeData {
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  language: string;
  xp: number;
  options: Record<string, string>;
  correctAnswer: string;
  hint?: string;
  explanations?: Record<string, string>;
  tags?: string[];
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="max-w-3xl mx-auto animate-pulse space-y-4">
    <div className="h-8 rounded w-1/3" style={{ backgroundColor: 'var(--bg-surface)' }} />
    <div className="h-48 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)' }} />
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-14 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }} />
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChallengeView() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();

  const [challenge,   setChallenge]   = useState<ChallengeData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState<string | null>(null);
  const [answered,    setAnswered]    = useState(false);
  const [hint,        setHint]        = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [showHint,    setShowHint]    = useState(false);
  const [showResult,  setShowResult]  = useState(false);

  const DIFFICULTY_CONFIG = {
    easy:   { label: t('common.easy'),   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
    medium: { label: t('common.medium'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    hard:   { label: t('common.hard'),   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
    expert: { label: t('common.expert'), color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  };

  // ── Fetch challenge ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'challenges', id));
        if (snap.exists()) {
          setChallenge(snap.data() as ChallengeData);
        } else {
          navigate.replace('/app/challenges');
        }
      } catch (e) {
        console.error('[ChallengePage] Firestore fetch failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  // ── Answer handler ───────────────────────────────────────────────────────────
  const handleSelect = async (key: string) => {
    if (answered || !challenge) return;
    setSelected(key);
    setAnswered(true);

    // Award XP to authenticated user when correct
    if (key === challenge.correctAnswer && user) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'completedChallenges'), {
          challengeId: id,
          xp:          challenge.xp,
          completedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error('[ChallengePage] Failed to record completion:', e);
      }
    }

    // Small delay so the option state paints before the overlay appears
    setTimeout(() => setShowResult(true), 400);
  };

  // ── Hint handler ─────────────────────────────────────────────────────────────
  const handleGetHint = async () => {
    if (!challenge || loadingHint) return;
    setLoadingHint(true);
    setShowHint(true);
    try {
      const aiHint = challenge.hint
        ? challenge.hint
        : await generateHint(challenge.title, Object.values(challenge.options));
      setHint(aiHint);
    } catch {
      setHint(t('arena.thinkCarefully'));
    } finally {
      setLoadingHint(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />;
  if (!challenge) return null;

  const optionsArray = Object.entries(challenge.options).sort(([a], [b]) => Number(a) - Number(b));
  const isCorrect    = selected === challenge.correctAnswer;
  const diff         = DIFFICULTY_CONFIG[challenge.difficulty] ?? DIFFICULTY_CONFIG.easy;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" className={`max-w-3xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>

      {/* ── Result overlay ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{   scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' as const }}
              className="card p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Emoji */}
              <div className="text-6xl">{isCorrect ? '🎉' : '😅'}</div>

              {/* Headline */}
              <div>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {isCorrect ? t('arena.correct') : t('arena.notQuite')}
                </h2>

                {isCorrect ? (
                  <div className={`flex items-center justify-center gap-2 text-yellow-500 font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Star className="w-5 h-5 fill-current" />
                    {t('arena.xpEarned').replace('{count}', challenge.xp.toString())}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                      {t('arena.correctAnswerLabel')}{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {challenge.options[challenge.correctAnswer]}
                      </strong>
                    </p>
                    {challenge.explanations?.[challenge.correctAnswer] && (
                      <p
                        className="text-xs leading-relaxed p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-subtle)' }}
                      >
                        {challenge.explanations[challenge.correctAnswer]}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setShowResult(false)}
                  className="btn-secondary flex-1"
                >
                  {t('arena.review')}
                </button>
                <Link
                  href="/app/arena/training"
                  className={`btn-primary flex-1 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {t('arena.more')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Back link ────────────────────────────────────────────────────────── */}
      <Link href="/app/arena/training" className={`btn-ghost inline-flex gap-2 -ml-2 text-sm ${isRTL ? 'flex-row-reverse -mr-2 -ml-0' : ''}`}>
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('arena.training')}
      </Link>

      {/* ── Challenge header ──────────────────────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        {/* Meta row */}
        <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: diff.bg, color: diff.color }}
          >
            {diff.label}
          </span>
          <span
            className={`text-xs font-bold flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: '#f59e0b' }}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            {challenge.xp} {t('common.xp')}
          </span>
          {challenge.language && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
            >
              {challenge.language}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-xl font-bold leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {challenge.title}
        </h1>

        {/* Description */}
        {challenge.description && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {challenge.description}
          </p>
        )}

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 pt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {challenge.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Options ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('arena.chooseAnswer')}
        </p>

        {optionsArray.map(([key, value]) => {
          const isThis       = key === selected;
          const isCorrectOpt = key === challenge.correctAnswer;

          // Default styles
          let bg        = 'var(--bg-surface)';
          let border    = 'var(--border)';
          let textColor = 'var(--text-primary)';
          let icon: React.ReactNode = null;

          if (answered) {
            if (isCorrectOpt) {
              bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; textColor = '#22c55e';
              icon = <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />;
            } else if (isThis) {
              bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; textColor = '#ef4444';
              icon = <XCircle className={`w-5 h-5 flex-shrink-0 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />;
            } else {
              textColor = 'var(--text-muted)';
            }
          }

          return (
            <motion.button
              key={key}
              whileHover={!answered ? { scale: 1.01 } : {}}
              whileTap={!answered ? { scale: 0.99 } : {}}
              onClick={() => handleSelect(key)}
              disabled={answered}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
              style={{
                backgroundColor: bg,
                borderColor:     border,
                color:           textColor,
                cursor:          answered ? 'default' : 'pointer',
              }}
            >
              {/* Letter label */}
              <span
                className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ borderColor: border }}
              >
                {String.fromCharCode(65 + Number(key))}
              </span>

              {/* Option text — preserve whitespace for code snippets */}
              <pre
                className={`whitespace-pre-wrap flex-1 font-mono text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}
                style={{ fontFamily: 'inherit' }}
              >
                {value}
              </pre>

              {/* Correct / wrong icon */}
              {icon}
            </motion.button>
          );
        })}
      </div>

      {/* ── Per-option explanation (shown after wrong answer) ─────────────────── */}
      <AnimatePresence>
        {answered && selected && challenge.explanations?.[selected] && selected !== challenge.correctAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className={`p-4 rounded-xl text-sm ${isRTL ? 'text-right' : 'text-left'}`}
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              color:           'var(--text-secondary)',
              border:          '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <strong>{t('arena.whyNot')}</strong> {challenge.explanations[selected]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hint panel (only before answering) ───────────────────────────────── */}
      {!answered && (
        <div className="space-y-3">
          {!showHint ? (
            <button
              onClick={handleGetHint}
              disabled={loadingHint}
              className={`btn-ghost flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Lightbulb className="w-4 h-4" style={{ color: '#f59e0b' }} />
              {loadingHint ? t('arena.gettingHint') : t('arena.getHintPenalty')}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' as const }}
              className={`p-4 rounded-xl border ${isRTL ? 'text-right' : 'text-left'}`}
              style={{
                backgroundColor: 'rgba(245,158,11,0.08)',
                borderColor:     'rgba(245,158,11,0.3)',
              }}
            >
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lightbulb className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
                  {t('arena.hintLabel')}
                </span>
              </div>

              {loadingHint ? (
                <div className={`flex gap-1.5 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#f59e0b' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#f59e0b', animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#f59e0b', animationDelay: '0.3s' }} />
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{hint}</p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* ── Post-answer actions ───────────────────────────────────────────────── */}
      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' as const }}
          className={`flex gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <button
            onClick={() => setShowResult(true)}
            className={`btn-primary gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isCorrect
              ? <><CheckCircle2 className="w-4 h-4" /> {t('arena.viewResult')}</>
              : <><XCircle className="w-4 h-4" /> {t('arena.viewResult')}</>}
          </button>
          <Link href="/app/arena/training" className={`btn-secondary gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {t('arena.moreTraining')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
