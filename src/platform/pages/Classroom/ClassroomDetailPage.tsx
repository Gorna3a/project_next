'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Users, GraduationCap, ClipboardList,
  Copy, Check, RefreshCw, Loader2, MessageSquare, Trophy, Activity,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { regenerateJoinCode } from './classroomService';
import { AssignmentsPanel } from './AssignmentsPanel';
import { FeedPanel } from './FeedPanel';
import { StudentsPanel } from './StudentsPanel';
import { LeaderboardPanel } from './LeaderboardPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { ConfirmDialog } from './ConfirmDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClassroomData } from './classroomTypes';

// ─── Variants ─────────────────────────────────────────────────────────────────

type Tab = 'assignments' | 'feed' | 'students' | 'leaderboard' | 'analytics';

// ─── ClassroomDetailPage ───────────────────────────────────────────────────────

export default function ClassroomDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user }               = useAuth();
  const { t, isRTL }            = useLanguage();

  const [classroom,     setClassroom]     = useState<ClassroomData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [copied,        setCopied]        = useState(false);
  const [regenerating,  setRegenerating]  = useState(false);
  const [activeTab,     setActiveTab]     = useState<Tab>('assignments');
  const [confirmRegen,  setConfirmRegen]  = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const classSnap = await getDoc(doc(db, 'classrooms', id));
      if (classSnap.exists()) {
        const data = classSnap.data();
        setClassroom({
          id: classSnap.id,
          name: data.name ?? '',
          description: data.description ?? '',
          joinCode: data.joinCode ?? '',
          teacherId: data.teacherId ?? '',
          teacherName: data.teacherName ?? '',
          students: Array.isArray(data.students) ? data.students : [],
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        });
      } else {
        setClassroom(null);
      }
    } catch (e) {
      console.error('[Classroom] Fetch failed:', e);
      setClassroom(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isMember =
    !!user &&
    (user.uid === classroom?.teacherId || (classroom?.students.includes(user.uid) ?? false));

  const copyCode = async () => {
    if (!classroom) return;
    await navigator.clipboard.writeText(classroom.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => setConfirmRegen(true);

  const confirmRegenerate = async () => {
    if (!classroom || regenerating) return;
    setRegenerating(true);
    try {
      const code = await regenerateJoinCode(classroom.id);
      setClassroom(prev => prev ? { ...prev, joinCode: code } : prev);
      setConfirmRegen(false);
      toast.success(t('classroom.codeRegenerated'));
    } catch {
      toast.error(t('classroom.failedAddAssignment'));
    } finally {
      setRegenerating(false);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-40 shadow-[5px_5px_0_0_#000]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 shadow-[4px_4px_0_0_#000]" />
        ))}
      </div>
    );
  }

  // ── Not found / not a member ───────────────────────────────────────────────

  if (!classroom || !isMember) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto">
        <span className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
          <GraduationCap className="w-7 h-7 text-black" />
        </span>
        <p className="font-mono text-sm font-black uppercase tracking-widest text-black">{t('classroom.notFound')}</p>
        <Link href="/app/classroom" className={`inline-flex items-center gap-2 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-black hover:text-white transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('classroom.backToClassrooms')}
        </Link>
      </div>
    );
  }

  const teacherView = user?.uid === classroom.teacherId;
  const handleStudentRemoved = (uid: string) =>
    setClassroom(prev => prev ? { ...prev, students: prev.students.filter(s => s !== uid) } : prev);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'assignments', label: t('classroom.assignmentsTab'), icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'feed',        label: t('classroom.feedTab'),        icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'students',    label: t('classroom.studentsTab'),    icon: <Users className="w-4 h-4" /> },
    { key: 'leaderboard', label: t('classroom.leaderboard'),    icon: <Trophy className="w-4 h-4" /> },
    ...(teacherView ? [{ key: 'analytics' as Tab, label: t('classroom.analyticsTab'), icon: <Activity className="w-4 h-4" /> }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className={`max-w-4xl mx-auto space-y-6 pb-12 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      {/* ── Back link ── */}
      <Link
        href="/app/classroom"
        className={`inline-flex items-center gap-2 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-3 py-1.5 hover:bg-black hover:text-white active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('classroom.title')}
      </Link>

      {/* ── Classroom header ── */}
      <div className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 space-y-4">
        <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Silkscreen', cursive" }}>
              <span className="w-2 h-6 bg-[#FFD23F] border border-white hidden sm:inline-block" />
              {classroom.name}
            </h1>
            <p className="font-mono text-xs font-bold uppercase tracking-widest mt-1 text-white/60">
              {teacherView
                ? t('classroom.studentsEnrolled').replace('{count}', classroom.students.length.toString())
                : t('classroom.taughtBy').replace('{name}', classroom.teacherName)}
            </p>
          </div>

          {teacherView && (
            <div className={`flex items-center gap-2 bg-white text-black border-[3px] border-black px-3 py-2 shadow-[3px_3px_0_0_#000] flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60">
                {t('classroom.joinCodeLabel')}
              </span>
              <code className="font-mono font-black text-sm tracking-widest text-black">
                {classroom.joinCode}
              </code>
              <button onClick={copyCode} className="bg-black text-white border-[2px] border-black p-1 hover:bg-[#FFD23F] hover:text-black transition-colors" title={t('classroom.copyCode')}>
                {copied ? <Check className="w-3.5 h-3.5 text-[#88D498]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="bg-black text-white border-[2px] border-black p-1 hover:bg-[#FFD23F] hover:text-black transition-colors disabled:opacity-50"
                title={t('classroom.regenerateCode')}
              >
                {regenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {classroom.description && (
          <p className="font-mono text-sm font-bold leading-relaxed text-white/80 border-l-[3px] border-[#FFD23F] pl-3">
            {classroom.description}
          </p>
        )}

        {/* Quick stats */}
        <div className={`flex gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`inline-flex items-center gap-2 bg-white text-black border-[2px] border-white px-3 py-1 font-mono text-xs font-black uppercase tracking-widest ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-4 h-4" />
            {t('classroom.studentsCount').replace('{count}', classroom.students.length.toString())}
          </span>
        </div>
      </div>

      {/* ── Regenerate join code confirmation (shadcn Dialog) ── */}
      <ConfirmDialog
        open={confirmRegen}
        onOpenChange={setConfirmRegen}
        title={t('classroom.regenerateTitle')}
        description={t('classroom.regenerateConfirm')}
        confirmLabel={t('classroom.regenerateButton')}
        destructive={false}
        busy={regenerating}
        icon={<RefreshCw className="w-4 h-4" />}
        onConfirm={confirmRegenerate}
      />

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as Tab)} dir={isRTL ? 'rtl' : 'ltr'} className="space-y-6">
        <TabsList className="w-full">
          {tabs.map(tab => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.icon}
              <span className="hidden xs:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Panels ── */}
        <TabsContent value="assignments">
          <AssignmentsPanel classroomId={classroom.id} students={classroom.students} isTeacher={teacherView} />
        </TabsContent>
        <TabsContent value="feed">
          <FeedPanel classroomId={classroom.id} isTeacher={teacherView} />
        </TabsContent>
        <TabsContent value="students">
          <StudentsPanel
            classroomId={classroom.id}
            students={classroom.students}
            teacherId={classroom.teacherId}
            onStudentRemoved={handleStudentRemoved}
          />
        </TabsContent>
        <TabsContent value="leaderboard">
          <LeaderboardPanel classroomId={classroom.id} />
        </TabsContent>
        {teacherView && (
          <TabsContent value="analytics">
            <AnalyticsPanel classroomId={classroom.id} students={classroom.students} />
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
}
