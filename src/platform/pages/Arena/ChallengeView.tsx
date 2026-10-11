'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, Lightbulb, Star,
  CheckCircle2, XCircle, ArrowRight,
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Editor, { type Monaco } from '@monaco-editor/react';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { generateHint } from '../../../core/services/ai';
import { gradeSolution } from '../../../core/services/ai';
import { LANGUAGES } from '../../../core/services/compiler';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useTheme } from '../../../core/context/ThemeContext';
import { Markdown } from '../../../shared/ui/Markdown';
import {
  PIXELCODE_MONACO_THEME,
  MONACO_FONT_FAMILY,
  buildPixelcodeTheme,
} from '../../../shared/ui/monacoTheme';

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
  type?: 'quiz' | 'fix-code' | 'missing-word' | 'optimal-solution' | 'write-solution' | 'run-code';
  options: Record<string, string>;
  correctAnswer: string;
  /** Canonical solution text for `write-solution` (compared after normalizing whitespace) */
  answer?: string;
  /** Prefill for `write-solution` / `run-code` editors */
  starterCode?: string;
  /** Expected trimmed stdout for `run-code` */
  expectedOutput?: string;
  /** When false, the Hint button is hidden — figure it out, that's the game */
  allowHints?: boolean;
  hint?: string;
  explanations?: Record<string, string>;
  tags?: string[];
}

