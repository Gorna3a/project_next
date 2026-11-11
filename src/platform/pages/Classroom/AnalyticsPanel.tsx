'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  Activity, ClipboardList, Gauge, Star, TrendingUp, Loader2, BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../../core/context/LanguageContext';
import { fetchAssignments, fetchSubmissions, fetchFeed } from './classroomService';
import type { Assignment, FeedPost, Submission } from './classroomTypes';

interface AssignmentStat {
  assignment: Assignment;
  completed: number;
  totalPoints: number;
}

interface ActivityItem {
  id: string;
  at: Date;
  text: string;
}

export const AnalyticsPanel = ({
  classroomId,
  students,
}: {
  classroomId: string;
  students: string[];
}) => {
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState<AssignmentStat[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const assignments = await fetchAssignments(classroomId);
        const [subLists, feedPosts] = await Promise.all([
          Promise.all(
            assignments.map(a =>
              fetchSubmissions(classroomId, a.id, { uid: '', isTeacher: true }),
            ),
          ),
          fetchFeed(classroomId),
        ]);
        setSubmissions(subLists.flat());
        setFeed(feedPosts);
        setStats(
          assignments.map((a, index) => ({
            assignment: a,
            completed: subLists[index].filter(s => s.status === 'completed').length,
            totalPoints: subLists[index].reduce((sum, s) => sum + (s.points || 0), 0),
          })),
        );
      } catch (e) {
        console.error('[Classroom] Failed to load analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [classroomId, students]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      </div>
    );
  }

  const totalCompleted = submissions.filter(s => s.status === 'completed').length;
  const possibleCompletions = Math.max(1, students.length * Math.max(1, stats.length));
  const classCompletion = stats.length === 0 ? 0 : Math.round((totalCompleted / possibleCompletions) * 100);
  const totalPoints = submissions.reduce((s, x) => s + (x.points || 0), 0);
  const totalXP = submissions.reduce((s, x) => s + (x.xp || 0), 0);

  const recent: ActivityItem[] = [
    ...submissions
      .filter(s => s.completedAt)
      .map(s => ({
        id: `sub-${s.completedAt!.getTime()}-${s.uid}`,
        at: s.completedAt!,
        text: t('classroom.activityCompleted').replace('{uid}', s.uid.slice(0, 6)),
      })),
    ...feed.map(p => ({
      id: `feed-${p.id}`,
      at: p.createdAt,
      text: `${p.authorName}: ${p.body.slice(0, 60)}${p.body.length > 60 ? '…' : ''}`,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  const metric = (icon: ReactNode, label: string, value: string | number) => (
    <div className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] p-3 flex items-center gap-3">
      <span className="w-9 h-9 bg-[#FFD23F] border-[2px] border-black grid place-items-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-black text-lg leading-none text-black">{value}</p>
        <p className="font-mono text-[9px] font-black uppercase tracking-widest text-black/60 mt-1">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* ── Metric grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metric(<ClipboardList className="w-4 h-4 text-black" />, t('classroom.assignmentsCount').replace('{count}', String(stats.length)), stats.length)}
        {metric(<Gauge className="w-4 h-4 text-black" />, t('classroom.completionRate'), `${classCompletion}%`)}
        {metric(<Star className="w-4 h-4 text-black" />, t('classroom.pointsAwarded'), totalPoints)}
        {metric(<TrendingUp className="w-4 h-4 text-black" />, t('classroom.xpAwarded'), totalXP)}
      </div>

      {/* ── Per-assignment completion ── */}
      <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-3">
        <p className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> {t('classroom.completionByAssignment')}
        </p>
        {stats.length === 0 ? (
          <p className="font-mono text-xs text-black/60">{t('classroom.noAssignmentsYet')}</p>
        ) : (
          <div className="space-y-2">
            {stats.map(({ assignment, completed }) => {
              const denom = Math.max(1, students.length);
              const pct = Math.round((completed / denom) * 100);
              return (
                <div key={assignment.id} className="space-y-1">
                  <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <p className="font-mono text-[11px] font-bold truncate text-black">{assignment.title}</p>
                    <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60 shrink-0">
                      {completed}/{students.length} · {pct}%
                    </p>
                  </div>
                  <div className="h-3 bg-black/10 border-[2px] border-black overflow-hidden">
                    <div className="h-full bg-[#88D498]" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent activity ── */}
      <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-2">
        <p className="font-mono text-xs font-black uppercase tracking-widest text-black flex items-center gap-2">
          <Activity className="w-4 h-4" /> {t('classroom.recentActivity')}
        </p>
        {recent.length === 0 ? (
          <p className="font-mono text-xs text-black/60">{t('classroom.noRecentActivity')}</p>
        ) : (
          <ul className="divide-y-[2px] divide-black/10">
            {recent.map(item => (
              <li key={item.id} className={`py-2 flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <p className="font-mono text-[11px] font-bold text-black truncate">{item.text}</p>
                <p className="font-mono text-[10px] font-bold text-black/50 shrink-0">{item.at.toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
