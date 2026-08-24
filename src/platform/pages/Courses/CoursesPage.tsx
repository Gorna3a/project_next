'use client';

import '../Landing/pixel-landing.css';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getAllCourses, type SanityCourse } from '../../../core/services/sanity';
import { getAllCourseProgress, type CourseProgressData } from '../../../core/services/progress';
import { useAuth } from '../../../core/hooks/useAuth';
import { useLanguage } from '../../../core/context/LanguageContext';
import { CourseCard, LANGUAGE_META } from './CourseCard';

const LANGUAGE_TABS = [
  { id: 'all', label: 'All', short: 'All' },
  ...Object.entries(LANGUAGE_META).map(([id, meta]) => ({
    id,
    label: meta.label,
    short: meta.short,
  })),
];

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const [courses, setCourses] = useState<SanityCourse[]>([]);
  const [progress, setProgress] = useState<CourseProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [langTab, setLangTab] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const LEVELS = [
    { id: 'all', label: t('courses.allLevels') },
    { id: 'beginner', label: t('courses.beginner') },
    { id: 'intermediate', label: t('courses.intermediate') },
    { id: 'advanced', label: t('courses.advanced') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, progressData] = await Promise.all([
          getAllCourses(),
          user ? getAllCourseProgress(user.uid).catch(() => []) : Promise.resolve([]),
        ]);
        setCourses(coursesData);
        setProgress(progressData);
      } catch (e) {
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses.filter(course => {
      const matchesSearch =
        !term ||
        (course.title ?? "").toLowerCase().includes(term) ||
        (course.description ?? "").toLowerCase().includes(term) ||
        (course.tags ?? []).some(tag => (tag ?? "").toLowerCase().includes(term));
      const matchesLang = langTab === 'all' || course.language === langTab;
      const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
      return matchesSearch && matchesLang && matchesLevel;
    });
  }, [courses, search, langTab, levelFilter]);

  const getProgress = (courseId: string) => progress.find(p => p.courseId === courseId)?.percentComplete ?? 0;

  return (
    <div className="max-w-[1160px] mx-auto space-y-6 pb-12 px-6">
      <div className="flex flex-col gap-3">
        <div className="section-head">
          <span className="dot" style={{ background: 'var(--phosphor)' }} />
          <h2 className="h2">Courses</h2>
          <span className="dot" style={{ background: 'var(--orange)' }} />
          <span className="eyebrow">— {filtered.length} / {courses.length} COURSES</span>
        </div>
        <p className="sub">Structured paths from zero to shipping. Pick a language, start a deck — every card is a course.</p>
      </div>

      <div className="bg-white border-[4px] border-black shadow-[6px_6px_0_#161616] p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-black`} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_#161616] py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none ${isRTL ? 'pr-9' : 'pl-9'}`}
            />
          </div>
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="bg-white border-[3px] border-black shadow-[3px_3px_0_#161616] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-widest"
          >
            {LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LANGUAGE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setLangTab(tab.id)}
              className={`border-[3px] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest whitespace-nowrap ${langTab === tab.id ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[var(--surface2)]'}`}
            >
              {tab.short}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="border-[4px] border-black bg-white shadow-[6px_6px_0_#161616] p-8 text-center">
          <p className="pixel" style={{ fontSize: 12 }}>CATALOG UNAVAILABLE</p>
          <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-[4px] border-black bg-white shadow-[6px_6px_0_#161616] p-5 h-64 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="border-[4px] border-black bg-white shadow-[6px_6px_0_#161616] p-12 text-center">
            <p className="pixel" style={{ fontSize: 12 }}>NO COURSES MATCH</p>
            <p className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Try a different filter</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, i) => (
              <div key={course._id} style={{ animation: `pcIn .45s cubic-bezier(.22,.8,.22,1) both`, animationDelay: `${Math.min(i * 60, 240)}ms` }} className="will-change-transform">
                <CourseCard course={course} progress={getProgress(course._id)} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