const TYPE_META: Record<string, { label: string; emoji: string; color: string }> = {
  quiz:              { label: 'Quiz',              emoji: '❓', color: '#38bdf8' },
  'fix-code':        { label: 'Fix the Code',      emoji: '🔧', color: '#f97316' },
  'missing-word':    { label: 'Missing Word',      emoji: '🧩', color: '#a855f7' },
  'optimal-solution':{ label: 'Optimal Solution',  emoji: '⚡', color: '#22c55e' },
  'write-solution':  { label: 'Write Solution',    emoji: '✍️', color: '#ec4899' },
  'run-code':        { label: 'Run Code',          emoji: '▶', color: '#14b8b6' },
};

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
  // `write-solution` state
  const [written,     setWritten]     = useState('');
  const [writeCorrect, setWriteCorrect] = useState<boolean | null>(null);
  // `missing-word` write-the-word state (unlimited tries, solution only on solve)
  const [missingInput, setMissingInput] = useState('');
  const [missingWrong, setMissingWrong] = useState(false);
  // `run-code` state (AI-graded, no compiler)
  const [runCodeText, setRunCodeText] = useState('');
  const [grading,     setGrading]     = useState(false);
  // Anti-farming: the canonical solution is never shown on a wrong attempt.
  // After MAX_ATTEMPTS fails the student may reveal it, but a revealed solve
  // completes the challenge for 0 XP.
  const [attempts,    setAttempts]    = useState(0);
  const [revealed,    setRevealed]    = useState(false);
  // `run-code` / `write-solution` AI feedback (verdict from the chatbot's model)
  const [aiFeedback,  setAiFeedback]  = useState<string | null>(null);
  const [aiSolution,  setAiSolution]  = useState<string | null>(null);
  const { themeData } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);

  const DIFFICULTY_CONFIG = {
    easy:   { label: t('common.easy'),   color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
    medium: { label: t('common.medium'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    hard:   { label: t('common.hard'),   color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
    expert: { label: t('common.expert'), color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  };

  // ── Fetch challenge ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    // Fresh attempt state per challenge (also clears stale answers when
    // navigating directly from one challenge to another)
    setSelected(null);
    setAnswered(false);
    setShowResult(false);
    setShowHint(false);
    setHint('');
    setWritten('');
    setWriteCorrect(null);
    setMissingInput('');
    setMissingWrong(false);
    setRunCodeText('');
    setAiFeedback(null);
    setAiSolution(null);
    setAttempts(0);
    setRevealed(false);
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'challenges', id));
        if (snap.exists()) {
          const data = snap.data() as ChallengeData;
          setChallenge(data);
          setWritten(data.starterCode ?? '');
          setRunCodeText(data.starterCode ?? '');
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

  // ── Answer handler (options-based types) ───────────────────────────────────

  const MAX_ATTEMPTS = 3;

  const awardCompletion = async (xpOverride?: number) => {
    if (!user || !challenge) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'completedChallenges'), {
        challengeId: id,
        xp:          xpOverride ?? challenge.xp,
        revealed:    revealed || xpOverride === 0,
        completedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('[ChallengePage] Failed to record completion:', e);
    }
  };

  const handleSelect = async (key: string) => {
    if (answered || !challenge) return;
    setSelected(key);
    setAnswered(true);

    // Award XP to authenticated user when correct
    if (key === challenge.correctAnswer) {
      await awardCompletion();
    }

    // Small delay so the option state paints before the overlay appears
    setTimeout(() => setShowResult(true), 400);
  };

  // ── Answer handler (`missing-word`: type the exact word) ──────────────────
  // Unlimited tries; the solution is only ever shown after solving, so there
  // is nothing to farm.

  const handleMissingSubmit = async () => {
    if (answered || !missingInput.trim()) return;
    const want = (challenge?.options?.[challenge?.correctAnswer ?? ''] ?? '').trim().toLowerCase();
    if (missingInput.trim().toLowerCase() === want && want) {
      setMissingWrong(false);
      setAnswered(true);
      await awardCompletion();
      setTimeout(() => setShowResult(true), 400);
    } else {
      setMissingWrong(true);
    }
  };
  // Wrong attempts show feedback only — the solution stays locked until the
  // student either solves it or reveals it (forfeiting XP) after MAX_ATTEMPTS.

  const handleWriteSubmit = async () => {
    if (answered || grading || !written.trim()) return;
    setGrading(true);
    setAiFeedback(null);
    if (!revealed) setAiSolution(null);
    try {
      const verdict = await gradeSolution({
        title: challenge?.title ?? '',
        language: challenge?.language ?? '',
        task: challenge?.description ?? challenge?.title ?? '',
        reference: challenge?.answer ?? '',
        attempt: written,
      });
      setAiFeedback(verdict.feedback || null);
      setAiSolution(verdict.solution || null);
      if (verdict.correct) {
        setWriteCorrect(true);
        setAnswered(true);
        await awardCompletion(revealed ? 0 : undefined);
        setTimeout(() => setShowResult(true), 400);
      } else {
        setWriteCorrect(false);
        setAttempts(a => a + 1);
      }
    } catch (e) {
      setAiFeedback(e instanceof Error ? e.message : String(e));
      setWriteCorrect(false);
      setAttempts(a => a + 1);
    } finally {
      setGrading(false);
    }
  };

  // ── Answer handler (`run-code`: the chatbot's AI grades the attempt) ───────

  const handleRunSubmit = async () => {
    if (grading || !challenge) return;
    setGrading(true);
    setAiFeedback(null);
    if (!revealed) setAiSolution(null);
    try {
      const verdict = await gradeSolution({
        title: challenge.title,
        language: challenge.language,
        task: challenge.description ?? challenge.title,
        reference: challenge.answer ?? challenge.expectedOutput ?? '',
        attempt: runCodeText,
      });
      setAiFeedback(verdict.feedback || null);
      setAiSolution(verdict.solution || null);
      if (verdict.correct) {
        setAnswered(true);
        await awardCompletion(revealed ? 0 : undefined);
        setTimeout(() => setShowResult(true), 400);
      } else {
        setAttempts(a => a + 1);
      }
    } catch (e) {
      setAiFeedback(e instanceof Error ? e.message : String(e));
      setAttempts(a => a + 1);
    } finally {
      setGrading(false);
    }
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
  const challengeType = challenge.type ?? 'quiz';
  const isWriteType = challengeType === 'write-solution';
  const isRunType = challengeType === 'run-code';
  const isMissingWord = challengeType === 'missing-word';
  const isCorrect = isWriteType
    ? writeCorrect === true
    : isRunType
      ? answered
      : selected === challenge.correctAnswer;
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
                    {t('arena.xpEarned').replace('{count}', (revealed ? 0 : challenge.xp).toString())}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                      {t('arena.correctAnswerLabel')}{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {isWriteType
                          ? challenge.answer
                          : isRunType
                            ? challenge.expectedOutput
                            : challenge.options[challenge.correctAnswer]}
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
                  href="/app/training"
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
      <Link href="/app/training" className={`btn-ghost inline-flex gap-2 -ml-2 text-sm ${isRTL ? 'flex-row-reverse -mr-2 -ml-0' : ''}`}>
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('arena.training')}
      </Link>

      {/* ── Challenge header ──────────────────────────────────────────────────── */}
      <div className="card p-8 space-y-5">
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
          {challenge.type && TYPE_META[challenge.type] && (
            <span
              className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1"
              style={{ backgroundColor: 'var(--bg-subtle)', color: TYPE_META[challenge.type].color }}
            >
              {TYPE_META[challenge.type].emoji} {TYPE_META[challenge.type].label}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold leading-snug"
          style={{ color: 'var(--text-primary)' }}
        >
          {challenge.title}
        </h1>

        {/* Description — Markdown so fenced code renders as a snippet */}
        {challenge.description && (
          <Markdown content={challenge.description} rtl={isRTL} />
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

      {/* ── Options (choice-based types; missing-word uses the input below) ─── */}
      {!isWriteType && !isRunType && !isMissingWord && (
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
      )}

      {/* ── Missing word (type the word) ─────────────────────────────────────── */}
      {isMissingWord && !answered && (
      <div className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Type the missing word
        </p>
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            value={missingInput}
            onChange={e => { setMissingInput(e.target.value); setMissingWrong(false); }}
            onKeyDown={e => { if (e.key === 'Enter') handleMissingSubmit(); }}
            dir="ltr"
            placeholder="…"
            className="input flex-1 font-mono text-sm"
            style={{ textAlign: 'left' }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            onClick={handleMissingSubmit}
            disabled={!missingInput.trim()}
            className="btn-primary text-xs disabled:opacity-50"
          >
            Check
          </button>
        </div>
        {missingWrong && (
          <p className="text-xs font-semibold" style={{ color: '#ef4444' }}>
            Not quite — look at the blank again and try another word.
          </p>
        )}
      </div>
      )}

      {/* ── Written solution (`write-solution`, AI-graded) ─────────────────────── */}
      {isWriteType && (
      <div className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Write your solution — the AI checks it
        </p>
        <textarea
          value={written}
          onChange={e => setWritten(e.target.value)}
          disabled={answered}
          rows={8}
          dir="ltr"
          placeholder="Type your answer here…"
          className="input w-full font-mono text-sm"
          style={{ textAlign: 'left', minHeight: '180px', resize: 'vertical' }}
        />
        {!answered && (
          <button
            onClick={handleWriteSubmit}
            disabled={grading || !written.trim()}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {grading ? 'AI is checking…' : 'Submit solution'}
          </button>
        )}
        {(aiFeedback || (aiSolution && revealed)) && !answered && (
          <div className="card p-5 space-y-3">
            {aiFeedback && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>
                  Why it&apos;s wrong
                </p>
                <Markdown content={aiFeedback} rtl={isRTL} />
              </div>
            )}
            {aiSolution && revealed && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#22c55e' }}>
                  The right answer
                </p>
                <Markdown content={`\`\`\`${challenge.language}\n${aiSolution}\n\`\`\``} rtl={isRTL} />
              </div>
            )}
            {!revealed && attempts >= MAX_ATTEMPTS && (
              <button
                onClick={() => setRevealed(true)}
                className="btn-ghost text-xs"
              >
                Stuck? Reveal the solution — solving afterwards earns 0 XP
              </button>
            )}
            {!revealed && attempts < MAX_ATTEMPTS && aiFeedback && (
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Attempt {attempts} of {MAX_ATTEMPTS} — the solution unlocks after {MAX_ATTEMPTS} failed tries (revealed solves earn no XP).
              </p>
            )}
          </div>
        )}
      </div>
      )}

      {/* ── Coded solution (`run-code`, AI-graded) ───────────────────────────── */}
      {isRunType && (
      <div className="space-y-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Write your code — the AI checks it
        </p>
        <div
          className="rounded-xl overflow-hidden border"
          style={{ borderColor: 'var(--border)' }}
        >
          <Editor
            height="380px"
            language={LANGUAGES[challenge.language]?.monacoLang ?? challenge.language}
            value={runCodeText}
            theme={PIXELCODE_MONACO_THEME}
            beforeMount={(monaco) => {
              monacoRef.current = monaco;
              monaco.editor.defineTheme(PIXELCODE_MONACO_THEME, buildPixelcodeTheme(themeData));
            }}
            onChange={(val) => setRunCodeText(val ?? '')}
            options={{
              fontSize: 13,
              fontFamily: MONACO_FONT_FAMILY,
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: answered,
            }}
          />
        </div>
        {!answered && (
          <button
            onClick={handleRunSubmit}
            disabled={grading || !runCodeText.trim()}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {grading ? 'AI is checking…' : 'Submit for review'}
          </button>
        )}
        {(aiFeedback || (aiSolution && revealed)) && !answered && (
          <div className="card p-5 space-y-3">
            {aiFeedback && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#ef4444' }}>
                  Why it&apos;s wrong
                </p>
                <Markdown content={aiFeedback} rtl={isRTL} />
              </div>
            )}
            {aiSolution && revealed && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#22c55e' }}>
                  The right answer
                </p>
                <Markdown content={`\`\`\`${challenge.language}\n${aiSolution}\n\`\`\``} rtl={isRTL} />
              </div>
            )}
            {!revealed && attempts >= MAX_ATTEMPTS && (
              <button
                onClick={() => setRevealed(true)}
                className="btn-ghost text-xs"
              >
                Stuck? Reveal the solution — solving afterwards earns 0 XP
              </button>
            )}
            {!revealed && attempts < MAX_ATTEMPTS && aiFeedback && (
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Attempt {attempts} of {MAX_ATTEMPTS} — the solution unlocks after {MAX_ATTEMPTS} failed tries (revealed solves earn no XP).
              </p>
            )}
          </div>
        )}
      </div>
      )}

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

      {/* ── Hint panel (only before answering, hidden when allowHints === false) ── */}
      {!answered && challenge.allowHints !== false && (
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
          <Link href="/app/training" className={`btn-secondary gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {t('arena.moreTraining')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
