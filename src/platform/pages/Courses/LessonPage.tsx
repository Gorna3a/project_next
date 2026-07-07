'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronRight,
  Clock, BookOpen, Trophy,
} from 'lucide-react';
import { getLesson, type SanityLesson, type SanityQuiz } from '../../../core/services/sanity';
import {
  getCourseProgress, completeLesson, recordQuizResult, startCourse,
} from '../../../core/services/progress';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';


// ─── Portable Text custom components ─────────────────────────────────────────

const ptComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mt-5 mb-2" style={{ color: 'var(--text-primary)' }}>
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-sm leading-7 mb-4" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="border-l-4 pl-4 my-4 italic text-sm"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--accent-subtle)',
        }}
      >
        <div className="py-2">{children}</div>
      </blockquote>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code
        className="px-1.5 py-0.5 rounded text-xs font-mono"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--accent-text)',
          border: '1px solid var(--border)',
        }}
      >
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        {children}
      </strong>
    ),
  },
  types: {
    // Fenced code block
    code: ({ value }: { value: { code: string; language?: string } }) => (
      <div
        className="my-5 rounded-xl overflow-hidden border"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* macOS-style window chrome */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {value.language && (
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {value.language}
            </span>
          )}
        </div>
        <pre
          className="p-4 text-sm overflow-x-auto font-mono leading-6"
          style={{ backgroundColor: '#0a0a0f', color: '#e8e8ff' }}
        >
          <code>{value.code}</code>
        </pre>
      </div>
    ),
    // Info / warning / tip callout
    callout: ({ value }: { value: { variant: string; text: string } }) => {
      const styles: Record<string, { bg: string; border: string; emoji: string }> = {
        info:    { bg: 'rgba(56,189,248,0.08)',  border: '#38bdf8', emoji: 'ℹ️' },
        warning: { bg: 'rgba(251,191,36,0.08)',  border: '#fbbf24', emoji: '⚠️' },
        tip:     { bg: 'rgba(34,197,94,0.08)',   border: '#22c55e', emoji: '💡' },
      };
      const s = styles[value.variant] ?? styles.info;
      return (
        <div
          className="my-4 p-4 rounded-xl border-l-4 text-sm"
          style={{ backgroundColor: s.bg, borderColor: s.border, color: 'var(--text-secondary)' }}
        >
          <span className="mr-2">{s.emoji}</span>
          {value.text}
        </div>
      );
    },
  },
};

// ─── Quiz card ────────────────────────────────────────────────────────────────

interface QuizCardProps {
  quiz:     SanityQuiz;
  index:    number;
  onAnswer: (quizKey: string, correct: boolean) => void;
  answered: Record<string, boolean | null>;
}

