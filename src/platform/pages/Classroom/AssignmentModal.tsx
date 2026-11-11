'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useLanguage } from '../../../core/context/LanguageContext';
import { addAssignment } from './classroomService';
import { CLASSROOM_MAX_FILE_MB } from './classroomTypes';
import type { Assignment, AssignmentType } from './classroomTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ChallengeOption {
  id: string;
  title: string;
}

export const AssignmentModal = ({
  classroomId,
  onClose,
  onAdded,
}: {
  classroomId: string;
  onClose: () => void;
  onAdded: (a: Assignment) => void;
}) => {
  const { t, isRTL } = useLanguage();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [type, setType] = useState<AssignmentType>('task');
  const [challengeId, setChallengeId] = useState('');
  const [points, setPoints] = useState(10);
  const [xp, setXp] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [challenges, setChallenges] = useState<ChallengeOption[]>([]);

  useEffect(() => {
    getDocs(query(collection(db, 'challenges'), limit(50)))
      .then(snap =>
        setChallenges(snap.docs.map(d => ({ id: d.id, title: String(d.data().title ?? d.id) }))),
      )
      .catch(() => setChallenges([]));
  }, []);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const a = await addAssignment(classroomId, {
        title: title.trim(),
        description: desc.trim(),
        dueDate: due ? new Date(due) : null,
        type,
        challengeId: type === 'challenge' ? challengeId || null : null,
        points: Math.max(0, points),
        xp: Math.max(0, Math.min(25, xp)),
      });
      onAdded(a);
      onClose();
    } catch {
      setError(t('classroom.failedAddAssignment'));
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-3 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none ${
    isRTL ? 'text-right' : 'text-left'
  }`;

  return (
    <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className={`max-w-lg ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle>{t('classroom.addAssignment')}</DialogTitle>
        </DialogHeader>

        {error && <p className="font-mono text-xs font-bold bg-[#FF6B6B] border-[2px] border-black px-3 py-2 text-black">{error}</p>}

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.assignmentTitleLabel')}
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('classroom.assignmentTitlePlaceholder')} className={inputClass} autoFocus />
          </div>

          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.assignmentDescLabel')}
            </label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('classroom.assignmentDescPlaceholder')} rows={2} className={`${inputClass} resize-none`} />
          </div>

          {/* ── Type ── */}
          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.assignmentType')}
            </label>
            <div className={`grid grid-cols-3 gap-2 ${isRTL ? 'direction-rtl' : ''}`}>
              {(['task', 'challenge', 'upload'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setType(opt)}
                  className={`border-[3px] border-black px-2 py-2 font-mono text-[10px] font-black uppercase tracking-wider transition-all ${
                    type === opt
                      ? 'bg-black text-white shadow-[3px_3px_0_0_#000]'
                      : 'bg-white text-black hover:bg-[#FFF4CC]'
                  }`}
                >
                  {t(
                    `classroom.assignmentType${
                      opt === 'task' ? 'Task' : opt === 'challenge' ? 'Challenge' : 'Upload'
                    }`,
                  )}
                </button>
              ))}
            </div>
            {type === 'upload' && (
              <p className="font-mono text-[10px] font-bold text-black/60 mt-2">
                {t('classroom.uploadAssignmentHint').replace(
                  '{size}',
                  `${CLASSROOM_MAX_FILE_MB} MB`,
                )}
              </p>
            )}
          </div>

          {type === 'challenge' && (
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
                {t('classroom.linkChallenge')}
              </label>
              <select value={challengeId} onChange={e => setChallengeId(e.target.value)} className={inputClass}>
                <option value="">{t('classroom.noLinkedChallenge')}</option>
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* ── Points / XP ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
                {t('classroom.points')}
              </label>
              <input type="number" min={0} max={1000} value={points} onChange={e => setPoints(Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
                {t('classroom.xpReward')}
              </label>
              <input type="number" min={0} max={25} value={xp} onChange={e => setXp(Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] font-black uppercase tracking-widest mb-1 block text-black">
              {t('classroom.dueDateLabel')}
            </label>
            <input type="datetime-local" value={due} onChange={e => setDue(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button onClick={onClose} className="flex-1 bg-white text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:bg-black hover:text-white transition-all">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="flex-1 bg-[#FFD23F] text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] font-mono text-xs font-black uppercase tracking-widest py-2.5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('classroom.addAssignmentButton')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
