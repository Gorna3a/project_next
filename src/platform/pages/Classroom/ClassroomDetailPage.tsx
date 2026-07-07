'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Users, BookOpen, Plus, Loader2, Calendar,
  Copy, Check, GraduationCap, ClipboardList,
} from 'lucide-react';
import {
  doc, getDoc, collection, getDocs, addDoc, serverTimestamp,
  query, orderBy,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassroomData {
  id: string;
  name: string;
  description: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  students: string[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  createdAt: Date;
}

// ─── Add Assignment Modal ─────────────────────────────────────────────────────

const AddAssignmentModal = ({
  classroomId,
  onClose,
  onAdded,
}: {
  classroomId: string;
  onClose: () => void;
  onAdded: (a: Assignment) => void;
}) => {
  const { t, isRTL } = useLanguage();
  const [title,  setTitle]  = useState('');
  const [desc,   setDesc]   = useState('');
  const [due,    setDue]    = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const ref = await addDoc(
        collection(db, 'classrooms', classroomId, 'assignments'),
        {
          title:       title.trim(),
          description: desc.trim(),
          dueDate:     due ? new Date(due) : null,
          createdAt:   serverTimestamp(),
        },
      );
      onAdded({
        id:          ref.id,
        title:       title.trim(),
        description: desc.trim(),
        dueDate:     due ? new Date(due) : null,
        createdAt:   new Date(),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`card p-6 w-full max-w-md space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {t('classroom.addAssignment')}
        </h2>

        <div className="space-y-3">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('classroom.assignmentTitleLabel')}
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('classroom.assignmentTitlePlaceholder')}
              className={`input ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('classroom.assignmentDescLabel')}
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={t('classroom.assignmentDescPlaceholder')}
              rows={3}
              className={`input resize-none ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('classroom.dueDateLabel')}
            </label>
            <input
              type="datetime-local"
              value={due}
              onChange={e => setDue(e.target.value)}
              className={`input ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="btn-primary flex-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t('classroom.addAssignmentButton')
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── ClassroomDetailPage ──────────────────────────────────────────────────────

export default function ClassroomDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { profile }       = useAuth();
  const { t, isRTL }      = useLanguage();

  const [classroom,     setClassroom]     = useState<ClassroomData | null>(null);
  const [assignments,   setAssignments]   = useState<Assignment[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [showAddAssign, setShowAddAssign] = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [activeTab,     setActiveTab]     = useState<'assignments' | 'students'>('assignments');

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [classSnap, assignSnap] = await Promise.all([
          getDoc(doc(db, 'classrooms', id)),
          getDocs(
            query(
              collection(db, 'classrooms', id, 'assignments'),
              orderBy('createdAt', 'desc'),
            ),
          ),
        ]);

        if (classSnap.exists()) {
          setClassroom({ id: classSnap.id, ...classSnap.data() } as ClassroomData);
        }

        setAssignments(
          assignSnap.docs.map(d => ({
            id:          d.id,
            ...d.data(),
            dueDate:     d.data().dueDate?.toDate?.() ?? null,
            createdAt:   d.data().createdAt?.toDate?.() ?? new Date(),
          } as Assignment)),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const copyCode = async () => {
    if (!classroom) return;
    await navigator.clipboard.writeText(classroom.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div
          className="h-40 rounded-2xl"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          />
        ))}
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!classroom) {
    return (
      <div className="text-center py-20 space-y-4">
        <GraduationCap
          className="w-12 h-12 mx-auto opacity-20"
          style={{ color: 'var(--text-muted)' }}
        />
        <p style={{ color: 'var(--text-primary)' }}>{t('classroom.notFound')}</p>
        <Link href="/app/classroom" className={`btn-secondary inline-flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('classroom.backToClassrooms')}
        </Link>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
      className={`max-w-4xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <AnimatePresence>
        {showAddAssign && id && (
          <AddAssignmentModal
            classroomId={id}
            onClose={() => setShowAddAssign(false)}
            onAdded={a => setAssignments(prev => [a, ...prev])}
          />
        )}
      </AnimatePresence>

      {/* ── Back link ── */}
      <Link
        href="/app/classroom"
        className={`btn-ghost inline-flex gap-2 text-sm ${isRTL ? 'flex-row-reverse -mr-2' : '-ml-2'}`}
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('classroom.title')}
      </Link>

      {/* ── Classroom header card ── */}
      <div className="card p-6 space-y-4">
        <div className={`flex items-start justify-between gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {classroom.name}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {isTeacher
                ? t('classroom.studentsEnrolled').replace('{count}', classroom.students.length.toString())
                : t('classroom.taughtBy').replace('{name}', classroom.teacherName)}
            </p>
          </div>

          {/* Join code pill — teachers only */}
          {isTeacher && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t('classroom.joinCodeLabel')}
              </span>
              <code
                className="font-mono font-bold text-sm"
                style={{ color: 'var(--accent-text)' }}
              >
                {classroom.joinCode}
              </code>
              <button onClick={copyCode} className="btn-ghost p-1">
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {classroom.description && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {classroom.description}
          </p>
        )}

        {/* Quick stats */}
        <div className={`flex gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div
            className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          >
            <Users className="w-4 h-4" />
            {t('classroom.studentsCount').replace('{count}', classroom.students.length.toString())}
          </div>
          <div
            className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          >
            <ClipboardList className="w-4 h-4" />
            {t('classroom.assignmentsCount').replace('{count}', assignments.length.toString())}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div
        className={`flex gap-1 p-1 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ backgroundColor: 'var(--bg-subtle)' }}
      >
        {(['assignments', 'students'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
              color:           activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow:       activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab === 'assignments' ? t('classroom.assignmentsTab') : t('classroom.studentsTab')}
          </button>
        ))}
      </div>

      {/* ── Assignments tab ── */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {isTeacher && (
            <button
              onClick={() => setShowAddAssign(true)}
              className={`btn-primary gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="w-4 h-4" /> {t('classroom.addAssignment')}
            </button>
          )}

          {assignments.length === 0 ? (
            <div className="card p-10 text-center space-y-2">
              <ClipboardList
                className="w-10 h-10 mx-auto opacity-20"
                style={{ color: 'var(--text-muted)' }}
              />
              <p style={{ color: 'var(--text-primary)' }}>{t('classroom.noAssignmentsYet')}</p>
              {isTeacher && (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {t('classroom.addFirstAssignment')}
                </p>
              )}
            </div>
          ) : (
            <motion.div className={`space-y-3 ${isRTL ? 'direction-rtl' : ''}`}>
              {assignments.map((a, i) => (
                <motion.div
                  key={a.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: i * 0.06 }}
                  className={`card p-4 flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent-subtle)' }}
                  >
                    <BookOpen
                      className="w-4 h-4"
                      style={{ color: 'var(--accent-text)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {a.title}
                    </h3>
                    {a.description && (
                      <p
                        className="text-xs mt-0.5 line-clamp-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {a.description}
                      </p>
                    )}
                    {a.dueDate && (
                      <div
                        className={`flex items-center gap-1 mt-1.5 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <Calendar className="w-3 h-3" />
                        {t('classroom.due')}{' '}
                        {a.dueDate.toLocaleDateString(isRTL ? 'ar-EG' : undefined, {
                          dateStyle: 'medium',
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* ── Students tab ── */}
      {activeTab === 'students' && (
        <div className="space-y-3">
          {classroom.students.length === 0 ? (
            <div className="card p-10 text-center space-y-2">
              <Users
                className="w-10 h-10 mx-auto opacity-20"
                style={{ color: 'var(--text-muted)' }}
              />
              <p style={{ color: 'var(--text-primary)' }}>{t('classroom.noStudentsYet')}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {t('classroom.shareJoinCode')}
              </p>
            </div>
          ) : (
            classroom.students.map((uid, i) => (
              <motion.div
                key={uid}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.05 }}
                className={`card p-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    color:           'var(--accent-text)',
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('classroom.studentLabel').replace('{index}', (i + 1).toString())}
                  </p>
                  <p
                    className={`text-xs font-mono ${isRTL ? 'text-left' : 'text-left'}`}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {uid.slice(0, 12)}…
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}
