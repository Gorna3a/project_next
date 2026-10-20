'use client';

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronRight,
  Clock, BookOpen, Trophy, FlaskConical, Eye, EyeOff,
} from 'lucide-react';
import {
  getLesson,
  getModulesForCourse,
  type SanityLesson,
  type SanityLessonLite,
  type QuizQuestion,
  type WorkshopStep,
  type CodeBlockObj,
  type TestCaseObj,
} from '../../../core/services/sanity';
import {
  getCourseProgress, completeLesson, recordQuizResult, startCourse,
} from '../../../core/services/progress';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { Markdown } from '../../../shared/ui/Markdown';
import { InteractiveCode, resolveLanguage } from '../../../shared/ui/InteractiveCode';

// ─── Small building blocks ────────────────────────────────────────────────────

const CodeView = ({ block, title, interactive = false }: { block?: CodeBlockObj; title?: string; interactive?: boolean }) => {
  if (!block?.code?.trim()) return null;
  if (interactive && resolveLanguage(block.language)) {
    return <InteractiveCode language={block.language} code={block.code} title={title} />;
  }
  return (
    <div className="my-4 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {title ?? block.language ?? 'code'}
        </span>
      </div>
      <pre
        className="p-4 text-sm overflow-x-auto font-mono leading-6"
        style={{ backgroundColor: '#0a0a0f', color: '#e8e8ff' }}
      >
        <code>{block.code}</code>
      </pre>
    </div>
  );
};

