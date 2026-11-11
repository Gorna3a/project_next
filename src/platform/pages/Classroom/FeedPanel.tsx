'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Megaphone, MessageSquare, Send, Trash2, Loader2, BadgeCheck,
} from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';
import { useAuth } from '../../../core/context/AuthContext';
import { useLanguage } from '../../../core/context/LanguageContext';
import { fetchFeed, postFeed } from './classroomService';
import type { FeedPost, FeedPostType } from './classroomTypes';
import { ConfirmDialog } from './ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';

export const FeedPanel = ({
  classroomId,
  isTeacher,
}: {
  classroomId: string;
  isTeacher: boolean;
}) => {
  const { user, profile } = useAuth();
  const { t, isRTL } = useLanguage();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [announcement, setAnnouncement] = useState(false);
  const [posting, setPosting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FeedPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setPosts(await fetchFeed(classroomId));
    } catch (e) {
      console.error('[Classroom] Failed to load feed:', e);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePost = async () => {
    const text = body.trim();
    if (!text || !user) return;
    const type: FeedPostType = isTeacher && announcement ? 'announcement' : 'post';
    setPosting(true);
    try {
      await postFeed(classroomId, {
        body: text,
        authorId: user.uid,
        authorName: profile?.displayName ?? 'PixelCoder',
        type,
      });
      setBody('');
      setAnnouncement(false);
      await load();
    } catch {
      toast.error(t('classroom.failedPost'));
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = (post: FeedPost) => setPendingDelete(post);

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'classrooms', classroomId, 'feed', pendingDelete.id));
      setPosts(prev => prev.filter(p => p.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      toast.error(t('classroom.failedPost'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Composer ── */}
      <div className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-2">
        {isTeacher && (
          <label className={`flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-black cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              checked={announcement}
              onChange={e => setAnnouncement(e.target.checked)}
              className="accent-black"
            />
            <Megaphone className="w-3.5 h-3.5" /> {t('classroom.postAsAnnouncement')}
          </label>
        )}
        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={announcement ? t('classroom.announcementPlaceholder') : t('classroom.discussionPlaceholder')}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
            className="flex-1 bg-white border-[3px] border-black px-3 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none"
          />
          <button
            onClick={handlePost}
            disabled={!body.trim() || posting}
            className="bg-black text-white border-[3px] border-black px-4 hover:bg-[#FFD23F] hover:text-black transition-all disabled:opacity-50 flex items-center justify-center"
            aria-label={t('classroom.post')}
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 shadow-[4px_4px_0_0_#000]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-10 text-center space-y-3">
          <span className="w-12 h-12 bg-[#88D498] border-[3px] border-black grid place-items-center mx-auto shadow-[2px_2px_0_0_#000]">
            <MessageSquare className="w-6 h-6 text-black" />
          </span>
          <p className="font-mono text-xs font-black uppercase tracking-widest text-black">{t('classroom.noFeedYet')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => {
            const isAnnouncement = post.type === 'announcement';
            const canDelete = user?.uid === post.authorId || isTeacher;
            return (
              <div
                key={post.id}
                className={`border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 ${
                  isAnnouncement ? 'bg-[#FFF4CC]' : 'bg-white'
                }`}
              >
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`w-8 h-8 grid place-items-center border-[2px] border-black shrink-0 ${isAnnouncement ? 'bg-[#FFD23F]' : 'bg-black text-white'}`}>
                    {isAnnouncement ? <Megaphone className="w-4 h-4 text-black" /> : <MessageSquare className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="font-mono text-[11px] font-black uppercase tracking-widest text-black">{post.authorName}</p>
                      {isAnnouncement && (
                        <span className="inline-flex items-center gap-1 bg-black text-[#FFD23F] border-[2px] border-black px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-widest">
                          <BadgeCheck className="w-3 h-3" /> {t('classroom.announcement')}
                        </span>
                      )}
                      <span className="font-mono text-[10px] font-bold text-black/50">
                        {post.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-mono text-xs leading-relaxed mt-1.5 text-black whitespace-pre-wrap">{post.body}</p>
                  </div>
                  {canDelete && (
                    <button onClick={() => handleDelete(post)} className="p-1.5 border-[2px] border-transparent hover:border-black hover:bg-[#FF6B6B] hover:text-black transition-all shrink-0" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Delete post confirmation (shadcn Dialog) ── */}
      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={open => { if (!open) setPendingDelete(null); }}
        title={t('classroom.deletePostTitle')}
        description={t('classroom.deletePostConfirm')}
        confirmLabel={t('classroom.deleteButton')}
        destructive
        busy={deleting}
        icon={<Trash2 className="w-4 h-4" />}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
