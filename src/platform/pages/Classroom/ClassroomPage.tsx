'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Plus, Copy, Check, LogIn, Loader2, GraduationCap, Hash,
} from 'lucide-react';
import {
  collection, query, where, getDocs, addDoc, updateDoc,
  doc, arrayUnion, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import Link from "next/link";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Classroom {
  id: string;
  name: string;
  description: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  students: string[];
  createdAt: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// ─── Create Classroom Modal ───────────────────────────────────────────────────

const CreateModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (c: Classroom) => void;
}) => {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const [name,   setName]   = useState('');
  const [desc,   setDesc]   = useState('');
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleCreate = async () => {
    if (!name.trim() || !user || !profile) return;
    setSaving(true);
    try {
      const joinCode = generateCode();
      const teacherName = profile.displayName ?? t('common.teacher');
      const ref = await addDoc(collection(db, 'classrooms'), {
        name:        name.trim(),
        description: desc.trim(),
        teacherId:   user.uid,
        teacherName,
        joinCode,
        students:    [],
        createdAt:   serverTimestamp(),
      });
      onCreated({
        id:          ref.id,
        name:        name.trim(),
        description: desc.trim(),
        joinCode,
        teacherId:   user.uid,
        teacherName,
        students:    [],
        createdAt:   new Date(),
      });
      onClose();
    } catch (e) {
      setError(t('classroom.failedCreate'));
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
        className={`card p-6 w-full max-w-md space-y-4 shadow-2xl ${isRTL ? 'text-right' : 'text-left'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {t('classroom.createModalTitle')}
        </h2>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-3">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('classroom.nameLabel')}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('classroom.namePlaceholder')}
              className={`input ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: 'var(--text-muted)' }}
            >
              {t('classroom.descLabel')}
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={t('classroom.descPlaceholder')}
              rows={3}
              className={`input resize-none ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="btn-primary flex-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t('common.create')
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Join Classroom ───────────────────────────────────────────────────────────

const JoinSection = ({ onJoined }: { onJoined: (c: Classroom) => void }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleJoin = async () => {
    if (!code.trim() || !user) return;
    setLoading(true);
    setError('');
    try {
      const q = query(
        collection(db, 'classrooms'),
        where('joinCode', '==', code.trim().toUpperCase()),
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError(t('classroom.noClassroomFound'));
        return;
      }

      const classDoc  = snap.docs[0];
      const classData = classDoc.data();

      if (classData.students?.includes(user.uid)) {
        setError(t('classroom.alreadyEnrolled'));
        return;
      }

      // Add student to classroom
      await updateDoc(doc(db, 'classrooms', classDoc.id), {
        students: arrayUnion(user.uid),
      });

      // Add to user's enrolled classrooms sub-collection
      await setDoc(
        doc(db, 'users', user.uid, 'enrolledClassrooms', classDoc.id),
        { classroomId: classDoc.id, joinedAt: serverTimestamp() },
      );

      onJoined({
        id: classDoc.id,
        ...classData,
        createdAt: classData.createdAt?.toDate?.() ?? new Date(),
      } as Classroom);
      setCode('');
    } catch (e) {
      setError(t('classroom.failedJoin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card p-5 space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LogIn className="w-4 h-4" style={{ color: 'var(--accent-text)' }} />
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {t('classroom.joinTitle')}
        </h3>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Hash
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${isRTL ? 'right-3' : 'left-3'}`}
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder={t('classroom.joinCodePlaceholder')}
            maxLength={6}
            className={`input font-mono tracking-widest uppercase ${isRTL ? 'pr-9 text-right' : 'pl-9 text-left'}`}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </div>
        <button
          onClick={handleJoin}
          disabled={code.length < 6 || loading}
          className="btn-primary px-5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t('classroom.joinButton')
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Classroom Card ───────────────────────────────────────────────────────────

const ClassroomCard = ({
  classroom,
  isTeacher,
  t,
  isRTL
}: {
  classroom: Classroom;
  isTeacher: boolean;
  t: any;
  isRTL: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(classroom.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={fadeUp}
      className={`card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="min-w-0">
          <h3
            className="font-semibold truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {classroom.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isTeacher
              ? t('classroom.studentsEnrolled').replace('{count}', classroom.students.length.toString())
              : t('classroom.byTeacher').replace('{name}', classroom.teacherName)}
          </p>
        </div>
        <div
          className="flex-shrink-0 p-2 rounded-xl"
          style={{ backgroundColor: 'var(--accent-subtle)' }}
        >
          <GraduationCap
            className="w-5 h-5"
            style={{ color: 'var(--accent-text)' }}
          />
        </div>
      </div>

      {classroom.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {classroom.description}
        </p>
      )}

      {/* Join code visible only to teacher */}
      {isTeacher && (
        <div
          className={`flex items-center gap-2 p-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
          style={{ backgroundColor: 'var(--bg-subtle)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('classroom.joinCodeLabel')}
          </span>
          <code
            className="text-sm font-mono font-bold flex-1"
            style={{ color: 'var(--accent-text)' }}
          >
            {classroom.joinCode}
          </code>
          <button
            onClick={copyCode}
            className="btn-ghost p-1.5"
            title={t('classroom.copyCode')}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      <Link
        href={`/app/classroom/${classroom.id}`}
        className="btn-primary w-full justify-center text-xs py-2"
      >
        {isTeacher ? t('common.manage') : t('common.open')} {t('classroom.title')}
      </Link>
    </motion.div>
  );
};

// ─── Main ClassroomPage ───────────────────────────────────────────────────────

export default function ClassroomPage() {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchClassrooms = async () => {
      try {
        const q = isTeacher
          ? query(collection(db, 'classrooms'), where('teacherId', '==', user.uid))
          : query(collection(db, 'classrooms'), where('students', 'array-contains', user.uid));

        const snap = await getDocs(q);
        setClassrooms(
          snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
          } as Classroom)),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClassrooms();
  }, [user, isTeacher]);

  const handleCreated = (c: Classroom) =>
    setClassrooms(prev => [c, ...prev]);

  const handleJoined = (c: Classroom) =>
    setClassrooms(prev => [c, ...prev]);

  return (
    <div className={`max-w-5xl mx-auto space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <AnimatePresence>
        {showCreate && (
          <CreateModal
            onClose={() => setShowCreate(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🎓 {t('classroom.title')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {isTeacher
              ? t('classroom.createDesc')
              : t('classroom.joinDesc')}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreate(true)}
            className={`btn-primary gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-4 h-4" /> {t('classroom.createButton')}
          </button>
        )}
      </div>

      {/* ── Join section (students only) ── */}
      {!isTeacher && <JoinSection onJoined={handleJoined} />}

      {/* ── Classroom grid ── */}
      {loading ? (
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div
                className="h-4 rounded w-2/3"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              />
              <div
                className="h-3 rounded w-1/2"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              />
              <div
                className="h-8 rounded-xl"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              />
            </div>
          ))}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <GraduationCap
            className="w-12 h-12 mx-auto opacity-20"
            style={{ color: 'var(--text-muted)' }}
          />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {isTeacher ? t('classroom.noClassroomsYet') : t('classroom.noEnrolledClassrooms')}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isTeacher
              ? t('classroom.createFirstClassroom')
              : t('classroom.askTeacherCode')}
          </p>
          {isTeacher && (
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary mx-auto"
            >
              <Plus className="w-4 h-4" /> {t('classroom.createButton')}
            </button>
          )}
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${isRTL ? 'direction-rtl' : ''}`}
        >
          {classrooms.map(c => (
            <ClassroomCard key={c.id} classroom={c} isTeacher={isTeacher} t={t} isRTL={isRTL} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
