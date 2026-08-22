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
  beginner: 'bg-[#88D498] text-black border-black',
  intermediate: 'bg-[#FFD23F] text-black border-black',
  advanced: 'bg-[#FF6B6B] text-black border-black',
};

interface CourseCardProps {
  course: SanityCourse;
  progress: number;
}

export const CourseCard = ({ course, progress }: CourseCardProps) => {
  const { t, isRTL } = useLanguage();
  const meta = LANGUAGE_META[course.language] ?? { short: 'DEV', color: '#000', label: course.language };

  return (
    <motion.article
      whileHover={{ x: -1, y: -1 }}
      transition={{ duration: 0.15 }}
      className={`bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] flex h-full flex-col overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <div className="h-1.5 w-full border-b-[3px] border-black" style={{ backgroundColor: meta.color }} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-[3px] border-black font-mono text-sm font-black shadow-[2px_2px_0_0_#000]"
            style={{ backgroundColor: meta.color, color: meta.color === '#f7df1e' ? '#000' : '#fff' }}
          >
            {meta.short}
          </div>

          <div className="min-w-0 flex-1">
            <div className={`mb-1 flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#000' }}>
              <Code2 className="h-3.5 w-3.5" />
              <span>{meta.label}</span>
            </div>
            <h3 className="line-clamp-2 text-sm font-black leading-snug text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {course.title}
            </h3>
          </div>
        </div>

        <p className="line-clamp-3 flex-1 font-mono text-xs leading-relaxed text-black/60">
          {course.description}
        </p>

        <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`border-[2px] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest ${LEVEL_STYLES[course.level] ?? LEVEL_STYLES.beginner}`}>
            {course.level === 'beginner' ? t('common.beginner') : course.level === 'intermediate' ? t('common.intermediate') : course.level === 'advanced' ? t('common.advanced') : course.level}
          </span>
          {(course.tags || []).slice(0, 2).map(tag => (
            <span
              key={tag}
              className="border-[2px] border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center gap-4 font-mono text-[11px] font-bold ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#000' }}>
          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons} {t('courses.lessons')}
          </span>
          <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="h-3.5 w-3.5" />
            {course.estimatedHours}{t('common.hoursShort')}
          </span>
          {progress === 100 && (
            <span className={`flex items-center gap-1 text-black bg-[#88D498] border-[2px] border-black px-1.5 py-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('common.done')}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className={`flex justify-between font-mono text-[10px] font-black uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#000' }}>
            <span>{progress > 0 ? t('common.progress') : t('courses.readyToStart')}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 border-[2px] border-black bg-white p-1 flex">
            <motion.div
              className={`h-full bg-black ${isRTL ? 'float-right' : ''}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' as const }}
            />
          </div>
        </div>

        <Link href={`/app/courses/${course.slug}`} className={`bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex w-full items-center justify-center gap-2 py-2.5 font-mono text-xs font-black uppercase tracking-widest transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
          {progress === 0 ? t('courses.startCourse') : progress === 100 ? t('courses.reviewCourse') : t('courses.continue')}
          {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
    </motion.article>
  );
};