const QuizCard = ({ quiz, index, onAnswer, answered }: QuizCardProps) => {
  const { t, isRTL } = useLanguage();

  const [selected, setSelected] = useState<number | null>(null);

  const result    = answered[quiz._key];
  const submitted = result !== undefined && result !== null;

  const handleSelect = (i: number) => {
    if (submitted) return;
    setSelected(i);
    onAnswer(quiz._key, i === quiz.correctIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' as const }}
      className={`card p-5 space-y-4 ${isRTL ? "text-right" : "text-left"}`}
    >
      {/* Question */}
      <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
        >
          {index + 1}
        </div>
        <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {quiz.question}
        </p>
      </div>

      {/* Options */}
      <div className={`space-y-2 ${isRTL ? "pr-9" : "pl-9"}`}>
        {quiz.options.map((opt, i) => {
          const isCorrect  = i === quiz.correctIndex;
          const isSelected = i === selected;

          let bg        = 'var(--bg-elevated)';
          let border    = 'var(--border)';
          let textColor = 'var(--text-secondary)';

          if (submitted) {
            if (isCorrect) {
              bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; textColor = '#22c55e';
            } else if (isSelected && !isCorrect) {
              bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; textColor = '#ef4444';
            }
          } else if (isSelected) {
            bg = 'var(--accent-subtle)'; border = 'var(--accent)'; textColor = 'var(--accent-text)';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`w-full ${isRTL ? "text-right" : "text-left"} px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200`}
              style={{
                backgroundColor: bg,
                border: `1px solid ${border}`,
                color: textColor,
                cursor: submitted ? 'default' : 'pointer',
              }}
            >
              <span className={`font-bold ${isRTL ? "ml-2" : "mr-2"}`}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation revealed after answering */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${isRTL ? "pr-9" : "pl-9"} overflow-hidden`}
          >
            <div
              className="text-xs p-3 rounded-xl"
              style={{
                backgroundColor: result ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className={`font-semibold ${isRTL ? "ml-1" : "mr-1"}`}>
                {result ? `✅ ${t('courses.correct')}!` : `❌ ${t('courses.incorrect')}.`}
              </span>
              {quiz.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ─── Main LessonPage ──────────────────────────────────────────────────────────

export default function LessonPage() {
  const { t, isRTL } = useLanguage();

  const params = useParams();
  const lessonSlug = params.lessonSlug as string;
  const { user }       = useAuth();
  const navigate       = useRouter();
  const contentRef     = useRef<HTMLDivElement>(null);

  const [lesson,          setLesson]          = useState<SanityLesson | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [completing,      setCompleting]      = useState(false);
  const [isCompleted,     setIsCompleted]     = useState(false);
  const [quizAnswers,     setQuizAnswers]     = useState<Record<string, boolean | null>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [allQuizzesDone,  setAllQuizzesDone]  = useState(false);

  // ── Fetch lesson ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!lessonSlug) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const data = await getLesson(lessonSlug);
        setLesson(data);
        if (data && user) {
          try {
            const prog = await getCourseProgress(user.uid, data.course._id);
            setIsCompleted(prog?.completedLessons.includes(data._id) ?? false);
          } catch (e) {
            console.error('Firebase progress fetch failed:', e);
            setIsCompleted(false);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();

    // Reset per-lesson state
    setQuizAnswers({});
    setShowCelebration(false);
    setAllQuizzesDone(false);
    contentRef.current?.scrollTo({ top: 0 });
  }, [lessonSlug, user]);

  // ── Track quiz completion ───────────────────────────────────────────────────

  useEffect(() => {
    const quizzes = lesson?.quizzes || [];
    if (!quizzes.length) return;
    const done = quizzes.every(
      q => quizAnswers[q._key] !== undefined && quizAnswers[q._key] !== null,
    );
    setAllQuizzesDone(done);
  }, [quizAnswers, lesson]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleQuizAnswer = async (quizKey: string, correct: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [quizKey]: correct }));
    if (user && lesson) {
      try {
        const quiz = (lesson.quizzes || []).find(q => q._key === quizKey);
        const quizXp = quiz?.xp ?? 5;
        await recordQuizResult(user.uid, lesson.course._id, quizKey, correct, quizXp);
      } catch (e) { console.error('Failed to record quiz result:', e); }
    }
  };

  const handleComplete = async () => {
    if (!user || !lesson || isCompleted) return;
    setCompleting(true);
    try {
      // Ensure course progress document exists
      try { await startCourse(user.uid, lesson.course._id); } catch(e) {}
      try { await completeLesson(user.uid, lesson.course._id, lesson._id, lesson.course.totalLessons, lesson.xp ?? 10); } catch(e) {}
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } finally {
      setCompleting(false);
    }
  };

  const handleNavigateNext = () => {
    navigate.push(`/app/courses/${lesson?.course.slug}`);
  };

  // ── Loading state ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 rounded w-1/3" style={{ backgroundColor: 'var(--bg-surface)' }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded"
            style={{ backgroundColor: 'var(--bg-surface)', width: `${70 + (i % 3) * 10}%` }}
          />
        ))}
      </div>
    );
  }

  // ── Not found state ─────────────────────────────────────────────────────────

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">📖</p>
        <p style={{ color: 'var(--text-primary)' }}>{t('courses.lessonNotFound')}</p>
        <Link href="/app/courses" className="btn-secondary mt-4 inline-flex">
          {t('courses.backToCourses')}
        </Link>
      </div>
    );
  }

  const correctCount = Object.values(quizAnswers).filter(Boolean).length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`max-w-4xl mx-auto space-y-6 ${isRTL ? "direction-rtl text-right" : "text-left"}`}
    >
      {/* ── Celebration overlay ── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1,   y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}
              className="card p-8 text-center shadow-2xl pointer-events-auto"
            >
              <div className="text-5xl mb-3">🎉</div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('courses.lessonComplete')}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                +10 {t('courses.xpEarned')}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Breadcrumb ── */}
      <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`} style={{ color: 'var(--text-muted)' }}>
        <Link
          href={`/app/courses/${lesson.course.slug}`}
          className={`btn-ghost inline-flex items-center gap-1.5 text-xs ${isRTL ? "-mr-2 flex-row-reverse" : "-ml-2"}`}
        >
          {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />} {lesson.course.title}
        </Link>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
        <span style={{ color: 'var(--text-secondary)' }}>{lesson.title}</span>
      </div>

      {/* ── Lesson header card ── */}
      <div className="card p-6">
        <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {lesson.title}
            </h1>
            <div
              className={`flex items-center gap-4 text-xs ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ color: 'var(--text-muted)' }}
            >
              <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Clock className="w-3.5 h-3.5" /> ~{lesson.estimatedMinutes} {t('courses.estimatedTime')}
              </span>
              <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                <BookOpen className="w-3.5 h-3.5" /> {(lesson.quizzes || []).length} {t('courses.quizzes')}
              </span>
              {isCompleted && (
                <span className={`flex items-center gap-1 text-green-500 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('common.completed')}
                </span>
              )}
            </div>
          </div>

          {/* Mark Complete button */}
          <button
            onClick={handleComplete}
            disabled={completing || isCompleted}
            className={`btn-primary flex-shrink-0 ${
              isCompleted ? 'opacity-60 cursor-not-allowed' : ''
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {completing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> {t('common.completed')}
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" /> {t('courses.markComplete')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Lesson body ── */}
      <div ref={contentRef} className="card p-8">
        <div className={`prose-custom max-w-none ${isRTL ? "text-right" : "text-left"}`}>
          <PortableText value={lesson.body || []} components={ptComponents} />
        </div>
      </div>

      {/* ── Quizzes ── */}
      {(lesson.quizzes || []).length > 0 && (
        <div className="space-y-4">
          <h2
            className={`font-semibold text-sm uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {t('courses.knowledgeCheck')} — {(lesson.quizzes || []).length} {t('courses.questions')}
          </h2>

          {(lesson.quizzes || []).map((quiz, i) => (
            <QuizCard
              key={quiz._key}
              quiz={quiz}
              index={i}
              onAnswer={handleQuizAnswer}
              answered={quizAnswers}
            />
          ))}

          {/* Quiz summary after all are answered */}
          {allQuizzesDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="card p-5 text-center"
            >
              <p className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                🎯 {correctCount} / {(lesson.quizzes || []).length} {t('courses.correct')}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {isCompleted
                  ? t('courses.greatWork')
                  : t('courses.markCompleteToEarn')}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* ── Navigation footer ── */}
      <div className={`flex justify-between items-center py-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Link
          href={`/app/courses/${lesson.course.slug}`}
          className={`btn-secondary gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('courses.courseOverview')}
        </Link>

        {isCompleted && (
          <button onClick={handleNavigateNext} className={`btn-primary gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {t('courses.backToCourse')} {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
