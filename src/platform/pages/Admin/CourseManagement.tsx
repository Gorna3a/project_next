'use client';

import { useEffect, useState } from 'react';
import { getAllCourses, type SanityCourse } from '../../../core/services/sanity';
import { 
  BookOpen, ExternalLink, 
  Layers, Plus, Search 
} from 'lucide-react';

export default function CourseManagement() {
  const [courses, setCourses] = useState<SanityCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black">Course Content</h1>
          <p className="text-gray-500 font-medium">Manage your Sanity curriculum and custom courses.</p>
        </div>
        <div className="flex gap-3">
          <a 
            href="https://www.sanity.io/manage" 
            target="_blank" 
            rel="noreferrer"
            className="btn-secondary gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Sanity Studio
          </a>
          <button className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> Custom Course
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Filter by title or language..." 
          className="input pl-12 h-14"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> Production Curriculum
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Syncing Sanity...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No courses found.</div>
            ) : (
              filtered.map((course) => (
                <div key={course._id} className="card p-4 flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl shadow-inner">
                      {course.language === 'python' ? '🐍' : '⚡'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{course.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>{course.language}</span>
                        <span>•</span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-indigo-500 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20">
                    {course.totalLessons} Lessons
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> Custom Teacher Content
          </h2>
          <div className="card p-12 text-center space-y-4 bg-gray-50/50 dark:bg-gray-900/50 border-dashed">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Plus className="w-8 h-8 text-gray-300" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">No Custom Courses</h3>
              <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                Teachers can create localized courses that aren't in the global curriculum.
              </p>
            </div>
            <button className="btn-secondary text-xs px-6">Get Started</button>
          </div>
        </section>
      </div>
    </div>
  );
}