const TestsList = ({ tests }: { tests?: TestCaseObj[] }) => {
  if (!tests?.length) return null;
  return (
    <div className="space-y-1.5">
      {tests.map((test) => (
        <div
          key={test._key}
          className="flex items-start gap-2 text-xs px-3 py-2 rounded-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
        >
          <FlaskConical className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
          <div>
            <span className="font-mono font-bold" style={{ color: 'var(--text-muted)' }}>{test.type}</span>
            <span className="ml-2">{test.message}</span>
            {test.required && <span className="ml-2 font-bold text-red-400">required</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Quiz card (v2: single | multiple | true-false | code-output) ─────────────

interface QuizCardProps {
  question: QuizQuestion;
  index:    number;
  onAnswer: (questionKey: string, correct: boolean) => void;
  answered: Record<string, boolean | null>;
}

const QuizCard = ({ question, index, onAnswer, answered }: QuizCardProps) => {
  const { t, isRTL } = useLanguage();

  const [selected, setSelected] = useState<number[]>([]);

  const result    = answered[question._key];
  const submitted = result !== undefined && result !== null;
  const multi     = question.questionType === 'multiple';
  const correctSet = new Set(
    (question.options ?? []).map((o, i) => (o.correct ? i : -1)).filter(i => i >= 0),
  );

  const submit = (selection: number[]) => {
    const sel = new Set(selection);
    const correct = sel.size === correctSet.size && [...sel].every(i => correctSet.has(i));
    onAnswer(question._key, correct);
  };

  const handleSelect = (i: number) => {
    if (submitted) return;
    if (multi) {
      setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    } else {
      setSelected([i]);
      submit([i]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' as const }}
      className={`card p-5 space-y-4 ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="inline-block mb-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
          >
            {question.questionType ?? 'single'} • {question.points ?? 1}pt
          </span>
          <Markdown content={question.prompt} rtl={isRTL} />
        </div>
      </div>

      <div className={`space-y-2 ${isRTL ? "pr-9" : "pl-9"}`}>
        {(question.options ?? []).map((opt, i) => {
          const isCorrect  = correctSet.has(i);
          const isSelected = selected.includes(i);

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
              key={opt._key}
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
              <span className={`font-bold ${isRTL ? "ml-2" : "mr-2"}`}>
                {multi ? (isSelected ? '☑' : '☐') : `${String.fromCharCode(65 + i)}.`}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {multi && !submitted && (
        <div className={`${isRTL ? "pr-9" : "pl-9"}`}>
          <button
            onClick={() => submit(selected)}
            disabled={selected.length === 0}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {t('courses.submitAnswer')}
          </button>
        </div>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${isRTL ? "pr-9" : "pl-9"} overflow-hidden`}
          >
            <div
              className="text-xs p-3 rounded-xl space-y-1"
              style={{
                backgroundColor: result ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                color: 'var(--text-secondary)',
              }}
            >
              <p>
                <span className={`font-semibold ${isRTL ? "ml-1" : "mr-1"}`}>
                  {result ? `✅ ${t('courses.correct')}!` : `❌ ${t('courses.incorrect')}.`}
                </span>
                {question.explanation}
              </p>
              {question.hint && <p className="opacity-80">💡 {question.hint}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Workshop step card ───────────────────────────────────────────────────────

const StepCard = ({ step, index }: { step: WorkshopStep; index: number }) => {
  const { isRTL, t } = useLanguage();
  const [showSolution, setShowSolution] = useState(false);
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-5 py-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
        >
          {step.number ?? index + 1}
        </div>
        <span className="flex-1 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {step.title}
        </span>
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''} ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {step.instructions && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                {t('courses.instructions')}
              </p>
              <Markdown content={step.instructions} rtl={isRTL} />
            </div>
          )}

          {(step.hints?.length ?? 0) > 0 && (
            <div className="rounded-xl p-3 text-xs space-y-1" style={{ backgroundColor: 'rgba(251,191,36,0.08)', color: 'var(--text-secondary)' }}>
              {(step.hints ?? []).map((hint, i) => (
                <p key={i}>💡 <strong>Hint {i + 1}:</strong> {hint}</p>
              ))}
            </div>
          )}

          <CodeView block={step.starter} title="Starter code" interactive />
          <TestsList tests={step.tests} />

          <div>
            <button
              onClick={() => setShowSolution(s => !s)}
              className="btn-ghost text-xs inline-flex items-center gap-1.5"
            >
              {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showSolution ? t('courses.hideSolution') : t('courses.showSolution')}
            </button>
            {showSolution && <CodeView block={step.solution} title="Solution" />}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const KIND_LABEL: Record<string, string> = {
  theory: '📘 Theory',
  workshop: '🛠 Workshop',
  lab: '🧪 Lab',
  review: '📝 Review',
  quiz: '❓ Quiz',
  'certification-project': '🎓 Certification Project',
};

// ─── Main LessonPage ──────────────────────────────────────────────────────────

export default function LessonPage() {
  const { t, isRTL } = useLanguage();

  const params = useParams();
  const lessonId = params.lessonSlug as string;
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
  const [showReference,   setShowReference]   = useState(false);
  const [nextLessonId,    setNextLessonId]    = useState<string | null>(null);

  // ── Fetch lesson ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const data = await getLesson(lessonId);
        setLesson(data);
        if (data && user) {
          try {
            const prog = await getCourseProgress(user.uid, data.module.course._id);
            setIsCompleted(prog?.completedLessons.includes(data._id) ?? false);
          } catch (e) {
            console.error('Firebase progress fetch failed:', e);
            setIsCompleted(false);
          }
        }
        if (data) {
          try {
            const modules = await getModulesForCourse(data.module.course._id);
            const all = modules.flatMap(m => [...(m.items ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
            const idx = all.findIndex(l => l._id === data._id);
            setNextLessonId(idx >= 0 && idx + 1 < all.length ? (all[idx + 1].contentId || all[idx + 1]._id) : null);
          } catch (e) {
            console.error('Failed to resolve next lesson:', e);
            setNextLessonId(null);
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
    setShowReference(false);
    setNextLessonId(null);
    contentRef.current?.scrollTo({ top: 0 });
  }, [lessonId, user]);

  // ── Track quiz completion ───────────────────────────────────────────────────

  useEffect(() => {
    const questions = lesson?.questions || [];
    if (!questions.length) return;
    const done = questions.every(
      q => quizAnswers[q._key] !== undefined && quizAnswers[q._key] !== null,
    );
    setAllQuizzesDone(done);
  }, [quizAnswers, lesson]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleQuizAnswer = async (questionKey: string, correct: boolean) => {
    setQuizAnswers(prev => ({ ...prev, [questionKey]: correct }));
    if (user && lesson) {
      try {
        const question = (lesson.questions || []).find(q => q._key === questionKey);
        await recordQuizResult(user.uid, lesson.module.course._id, questionKey, correct, question?.points ?? 1);
      } catch (e) { console.error('Failed to record quiz result:', e); }
    }
  };

  const completeCurrentLesson = async (withCelebration: boolean) => {
    if (!user || !lesson || isCompleted) return;
    setCompleting(true);
    try {
      const courseId = lesson.module.course._id;
      const total = lesson.module.lessonCount || 1;
      try { await startCourse(user.uid, courseId); } catch(e) { console.error(e); }
      try { await completeLesson(user.uid, courseId, lesson._id, total, 10); } catch(e) { console.error(e); }
      setIsCompleted(true);
      if (withCelebration) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } finally {
      setCompleting(false);
    }
  };

  const handleComplete = () => completeCurrentLesson(true);

  const handleNavigateNext = async () => {
    // Advancing to the next lesson (or back to the course) marks this one complete.
    await completeCurrentLesson(false);
    if (nextLessonId) {
      navigate.push(`/app/lesson/${nextLessonId}`);
    } else {
      navigate.push(`/app/courses/${lesson?.module.course.slug}`);
    }
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
  const questions = lesson.questions ?? [];
  const estimated = lesson.estimatedMinutes ?? (lesson.estimatedHours != null ? lesson.estimatedHours * 60 : null);

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
          href={`/app/courses/${lesson.module.course.slug}`}
          className={`btn-ghost inline-flex items-center gap-1.5 text-xs ${isRTL ? "-mr-2 flex-row-reverse" : "-ml-2"}`}
        >
          {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />} {lesson.module.course.title}
        </Link>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
        <span style={{ color: 'var(--text-secondary)' }}>{lesson.title}</span>
      </div>

      {/* ── Lesson header card ── */}
      <div className="card p-6">
        <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : "text-left"}>
            <span
              className="inline-block mb-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
            >
              {KIND_LABEL[lesson.kind ?? ''] ?? lesson.kind}
            </span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {lesson.title}
            </h1>
            <div
              className={`flex items-center gap-4 text-xs ${isRTL ? "flex-row-reverse" : ""}`}
              style={{ color: 'var(--text-muted)' }}
            >
              {estimated != null && (
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Clock className="w-3.5 h-3.5" /> ~{estimated} {t('courses.estimatedTime')}
                </span>
              )}
              {questions.length > 0 && (
                <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <BookOpen className="w-3.5 h-3.5" /> {questions.length} {t('courses.quizzes')}
                </span>
              )}
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

      {/* ── Lesson body (Markdown) ── */}
      {lesson.body?.trim() && (
        <div ref={contentRef} className="card p-8">
          <Markdown content={lesson.body} rtl={isRTL} interactive />
        </div>
      )}

      {/* ── Workshop steps ── */}
      {(lesson.steps?.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('courses.workshopSteps')} — {lesson.steps.length}
          </h2>
          {lesson.steps.map((step, i) => (
            <StepCard key={step._key} step={step} index={i} />
          ))}
        </div>
      )}

      {/* ── Lab: starter, hints, tests, reference solution ── */}
      {lesson.kind === 'lab' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            🧪 {t('courses.labWorkspace')}
          </h2>
          <CodeView block={lesson.starter} title="Starter code" interactive />
          {(lesson.hints?.length ?? 0) > 0 && (
            <div className="rounded-xl p-3 text-xs space-y-1" style={{ backgroundColor: 'rgba(251,191,36,0.08)', color: 'var(--text-secondary)' }}>
              {(lesson.hints ?? []).map((hint, i) => (
                <p key={i}>💡 <strong>Hint {i + 1}:</strong> {hint}</p>
              ))}
            </div>
          )}
          <TestsList tests={lesson.tests} />
          {lesson.referenceSolution?.code && (
            <div>
              <button
                onClick={() => setShowReference(s => !s)}
                className="btn-ghost text-xs inline-flex items-center gap-1.5"
              >
                {showReference ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showReference ? t('courses.hideSolution') : t('courses.showSolution')}
              </button>
              {showReference && <CodeView block={lesson.referenceSolution} title="Reference solution" />}
            </div>
          )}
        </div>
      )}

      {/* ── Certification project: rubric ── */}
      {lesson.kind === 'certification-project' && (lesson.rubric?.length ?? 0) > 0 && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            🎓 {t('courses.rubric')}
          </h2>
          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-sm" style={{ color: 'var(--text-secondary)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <th className="px-3 py-2 text-left text-xs">#</th>
                  <th className="px-3 py-2 text-left text-xs">{t('courses.requirement')}</th>
                  <th className="px-3 py-2 text-left text-xs">{t('courses.weight')}</th>
                </tr>
              </thead>
              <tbody>
                {lesson.rubric.map((row) => (
                  <tr key={row._key} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-3 py-2">{row.number}</td>
                    <td className="px-3 py-2">{row.requirement}</td>
                    <td className="px-3 py-2">{row.weight}{row.required ? ' • required' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeView block={lesson.starter} title="Starter workspace" interactive />
          <TestsList tests={lesson.tests} />
        </div>
      )}

      {/* ── Review: covers ── */}
      {lesson.kind === 'review' && (lesson.covers?.length ?? 0) > 0 && (
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            📝 {t('courses.covers')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {lesson.covers.map((c: SanityLessonLite) => (
              <Link
                key={c._id}
                href={`/app/lesson/${c.contentId || c._id}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Quiz questions ── */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h2
            className={`font-semibold text-sm uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {t('courses.knowledgeCheck')} — {questions.length} {t('courses.questions')}
          </h2>

          {questions.map((question, i) => (
            <QuizCard
              key={question._key}
              question={question}
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
                🎯 {correctCount} / {questions.length} {t('courses.correct')}
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
          href={`/app/courses/${lesson.module.course.slug}`}
          className={`btn-secondary gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('courses.courseOverview')}
        </Link>

        <button
          onClick={handleNavigateNext}
          disabled={completing}
          className={`btn-primary gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {completing ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : nextLessonId ? (
            t('courses.nextLesson')
          ) : (
            t('courses.backToCourse')
          )}
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
}
