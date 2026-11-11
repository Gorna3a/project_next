'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  BookOpen, Calendar, Plus, Trash2, Loader2, CheckCircle2, Trophy,
  ChevronDown, ChevronRight, Star, Link2, Users, Upload, Download,
  RefreshCw, FileText, Paperclip,
} from 'lucide-react';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useAuth } from '../../../core/context/AuthContext';
import { AssignmentModal } from './AssignmentModal';
import { ChallengeDrawer } from './ChallengeDrawer';
import { ConfirmDialog } from './ConfirmDialog';
import {
  fetchAssignments,
  fetchSubmissions,
  fetchStudentProfiles,
  completeAssignment,
  gradeSubmission,
  deleteAssignment,
  uploadAssignmentFile,
  downloadSubmissionFile,
} from './classroomService';
import {
  CLASSROOM_MAX_FILE_BYTES,
  CLASSROOM_MAX_FILE_MB,
} from './classroomTypes';
import type { Assignment, Submission, StudentProfileSummary } from './classroomTypes';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Due-date helper ─────────────────────────────────────────────────────────

const dueBadge = (due: Date | null, t: (k: string) => string) => {
  if (!due) return null;
  const overdue = due.getTime() < Date.now();
  return (
    <span className={`inline-flex items-center gap-1.5 mt-2 border-[2px] border-black px-2 py-1 font-mono text-[10px] font-black uppercase tracking-widest ${overdue ? 'bg-[#FF6B6B] text-black' : 'bg-black text-white'}`}>
      <Calendar className="w-3 h-3" />
      {t('classroom.due')} {due.toLocaleDateString(undefined, { dateStyle: 'medium' })}
    </span>
  );
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

// ─── AssignmentsPanel ────────────────────────────────────────────────────────

export const AssignmentsPanel = ({
  classroomId,
  students,
  isTeacher,
}: {
  classroomId: string;
  students: string[];
  isTeacher: boolean;
}) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subs, setSubs] = useState<Record<string, Submission[]>>({});
  const [profiles, setProfiles] = useState<Record<string, StudentProfileSummary>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [challengeDrawer, setChallengeDrawer] = useState<Assignment | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Assignment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [savingGrade, setSavingGrade] = useState<string | null>(null);

  const myId = user?.uid ?? '';

  const loadAll = async () => {
    setLoadError(false);
    try {
      const list = await fetchAssignments(classroomId);
      setAssignments(list);
      const viewer = { uid: myId, isTeacher };
      const [subEntries, profileMap] = await Promise.all([
        Promise.all(
          list.map(async a => [
            a.id,
            await fetchSubmissions(classroomId, a.id, viewer),
          ] as const),
        ),
        isTeacher ? fetchStudentProfiles(students) : Promise.resolve({}),
      ]);
      setSubs(Object.fromEntries(subEntries));
      setProfiles(profileMap);
    } catch (e) {
      console.error('[Classroom] Failed to load assignments:', e);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, students, isTeacher, myId]);

  const refresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const ownSubmission = (a: Assignment) => (subs[a.id] ?? []).find(s => s.uid === myId);

  /** A solve inside the drawer finished — settle + refresh so the card flips. */
  const handleChallengeSolved = async ({ recorded, revealed }: { recorded: boolean; revealed: boolean }) => {
    // Teachers may preview the challenge, but the server never settles an
    // assignment for the teacher themselves, so don't settle or toast.
    if (isTeacher) return;
    if (recorded && challengeDrawer && !revealed) {
      // The server auto-syncs the linked assignment inside 'challenge-complete',
      // but that sync is best-effort. Settle explicitly to make the flip
      // deterministic. Idempotent: repeat/previous settlement yields awarded: 0,
      // and an existing submission's grade is preserved. Skipped for a revealed
      // solve, where the sync already records completion with 0 assignment XP.
      try {
        await completeAssignment(classroomId, challengeDrawer.id);
      } catch (e) {
        console.error('[Classroom] Explicit assignment settle failed:', e);
      }
    }
    await loadAll();
    if (recorded) {
      toast.success(t('classroom.challengeSolved'));
    } else {
      toast.error(t('classroom.challengeSolvedFailed'));
    }
  };

  const announceAward = (
    res: { awarded?: number } | null,
    kind: 'done' | 'submitted',
  ) => {
    if (!res) {
      toast.error(t('classroom.failedAddAssignment'));
      return;
    }
    const doneKey = kind === 'done' ? 'classroom.assignmentDone' : 'classroom.assignmentSubmitted';
    const noXpKey = kind === 'done' ? 'classroom.assignmentDoneNoXp' : 'classroom.assignmentSubmittedNoXp';
    if (res.awarded && res.awarded > 0) {
      toast.success(t(doneKey).replace('{xp}', String(res.awarded)));
    } else {
      toast.success(t(noXpKey));
    }
  };

  const handleComplete = async (a: Assignment) => {
    setCompleting(a.id);
    try {
      const res = await completeAssignment(classroomId, a.id);
      announceAward(res, 'done');
      if (res) await loadAll();
    } finally {
      setCompleting(null);
    }
  };

  const handleUpload = async (a: Assignment) => {
    const file = files[a.id];
    if (!file) {
      toast.error(t('classroom.chooseFileFirst'));
      return;
    }
    if (file.size > CLASSROOM_MAX_FILE_BYTES) {
      toast.error(
        t('classroom.fileTooLarge').replace('{size}', `${CLASSROOM_MAX_FILE_MB} MB`),
      );
      return;
    }
    setUploading(a.id);
    try {
      const meta = await uploadAssignmentFile(classroomId, a.id, file);
      const res = await completeAssignment(classroomId, a.id, meta);
      announceAward(res, 'submitted');
      if (res) {
        setFiles(prev => ({ ...prev, [a.id]: null }));
        await loadAll();
      }
    } catch (e) {
      console.error('[Classroom] Upload failed:', e);
      toast.error(t('classroom.uploadFailed'));
    } finally {
      setUploading(null);
    }
  };

  const handleDownload = async (sub: Submission) => {
    if (!sub.fileId) return;
    setDownloading(sub.fileId);
    try {
      await downloadSubmissionFile(sub.fileId, sub.fileName);
    } catch (e) {
      console.error('[Classroom] Download failed:', e);
      toast.error(t('classroom.downloadFailed'));
    } finally {
      setDownloading(null);
    }
  };

  const handleGrade = async (a: Assignment, uid: string, points: number, note: string) => {
    const key = `${a.id}:${uid}`;
    setSavingGrade(key);
    try {
      await gradeSubmission(classroomId, a.id, uid, points, note);
      toast.success(t('classroom.gradeSaved'));
      setSubs(prev => ({
        ...prev,
        [a.id]: (prev[a.id] ?? []).map(s =>
          s.uid === uid ? { ...s, points, note, gradedAt: new Date() } : s,
        ),
      }));
    } catch {
      toast.error(t('classroom.failedAddAssignment'));
    } finally {
      setSavingGrade(null);
    }
  };

  const handleDelete = (a: Assignment) => setPendingDelete(a);

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      await deleteAssignment(classroomId, target.id);
      setAssignments(prev => prev.filter(x => x.id !== target.id));
      setPendingDelete(null);
      toast.success(t('classroom.assignmentDeleted'));
    } catch {
      toast.error(t('classroom.failedAddAssignment'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 shadow-[4px_4px_0_0_#000]" />
        ))}
      </div>
    );
  }

  const fileButton = (sub: Submission, compact = false) =>
    sub.fileId && (
      <button
        type="button"
        onClick={() => handleDownload(sub)}
        disabled={downloading === sub.fileId}
        className={`inline-flex items-center gap-1.5 border-[2px] border-black bg-white text-black font-mono font-black uppercase tracking-widest hover:bg-[#74B9FF] transition-colors disabled:opacity-50 ${
          compact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'
        }`}
        title={sub.fileName ?? t('classroom.downloadFile')}
      >
        {downloading === sub.fileId
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <Download className="w-3 h-3" />}
        <span className="max-w-[120px] truncate">{sub.fileName ?? t('classroom.downloadFile')}</span>
        {!compact && sub.fileSize ? (
          <span className="text-black/50">({formatBytes(sub.fileSize)})</span>
        ) : null}
      </button>
    );

  return (
    <div className="space-y-4">
      {showAdd && (
        <AssignmentModal
          classroomId={classroomId}
          onClose={() => setShowAdd(false)}
          onAdded={a => setAssignments(prev => [a, ...prev])}
        />
      )}
      <ChallengeDrawer
        assignment={challengeDrawer}
        open={!!challengeDrawer}
        onOpenChange={open => { if (!open) setChallengeDrawer(null); }}
        onSolved={handleChallengeSolved}
      />
      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={open => { if (!open && !deleting) setPendingDelete(null); }}
        title={t('classroom.deleteAssignmentTitle')}
        description={pendingDelete ? `${pendingDelete.title} — ${t('classroom.deleteAssignmentConfirm')}` : t('classroom.deleteAssignmentConfirm')}
        confirmLabel={t('classroom.deleteButton')}
        destructive
        busy={deleting}
        onConfirm={confirmDelete}
      />

      <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isTeacher && (
          <button
            onClick={() => setShowAdd(true)}
            className={`bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-4 h-4" /> {t('classroom.addAssignment')}
          </button>
        )}
        <button
          onClick={refresh}
          disabled={refreshing}
          className="bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-3 py-2.5 hover:bg-[#FFF4CC] transition-all disabled:opacity-50 flex items-center gap-2"
          title={t('classroom.refresh')}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{t('classroom.refresh')}</span>
        </button>
      </div>

      {loadError && (
        <div className="bg-[#FF6B6B] border-[3px] border-black shadow-[4px_4px_0_0_#000] p-3 font-mono text-xs font-bold text-black">
          {t('classroom.loadAssignmentsFailed')}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-10 text-center space-y-3">
          <span className="w-12 h-12 bg-[#74B9FF] border-[3px] border-black grid place-items-center mx-auto shadow-[2px_2px_0_0_#000]">
            <BookOpen className="w-6 h-6 text-black" />
          </span>
          <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t('classroom.noAssignmentsYet')}</p>
          {isTeacher && <p className="font-mono text-xs font-bold text-black/60">{t('classroom.addFirstAssignment')}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const submissionList = subs[a.id] ?? [];
            const mine = ownSubmission(a);
            const completedCount = submissionList.filter(s => s.status === 'completed').length;
            const isExpanded = expanded === a.id;
            const isChallenge = a.type === 'challenge';
            const isUpload = a.type === 'upload';
            const TypeIcon = isChallenge ? Link2 : isUpload ? Upload : BookOpen;
            const busy = completing === a.id || uploading === a.id;

            return (
              <div key={a.id} className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] overflow-hidden">
                {/* ── Header row ── */}
                <div className={`p-4 flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : a.id)}
                    className="shrink-0 self-center p-1 border-[2px] border-black hover:bg-[#FFF4CC] transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <span className="w-9 h-9 bg-[#FFD23F] border-[3px] border-black grid place-items-center shrink-0 shadow-[2px_2px_0_0_#000] self-center">
                    <TypeIcon className="w-4 h-4 text-black" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm tracking-tight text-black" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {a.title}
                    </h3>
                    {a.description && (
                      <p className="font-mono text-xs mt-1 line-clamp-2 text-black/70">{a.description}</p>
                    )}
                    <div className={`flex items-center gap-2 mt-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="inline-flex items-center gap-1 bg-black text-white border-[2px] border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest">
                        <Star className="w-3 h-3" /> {a.points} {t('classroom.pointsShort')}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#FFD23F] text-black border-[2px] border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest">
                        +{a.xp} XP
                      </span>
                      {isUpload && (
                        <span className="inline-flex items-center gap-1 bg-[#74B9FF] text-black border-[2px] border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest">
                          <Paperclip className="w-3 h-3" /> {t('classroom.assignmentTypeUpload')}
                        </span>
                      )}
                      {isChallenge && a.challengeId && (
                        <button
                          type="button"
                          onClick={() => setChallengeDrawer(a)}
                          className="inline-flex items-center gap-1 bg-black text-white border-[2px] border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-[#FFD23F] hover:text-black transition-colors"
                        >
                          <Link2 className="w-3 h-3" /> {t('classroom.openChallenge')}
                        </button>
                      )}
                      {dueBadge(a.dueDate, t)}
                    </div>

                    {/* ── Student action row ── */}
                    {!isTeacher && (
                      <div className="mt-3 space-y-2">
                        {mine ? (
                          <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="inline-flex items-center gap-2 bg-[#88D498] text-black border-[2px] border-black px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-4 h-4" />
                              {t('classroom.completedWith').replace('{points}', String(mine.points))}
                              {mine.gradedAt ? ` · ${t('classroom.graded')}` : ''}
                            </span>
                            {fileButton(mine)}
                          </div>
                        ) : isUpload ? (
                          <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <label className="inline-flex items-center gap-2 bg-white border-[2px] border-black px-3 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-black cursor-pointer hover:bg-[#FFF4CC] transition-colors max-w-full">
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="truncate">
                                {files[a.id]?.name ?? t('classroom.chooseFile')}
                              </span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={e =>
                                  setFiles(prev => ({ ...prev, [a.id]: e.target.files?.[0] ?? null }))
                                }
                              />
                            </label>
                            <button
                              onClick={() => handleUpload(a)}
                              disabled={busy || !files[a.id]}
                              className="bg-black text-white border-[2px] border-black font-mono text-[11px] font-black uppercase tracking-widest px-4 py-2 hover:bg-[#FFD23F] hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {uploading === a.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Upload className="w-4 h-4" />}
                              {t('classroom.submitFile')}
                            </button>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/50 w-full">
                              {t('classroom.fileSizeHint').replace(
                                '{size}',
                                `${CLASSROOM_MAX_FILE_MB} MB`,
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={() => handleComplete(a)}
                              disabled={busy}
                              className="bg-black text-white border-[2px] border-black font-mono text-[11px] font-black uppercase tracking-widest px-4 py-2 hover:bg-[#FFD23F] hover:text-black transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {completing === a.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <CheckCircle2 className="w-4 h-4" />}
                              {t('classroom.markDone')}
                            </button>
                            {isChallenge && a.challengeId && (
                              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/50 max-w-xs">
                                {t('classroom.challengeAutoSync')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Teacher actions ── */}
                  {isTeacher && (
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(a)}
                        className="p-1.5 border-[2px] border-black hover:bg-[#FF6B6B] hover:text-black transition-colors"
                        title={t('classroom.deleteAssignment')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60 whitespace-nowrap">
                        {completedCount}/{students.length} {t('classroom.completedShort')}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Expanded: grading / submission detail ── */}
                {isExpanded && (
                  <div className="border-t-[3px] border-black bg-[#FFFDF5] p-4">
                    {isTeacher ? (
                      <div className="space-y-2">
                        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" /> {t('classroom.submissions')}
                        </p>
                        {students.length === 0 ? (
                          <p className="font-mono text-xs text-black/60">{t('classroom.noStudentsYet')}</p>
                        ) : (
                          students.map(uid => {
                            const sub = submissionList.find(s => s.uid === uid);
                            const name = profiles[uid]?.displayName ?? uid.slice(0, 10);
                            return (
                              <div key={uid} className={`flex items-center gap-2 bg-white border-[2px] border-black p-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={`w-2.5 h-2.5 shrink-0 border border-black ${sub ? 'bg-[#88D498]' : 'bg-black/10'}`} />
                                <p className="font-mono text-xs font-bold flex-1 truncate text-black min-w-[80px]">{name}</p>
                                {sub?.fileId && fileButton(sub, true)}
                                {sub ? (
                                  <>
                                    <input
                                      type="number"
                                      min={0}
                                      defaultValue={sub.points}
                                      id={`points-${a.id}-${uid}`}
                                      className="w-16 border-[2px] border-black px-2 py-1 font-mono text-xs font-bold"
                                      aria-label="Points"
                                    />
                                    <button
                                      onClick={() => {
                                        const el = document.getElementById(`points-${a.id}-${uid}`) as HTMLInputElement | null;
                                        handleGrade(a, uid, Math.max(0, Number(el?.value ?? 0)), sub.note ?? '');
                                      }}
                                      disabled={savingGrade === `${a.id}:${uid}`}
                                      className="bg-black text-white border-[2px] border-black font-mono text-[10px] font-black uppercase tracking-widest px-2 py-1 hover:bg-[#FFD23F] hover:text-black transition-all"
                                    >
                                      {savingGrade === `${a.id}:${uid}` ? <Loader2 className="w-3 h-3 animate-spin" /> : t('classroom.saveGrade')}
                                    </button>
                                  </>
                                ) : (
                                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/40">
                                    {t('classroom.pending')}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <div className="font-mono text-xs text-black/70 space-y-2">
                        {mine ? (
                          <>
                            <p className="flex items-center gap-2"><Trophy className="w-4 h-4 text-[#f59e0b]" />
                              {t('classroom.completedWith').replace('{points}', String(mine.points))}
                              {mine.completedAt ? ` · ${mine.completedAt.toLocaleDateString()}` : ''}
                            </p>
                            {mine.fileId && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60">
                                  {t('classroom.submittedFile')}:
                                </span>
                                {fileButton(mine)}
                              </div>
                            )}
                          </>
                        ) : (
                          <p>{t('classroom.notCompletedYet')}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
