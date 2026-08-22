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
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        className={`bg-white border-[3px] border-black shadow-[8px_8px_0_0_#000] p-6 w-full max-w-md space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-black text-lg tracking-tight text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t('classroom.createModalTitle')}
        </h2>

        {error && <p className="font-mono text-xs font-bold bg-[#FF6B6B] border-[2px] border-black px-3 py-2 text-black">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.nameLabel')}
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('classroom.namePlaceholder')}
              className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#000] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.descLabel')}
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={t('classroom.descPlaceholder')}
              rows={3}
              className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none resize-none ${isRTL ? 'text-right' : 'text-left'}`}
            />
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={onClose} className="flex-1 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || saving}
            className="flex-1 bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      await updateDoc(doc(db, 'classrooms', classDoc.id), {
        students: arrayUnion(user.uid),
      });

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
    <div className={`bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-5 space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="w-8 h-8 bg-black border-[2px] border-black grid place-items-center shrink-0">
          <LogIn className="w-4 h-4 text-white" />
        </span>
        <h3 className="font-mono text-xs font-black uppercase tracking-widest text-black">
          {t('classroom.joinTitle')}
        </h3>
      </div>

      {error && <p className="font-mono text-xs font-bold bg-[#FF6B6B] border-[2px] border-black px-3 py-2 text-black">{error}</p>}

      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Hash
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-black ${isRTL ? 'right-3' : 'left-3'}`}
          />
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder={t('classroom.joinCodePlaceholder')}
            maxLength={6}
            className={`w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2.5 font-mono text-sm font-black tracking-[0.2em] uppercase placeholder:text-black/30 focus:outline-none ${isRTL ? 'pr-9 text-right' : 'pl-9 text-left'}`}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </div>
        <button
          onClick={handleJoin}
          disabled={code.length < 6 || loading}
          className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-5 hover:bg-[#FFD23F] hover:text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
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
      className={`bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-5 flex flex-col gap-3 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#000] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="min-w-0">
          <h3 className="font-black text-sm tracking-tight truncate text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {classroom.name}
          </h3>
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest mt-1 text-black/60">
            {isTeacher
              ? t('classroom.studentsEnrolled').replace('{count}', classroom.students.length.toString())
              : t('classroom.byTeacher').replace('{name}', classroom.teacherName)}
          </p>
        </div>
        <span className="shrink-0 w-10 h-10 bg-[#FFD23F] border-[3px] border-black grid place-items-center shadow-[2px_2px_0_0_#000]">
          <GraduationCap className="w-5 h-5 text-black" />
        </span>
      </div>

      {classroom.description && (
        <p className="font-mono text-xs leading-relaxed line-clamp-2 text-black/70 border-l-[3px] border-black pl-3 bg-[#FFFDF5] py-1">
          {classroom.description}
        </p>
      )}

      {isTeacher && (
        <div className={`flex items-center gap-2 p-2 bg-[#FFFDF5] border-[3px] border-black ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black/60">
            {t('classroom.joinCodeLabel')}
          </span>
          <code className="font-mono text-sm font-black flex-1 tracking-widest text-black">
            {classroom.joinCode}
          </code>
          <button
            onClick={copyCode}
            className="bg-white text-black border-[2px] border-black p-1.5 hover:bg-black hover:text-white transition-colors"
            title={t('classroom.copyCode')}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#88D498]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      <Link
        href={`/app/classroom/${classroom.id}`}
        className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest w-full flex items-center justify-center py-2.5 hover:bg-[#FFD23F] hover:text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
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
    <div className={`max-w-5xl mx-auto space-y-6 pb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
      <AnimatePresence>
        {showCreate && (
          <CreateModal
            onClose={() => setShowCreate(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>

      {/* ── Header — black masthead ── */}
      <div className={`bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white hidden sm:inline-block" />
            🎓 {t('classroom.title')}
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-widest mt-1 text-white/60">
            {isTeacher
              ? t('classroom.createDesc')
              : t('classroom.joinDesc')}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowCreate(true)}
            className={`bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
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
            <div key={i} className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-black/10 w-2/3 border border-black/10" />
              <div className="h-3 bg-black/10 w-1/2 border border-black/10" />
              <div className="h-8 bg-black border-[2px] border-black" />
            </div>
          ))}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-12 text-center space-y-3">
          <span className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
            <GraduationCap className="w-7 h-7 text-black" />
          </span>
          <p className="font-black text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isTeacher ? t('classroom.noClassroomsYet') : t('classroom.noEnrolledClassrooms')}
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
            {isTeacher
              ? t('classroom.createFirstClassroom')
              : t('classroom.askTeacherCode')}
          </p>
          {isTeacher && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest px-4 py-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all inline-flex items-center gap-2"
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
