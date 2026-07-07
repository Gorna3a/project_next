'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { BookOpen, Filter, Search } from 'lucide-react';
import { getAllCourses, type SanityCourse } from '../../../core/services/sanity';
import { getAllCourseProgress, type CourseProgressData } from '../../../core/services/progress';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { CourseCard, LANGUAGE_META } from './CourseCard';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
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
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.tags.some(tag => tag.toLowerCase().includes(term));
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
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {t('courses.title')}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('courses.sub')}
          </p>
        </div>

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {loading ? t('common.loading') : `${filtered.length} ${t('courses.of')} ${courses.length} ${t('courses.coursesCount')}`}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2`} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`input ${isRTL ? 'pr-9' : 'pl-9'}`}
          />
        </div>

        <div className="relative">
          <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 h-4 w-4 -translate-y-1/2`} style={{ color: 'var(--text-muted)' }} />
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className={`input cursor-pointer appearance-none ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'}`}
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
        {LANGUAGE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setLangTab(tab.id)}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: langTab === tab.id ? 'var(--accent)' : 'var(--bg-surface)',
              color: langTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${langTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <span className="font-mono text-[11px]">{tab.short}</span>
            {tab.id === 'all' ? t('common.all') : tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="card space-y-2 p-6 text-center">
          <BookOpen className="mx-auto h-10 w-10 opacity-40" style={{ color: 'var(--text-muted)' }} />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {t('courses.catalogUnavailable')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {error}
          </p>
        </div>
      )}

      {loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card space-y-4 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded" style={{ backgroundColor: 'var(--bg-subtle)', width: '70%' }} />
                  <div className="h-2 rounded" style={{ backgroundColor: 'var(--bg-subtle)', width: '36%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded" style={{ backgroundColor: 'var(--bg-subtle)' }} />
                <div className="h-2 rounded" style={{ backgroundColor: 'var(--bg-subtle)', width: '82%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="card space-y-3 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {t('courses.noCoursesMatch')}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
