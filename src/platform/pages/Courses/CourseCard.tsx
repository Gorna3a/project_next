import { motion } from 'framer-motion';
import Link from "next/link";
import { ArrowRight, ArrowLeft, BookOpen, CheckCircle2, Clock, Code2 } from 'lucide-react';
import type { SanityCourse } from '../../../core/services/sanity';
import { useLanguage } from '../../../core/context/LanguageContext';

export const LANGUAGE_META: Record<string, { short: string; color: string; label: string }> = {
  python: { short: 'PY', color: '#3776ab', label: 'Python' },
  javascript: { short: 'JS', color: '#f7df1e', label: 'JavaScript' },
  typescript: { short: 'TS', color: '#3178c6', label: 'TypeScript' },
  java: { short: 'JV', color: '#ed8b00', label: 'Java' },
  c: { short: 'C', color: '#555555', label: 'C' },
  cpp: { short: 'C++', color: '#00599c', label: 'C++' },
  go: { short: 'GO', color: '#00acd7', label: 'Go' },
  rust: { short: 'RS', color: '#ce4a00', label: 'Rust' },
  kotlin: { short: 'KT', color: '#7f52ff', label: 'Kotlin' },
  swift: { short: 'SW', color: '#fa7343', label: 'Swift' },
  csharp: { short: 'C#', color: '#512bd4', label: 'C#' },
  ruby: { short: 'RB', color: '#cc342d', label: 'Ruby' },
  php: { short: 'PHP', color: '#777bb4', label: 'PHP' },
};

const LEVEL_STYLES: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface CourseCardProps {
  course: SanityCourse;
  progress: number;
}

export const CourseCard = ({ course, progress }: CourseCardProps) => {
  const { t, isRTL } = useLanguage();
  const meta = LANGUAGE_META[course.language] ?? { short: 'DEV', color: '#6272f5', label: course.language };

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`card flex h-full flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <div className="h-1 w-full" style={{ backgroundColor: meta.color }} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold"
            style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
          >
            {meta.short}
          </div>

          <div className="min-w-0 flex-1">
            <div className={`mb-1 flex items-center gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-muted)' }}>
              <Code2 className="h-3.5 w-3.5" />
              <span>{meta.label}</span>
            </div>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {course.title}
            </h3>
          </div>
        </div>

        <p className="line-clamp-3 flex-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {course.description}
        </p>

        <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${LEVEL_STYLES[course.level] ?? LEVEL_STYLES.beginner}`}>
            {course.level === 'beginner' ? t('common.beginner') : course.level === 'intermediate' ? t('common.intermediate') : course.level === 'advanced' ? t('common.advanced') : course.level}
          </span>
          {(course.tags || []).slice(0, 2).map(tag => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center gap-4 text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-muted)' }}>
          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons} {t('courses.lessons')}
          </span>
          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="h-3.5 w-3.5" />
            {course.estimatedHours}{t('common.hoursShort')}
          </span>
          {progress === 100 && (
            <span className={`flex items-center gap-1 text-green-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('common.done')}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className={`flex justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: 'var(--text-muted)' }}>
            <span>{progress > 0 ? t('common.progress') : t('courses.readyToStart')}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--bg-subtle)' }}>
            <motion.div
              className={`h-full rounded-full ${isRTL ? 'float-right' : ''}`}
              style={{ backgroundColor: progress === 100 ? '#22c55e' : meta.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            />
          </div>
        </div>

        <Link href={`/app/courses/${course.slug}`} className={`btn-primary w-full justify-center py-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
          {progress === 0 ? t('courses.startCourse') : progress === 100 ? t('courses.reviewCourse') : t('courses.continue')}
          {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </motion.article>
  );
};
