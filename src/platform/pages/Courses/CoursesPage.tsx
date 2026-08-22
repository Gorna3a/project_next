'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { BookOpen, Filter, Search } from 'lucide-react';
import { getAllCourses, type SanityCourse } from '../../../core/services/sanity';
import { getAllCourseProgress, type CourseProgressData } from '../../../core/services/progress';
import { useAuth } from '../../../core/hooks/useAuth';
import { useLanguage } from '../../../core/context/LanguageContext';
import { CourseCard, LANGUAGE_META } from './CourseCard';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

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
    { id: 'all',          label: t('courses.allLevels') },
    { id: 'beginner',     label: t('courses.beginner') },
    { id: 'intermediate', label: t('courses.intermediate') },
    { id: 'advanced',     label: t('courses.advanced') },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesData, progressData] = await Promise.all([
          getAllCourses(),
          user ? getAllCourseProgress(user.uid).catch(err => {
            console.error('Failed to load course progress from Firebase:', err);
            return [];
          }) : Promise.resolve([]),
        ]);
        setCourses(coursesData);
        setProgress(progressData);
      } catch (e) {
        console.error('Failed to load courses:', e);
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

  const getProgress = (courseId: string) => {
    const p = progress.find(item => item.courseId === courseId);
    return p?.percentComplete ?? 0;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* ── Header — brutalist masthead ──────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white" /> {t('courses.title')}
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/60 mt-1">
            {t('courses.sub')}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 bg-white text-black border-[3px] border-black px-4 py-2 font-mono text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] self-start sm:self-auto">
          {loading ? t('common.loading') : `${filtered.length} / ${courses.length}`}
        </span>
      </motion.div>

      {/* ── Filters — hard inputs ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-black`} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-4 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#000] transition-all ${isRTL ? 'pr-9' : 'pl-9'}`}
            />
          </div>

          <div className="relative">
            <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2 text-black pointer-events-none`} />
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className={`bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-widest cursor-pointer focus:outline-none ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'}`}
              style={{ minWidth: '160px' }}
            >
              {LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {LANGUAGE_TABS.map(tab => {
            const isActive = langTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setLangTab(tab.id)}
                className={`flex flex-shrink-0 items-center gap-2 border-[3px] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
              >
                <span className="font-mono text-[11px] border border-current px-1">{tab.short}</span>
                {tab.id === 'all' ? t('common.all') : tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {error && (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-black text-white border-[3px] border-black grid place-items-center mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="font-black text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t('courses.catalogUnavailable')}
          </p>
          <p className="font-mono text-xs text-black/60">{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 border-[2px] border-black bg-black/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-black/10 w-[70%]" />
                  <div className="h-2 bg-black/10 w-[36%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-black/10" />
                <div className="h-2 bg-black/10 w-[82%]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
              <BookOpen className="h-6 w-6 text-black" />
            </div>
            <p className="font-black text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t('courses.noCoursesMatch')}
            </p>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              {t('courses.tryDifferentFilters')}
            </p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map(course => (
              <motion.div key={course._id} variants={fadeUp}>
                <CourseCard course={course} progress={getProgress(course._id)} />
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
}
