import Link from "next/link";
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import type { SanityCourse } from '../../../core/services/sanity';
import { useLanguage } from '../../../core/context/LanguageContext';

export const LANGUAGE_META: Record<string, { short: string; color: string; label: string; bg: string }> = {
  python: { short: 'PY', color: '#3776ab', label: 'Python', bg: 'var(--phosphor)' },
  javascript: { short: 'JS', color: '#f7df1e', label: 'JavaScript', bg: 'var(--yellow)' },
  typescript: { short: 'TS', color: '#3178c6', label: 'TypeScript', bg: '#7AA8FF' },
  java: { short: 'JV', color: '#ed8b00', label: 'Java', bg: 'var(--orange)' },
  c: { short: 'C', color: '#555555', label: 'C', bg: '#161616' },
  cpp: { short: 'C++', color: '#00599c', label: 'C++', bg: '#8A867F' },
  go: { short: 'GO', color: '#00acd7', label: 'Go', bg: 'var(--phosphor)' },
  rust: { short: 'RS', color: '#ce4a00', label: 'Rust', bg: 'var(--orange)' },
  kotlin: { short: 'KT', color: '#7f52ff', label: 'Kotlin', bg: '#161616' },
  swift: { short: 'SW', color: '#fa7343', label: 'Swift', bg: 'var(--orange)' },
  csharp: { short: 'C#', color: '#512bd4', label: 'C#' , bg: '#7AA8FF' },
  ruby: { short: 'RB', color: '#cc342d', label: 'Ruby', bg: '#FF6B6B' },
  php: { short: 'PHP', color: '#777bb4', label: 'PHP', bg: 'var(--phosphor)' },
};

const LEVEL_STYLES: Record<string, { bg: string; fg: string }> = {
  beginner: { bg: 'var(--phosphor)', fg: '#161616' },
  intermediate: { bg: 'var(--yellow)', fg: '#161616' },
  advanced: { bg: 'var(--orange)', fg: '#fff' },
};

interface CourseCardProps {
  course: SanityCourse;
  progress: number;
}

export const CourseCard = ({ course, progress }: CourseCardProps) => {
  const { isRTL } = useLanguage();
  const meta = LANGUAGE_META[course.language] ?? { short: 'DEV', color: '#161616', label: course.language, bg: 'var(--surface)' };
  const levelStyle = LEVEL_STYLES[course.level] ?? LEVEL_STYLES.beginner;

  return (
    <div className={`fcard flex h-full flex-col ${isRTL ? 'text-right' : 'text-left'}`} style={{ background: meta.bg, color: meta.bg === 'var(--phosphor)' || meta.bg === 'var(--yellow)' ? '#161616' : meta.bg === '#161616' ? 'var(--phosphor)' : '#161616', minHeight: 320 }}>
      <div className="fcard-top">
        <span className="fcard-num">{course.language?.toUpperCase() || 'DEV'}</span>
        <span className="mono" style={{ fontSize: 9, background: levelStyle.bg, color: levelStyle.fg, padding: '3px 6px', border: '2px solid #161616', fontWeight: 800 }}>{course.level?.toUpperCase()}</span>
      </div>

      <div className="fcard-icon" style={{ background: '#fff', color: '#161616', border: '3px solid #161616' }}>
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: 9 }}>{meta.short}</span>
      </div>

      <h3 style={{ fontFamily: "'Silkscreen', cursive", fontSize: 16, margin: '10px 0 6px', lineHeight: 1.3 }}>{course.title}</h3>
      <p className="mono" style={{ fontSize: 11, lineHeight: 1.5, opacity: 0.9, flex: 1 }}>{course.description}</p>

      <div className={`flex flex-wrap gap-1.5 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {(course.tags || []).slice(0, 2).map(tag => (
          <span key={tag} className="mono" style={{ fontSize: 9, padding: '3px 6px', border: '2px solid #161616', background: 'var(--surface)', fontWeight: 800 }}>{tag}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-3 font-mono text-[11px] font-bold">
        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.totalLessons}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.estimatedHours}h</span>
        {progress === 100 && <span className="ml-auto flex items-center gap-1 bg-black text-white px-1.5 py-0.5 border border-black"><CheckCircle2 className="h-3 w-3" />Done</span>}
      </div>

      <div className="mt-3">
        <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
          <span>{progress > 0 ? 'PROGRESS' : 'READY'}</span><span>{progress}%</span>
        </div>
        <div className="mt-1 h-2 border-[2px] border-black bg-white p-[2px] flex">
          <div className="h-full bg-black" style={{ width: `${progress}%`, transition: 'width 0.8s' }} />
        </div>
      </div>

      <Link href={`/app/courses/${course.slug}`} className={`mt-4 btn ${progress === 0 ? 'btn-ph' : 'btn-dark'} w-full justify-center py-2.5 text-[10px]`}>
        {progress === 0 ? 'START COURSE →' : progress === 100 ? 'REVIEW →' : 'CONTINUE →'}
      </Link>
    </div>
  );
};
