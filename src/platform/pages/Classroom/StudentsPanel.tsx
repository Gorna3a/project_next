'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Users, Loader2, UserMinus, LogOut, Crown, Star, Hash,
  GraduationCap, ShieldCheck, User, ChevronRight, ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { fetchStudentProfiles, leaveClassroom, removeStudent } from './classroomService';
import type { StudentProfileSummary } from './classroomTypes';
import { ConfirmDialog } from './ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Role badge ───────────────────────────────────────────────────────────────

const ROLE_META = {
  student: { labelKey: 'common.student', Icon: User,          className: 'bg-[#88D498] text-black' },
  teacher: { labelKey: 'common.teacher', Icon: GraduationCap, className: 'bg-[#FFD23F] text-black' },
  admin:   { labelKey: 'common.admin',   Icon: ShieldCheck,   className: 'bg-[#FF6B6B] text-black' },
} as const;

export const StudentsPanel = ({
  classroomId,
  students,
  teacherId,
  onStudentRemoved,
}: {
  classroomId: string;
  students: string[];
  teacherId: string;
  onStudentRemoved: (uid: string) => void;
}) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const isTeacher = user?.uid === teacherId;
  const [profiles, setProfiles] = useState<Record<string, StudentProfileSummary>>({});
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  useEffect(() => {
    fetchStudentProfiles(students)
      .then(setProfiles)
      .catch(() => setProfiles({}))
      .finally(() => setLoading(false));
  }, [students]);

  const handleRemove = (uid: string) => setPendingRemove(uid);

  const confirmRemove = async () => {
    if (!pendingRemove) return;
    const uid = pendingRemove;
    setBusyUid(uid);
    try {
      await removeStudent(classroomId, uid);
      onStudentRemoved(uid);
      toast.success(t('classroom.studentRemoved'));
      setPendingRemove(null);
    } catch {
      toast.error(t('classroom.failedAddAssignment'));
    } finally {
      setBusyUid(null);
    }
  };

  const handleLeave = () => setConfirmLeave(true);

  const confirmLeaveClassroom = async () => {
    if (!user) return;
    setBusyUid(user.uid);
    try {
      await leaveClassroom(classroomId, user.uid);
      toast.success(t('classroom.leftClassroom'));
      setConfirmLeave(false);
      router.push('/app/classroom');
    } catch {
      toast.error(t('classroom.failedAddAssignment'));
      setBusyUid(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 shadow-[4px_4px_0_0_#000]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-10 text-center space-y-3">
          <span className="w-12 h-12 bg-[#88D498] border-[3px] border-black grid place-items-center mx-auto shadow-[2px_2px_0_0_#000]">
            <Users className="w-6 h-6 text-black" />
          </span>
          <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t('classroom.noStudentsYet')}</p>
          <p className="font-mono text-xs font-bold text-black/60">{t('classroom.shareJoinCode')}</p>
        </div>
      ) : (
        students.map((uid, i) => {
          const p = profiles[uid];
          const role = p?.role ?? 'student';
          const roleMeta = ROLE_META[role];
          const initials = (p?.displayName ?? 'P').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          const Chevron = isRTL ? ChevronLeft : ChevronRight;
          return (
            <div key={uid} className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] flex items-stretch overflow-hidden">
              {/* ── Clickable identity → public profile ── */}
              <button
                type="button"
                onClick={() => router.push(`/app/profile/${uid}`)}
                title={t('classroom.viewProfile')}
                aria-label={`${t('classroom.viewProfile')} — ${p?.displayName ?? uid}`}
                className={`flex-1 min-w-0 flex items-center gap-3 p-4 text-start cursor-pointer transition-colors hover:bg-[#FFFDF5] focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <span className="w-10 h-10 bg-black text-[#FFD23F] border-[2px] border-black grid place-items-center font-mono text-xs font-black shrink-0 overflow-hidden">
                  {p?.photoURL ? (
                    <img src={p.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : initials}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-black truncate">
                      {p?.displayName ?? t('classroom.studentLabel').replace('{index}', String(i + 1))}
                    </span>
                    <span className={`inline-flex items-center gap-1 border-[2px] border-black px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest shrink-0 ${roleMeta.className}`}>
                      <roleMeta.Icon className="w-3 h-3" />
                      {t(roleMeta.labelKey)}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-black/60 flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="inline-flex items-center gap-1"><Hash className="w-3 h-3" /> {uid.slice(0, 10)}…</span>
                    <span className="inline-flex items-center gap-1"><Crown className="w-3 h-3" /> Lv.{p?.level ?? 1}</span>
                    <span className="inline-flex items-center gap-1"><Star className="w-3 h-3" /> {(p?.totalXP ?? 0).toLocaleString()}</span>
                  </span>
                </span>
                <Chevron className="w-5 h-5 shrink-0 text-black/40" aria-hidden />
              </button>

              {/* ── Teacher: remove from classroom ── */}
              {isTeacher && (
                <button
                  onClick={() => handleRemove(uid)}
                  disabled={busyUid === uid}
                  className="p-2 m-4 border-[2px] border-black hover:bg-[#FF6B6B] hover:text-black transition-colors shrink-0 self-center disabled:opacity-50"
                  title={t('classroom.removeStudent')}
                >
                  {busyUid === uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                </button>
              )}
            </div>
          );
        })
      )}

      {/* ── Confirmations (shadcn Dialog) ── */}
      <ConfirmDialog
        open={!!pendingRemove}
        onOpenChange={open => { if (!open) setPendingRemove(null); }}
        title={t('classroom.removeStudentTitle')}
        description={t('classroom.removeStudentConfirm')}
        confirmLabel={t('classroom.removeStudent')}
        destructive
        busy={!!pendingRemove && busyUid === pendingRemove}
        icon={<UserMinus className="w-4 h-4" />}
        onConfirm={confirmRemove}
      />
      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title={t('classroom.leaveTitle')}
        description={t('classroom.leaveConfirm')}
        confirmLabel={t('classroom.leaveButton')}
        destructive
        busy={!!user && busyUid === user.uid}
        icon={<LogOut className="w-4 h-4" />}
        onConfirm={confirmLeaveClassroom}
      />

      {/* ── Student: leave classroom ── */}
      {!isTeacher && user && students.includes(user.uid) && (
        <button
          onClick={handleLeave}
          disabled={busyUid === user.uid}
          className="w-full bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:bg-[#FF6B6B] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {busyUid === user.uid ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          {t('classroom.leaveClassroom')}
        </button>
      )}
    </div>
  );
};
