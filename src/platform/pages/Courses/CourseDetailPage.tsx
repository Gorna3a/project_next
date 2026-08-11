'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Lock, PlayCircle, Tag } from 'lucide-react';
import { getCourse, getLessonsForCourse, type SanityCourse, type SanityLesson } from '../../../core/services/sanity';
import { getCourseProgress, startCourse, type CourseProgressData } from '../../../core/services/progress';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { LANGUAGE_META } from './CourseCard';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const LessonIcon = ({ done, index, color }: { done: boolean; index: number; color: string }) => {
  if (done) {
    return <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />;
  }

  return (
    <div
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold"
      style={{ borderColor: color, color }}
    >
      {index + 1}
    </div>
  );
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useRouter();

  const [course, setCourse] = useState<SanityCourse | null>(null);
  const [progress, setProgress] = useState<CourseProgressData | null>(null);
  const [lessons, setLessons] = useState<SanityLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const courseData = await getCourse(slug);
        setCourse(courseData);

        if (courseData) {
          try {
            const courseLessons = await getLessonsForCourse(courseData._id);
            setLessons(courseLessons);
          } catch (err) {
            console.error('Failed to load course lessons:', err);
            setLessons([]);
          }
        }

        if (courseData && user) {
          try {
            const progressData = await getCourseProgress(user.uid, courseData._id);
            setProgress(progressData);
          } catch (err) {
            console.error('Failed to load course progress from Firebase:', err);
            setProgress(null);
          }
        } else {
          setProgress(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, user]);

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.order - b.order),
    [lessons],
  );

  const handleStart = async () => {
    if (!user || !course) return;
    try {
      await startCourse(user.uid, course._id);
    } catch (e) {
      console.error('Failed to start course in Firebase:', e);
    }
    if (sortedLessons.length > 0) {
      navigate.push(`/app/lesson/${sortedLessons[0].slug}`);
    }
  };

  const handleContinue = () => {
    if (!course) return;
    const next = sortedLessons.find(lesson => !progress?.completedLessons.includes(lesson._id));
    if (next) navigate.push(`/app/lesson/${next.slug}`);
  };

  const isCompleted = (lessonId: string) => progress?.completedLessons.includes(lessonId) ?? false;
  const percent = progress?.percentComplete ?? 0;

  const meta = course
    ? LANGUAGE_META[course.language] ?? { short: 'DEV', color: '#6272f5', label: course.language }
    : { short: 'DEV', color: '#6272f5', label: 'Course' };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
        <div className="h-56 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)' }} />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-40" style={{ color: 'var(--text-muted)' }} />
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
          {t('courses.courseNotFound')}
        </p>
        <Link href="/app/courses" className="btn-secondary mt-4 inline-flex">
          {t('courses.backToCourses')}
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`mx-auto max-w-5xl space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <Link href="/app/courses" className={`btn-ghost ${isRTL ? '-mr-2 flex-row-reverse' : '-ml-2'} inline-flex gap-2 text-sm`}>
        {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />} {t('courses.backToCourses')}
      </Link>

      <section className="card overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: meta.color }} />
        <div className={`grid gap-6 p-6 lg:grid-cols-[1fr_280px] lg:p-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`space-y-5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl font-mono text-lg font-bold"
                style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
              >
                {meta.short}
              </div>

              <div className="min-w-0">
                <div className={`mb-2 flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                    {meta.label}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium capitalize" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}>
                    {course.level === 'beginner' ? t('common.beginner') : course.level === 'intermediate' ? t('common.intermediate') : course.level === 'advanced' ? t('common.advanced') : course.level}
                  </span>
                </div>
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
                  {course.title}
                </h1>
              </div>
            </div>

            <p className="max-w-3xl text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
              {course.description}
            </p>

            <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {(course.tags || []).map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                  style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
            <div className={`grid grid-cols-2 gap-3 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={isRTL ? 'order-2' : ''}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('courses.lessons')}</p>
                <p className={`mt-1 flex items-center gap-1.5 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-primary)' }}>
                  <BookOpen className="h-4 w-4" /> {course.totalLessons}
                </p>
              </div>
              <div className={isRTL ? 'order-1' : ''}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('courses.estimatedTime')}</p>
                <p className={`mt-1 flex items-center gap-1.5 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-primary)' }}>
                  <Clock className="h-4 w-4" /> {course.estimatedHours}{t('common.hoursShort')}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className={`flex justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-muted)' }}>
                <span>{progress?.completedLessons.length ?? 0} {t('common.completed')}</span>
                <span>{percent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isRTL ? 'float-right' : ''}`}
                  style={{ width: `${percent}%`, backgroundColor: percent === 100 ? '#22c55e' : meta.color }}
                />
              </div>
            </div>

            <div className="mt-5">
              {percent === 0 ? (
                <button onClick={handleStart} className={`btn-primary w-full flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <PlayCircle className="h-4 w-4" /> {t('courses.startCourse')}
                </button>
              ) : percent === 100 ? (
                <button onClick={handleContinue} className="btn-secondary w-full">
                  {t('courses.reviewCourse')}
                </button>
              ) : (
                <button onClick={handleContinue} className="btn-primary w-full">
                  {t('courses.continue')}
                </button>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {t('courses.lessons')}
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('courses.pathTip')}
          </span>
        </div>

        <div className="card divide-y overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {sortedLessons.map((lesson, idx) => {
            const done = isCompleted(lesson._id);
            const locked = idx > 0 && !isCompleted(sortedLessons[idx - 1]._id) && percent === 0;

            if (locked) {
              return (
                <div key={lesson._id} className={`flex cursor-not-allowed items-center gap-4 px-5 py-4 opacity-55 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Lock className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{lesson.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('courses.lessonLocked')}</p>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={lesson._id}
                href={`/app/lesson/${lesson.slug}`}
                className={`flex items-center gap-4 px-5 py-4 transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
              >
                <LessonIcon done={done} index={idx} color={meta.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{lesson.title}</p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t('courses.about')} {lesson.estimatedMinutes} {t('common.minutesShort')}
                  </p>
                </div>
                {done && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />}
              </Link>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
