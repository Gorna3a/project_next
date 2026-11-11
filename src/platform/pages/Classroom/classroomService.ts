// ─── Classroom helpers (client-side) ──────────────────────────────────────────
// Reads are scoped by Firestore rules: a classroom participant may read its
// assignments and feed. Students may read *only their own* submission, so
// `fetchSubmissions` switches between a single-doc read and a collection read
// based on the viewer. Class-wide aggregates (leaderboard) and file attachments
// go through server API routes, which validate membership and use the Admin SDK.

import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, arrayRemove, serverTimestamp,
} from 'firebase/firestore';
import { upload } from '@vercel/blob/client';
import { auth, db } from '../../../core/firebase';
import { requestXpAward } from '../../../core/services/xpClient';
import type {
  Assignment,
  FeedPost,
  FeedPostType,
  LeaderboardRow,
  StudentProfileSummary,
  Submission,
  UploadedFileMeta,
} from './classroomTypes';

// ─── Time helper ──────────────────────────────────────────────────────────────

const toDate = (value: unknown): Date | null => {
  const maybe = value as { toDate?: () => Date } | null | undefined;
  return typeof maybe?.toDate === 'function' ? maybe.toDate() : null;
};

// ─── Assignments ─────────────────────────────────────────────────────────────

export const fetchAssignments = async (classroomId: string): Promise<Assignment[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'classrooms', classroomId, 'assignments'),
      orderBy('createdAt', 'desc'),
    ),
  );
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      type: (data.type as Assignment['type']) ?? 'task',
      challengeId: (data.challengeId as string | undefined) ?? null,
      points: Number(data.points ?? 10),
      xp: Number(data.xp ?? 5),
      dueDate: toDate(data.dueDate),
      createdAt: toDate(data.createdAt) ?? new Date(),
    };
  });
};

export const addAssignment = async (
  classroomId: string,
  data: {
    title: string;
    description: string;
    dueDate: Date | null;
    type: Assignment['type'];
    challengeId: string | null;
    points: number;
    xp: number;
  },
): Promise<Assignment> => {
  const ref = await addDoc(
    collection(db, 'classrooms', classroomId, 'assignments'),
    { ...data, createdAt: serverTimestamp() },
  );
  return { id: ref.id, ...data, createdAt: new Date() };
};

export const deleteAssignment = async (classroomId: string, assignmentId: string) => {
  await deleteDoc(doc(db, 'classrooms', classroomId, 'assignments', assignmentId));
};

/** Student marks an assignment done (or submits an uploaded file). */
export const completeAssignment = (
  classroomId: string,
  assignmentId: string,
  file?: UploadedFileMeta,
) =>
  requestXpAward('classroom-assignment', {
    classroomId,
    assignmentId,
    ...(file
      ? {
          fileId: file.fileId,
          fileName: file.fileName,
          contentType: file.contentType,
          size: file.size,
        }
      : {}),
  });

// ─── Submissions / grades ─────────────────────────────────────────────────────

const mapSubmission = (uid: string, raw: Record<string, unknown>): Submission => ({
  uid: typeof raw.uid === 'string' ? raw.uid : uid,
  status: 'completed',
  points: Number(raw.points ?? 0),
  xp: Number(raw.xp ?? 0),
  completedAt: toDate(raw.completedAt),
  gradedAt: toDate(raw.gradedAt),
  note: typeof raw.note === 'string' ? raw.note : undefined,
  fileId: typeof raw.fileId === 'string' ? raw.fileId : undefined,
  fileName: typeof raw.fileName === 'string' ? raw.fileName : undefined,
  fileSize: typeof raw.fileSize === 'number' ? raw.fileSize : undefined,
  contentType: typeof raw.contentType === 'string' ? raw.contentType : undefined,
});

/**
 * Teachers get every submission; students get exactly their own document
 * (Firestore rules cannot filter a `list`, so students must not list).
 */
export const fetchSubmissions = async (
  classroomId: string,
  assignmentId: string,
  viewer: { uid: string; isTeacher: boolean },
): Promise<Submission[]> => {
  const submissionsRef = collection(
    db, 'classrooms', classroomId, 'assignments', assignmentId, 'submissions',
  );
  if (viewer.isTeacher) {
    const snap = await getDocs(submissionsRef);
    return snap.docs.map(d => mapSubmission(d.id, d.data()));
  }
  if (!viewer.uid) return [];
  try {
    const snap = await getDoc(doc(submissionsRef, viewer.uid));
    return snap.exists() ? [mapSubmission(snap.id, snap.data())] : [];
  } catch (e) {
    // Firestore returns permission-denied (not 404) for a missing document
    // under these rules; that simply means the student hasn't submitted yet.
    if ((e as { code?: string }).code === 'permission-denied') return [];
    throw e;
  }
};

export const gradeSubmission = async (
  classroomId: string,
  assignmentId: string,
  uid: string,
  points: number,
  note?: string,
) => {
  await updateDoc(
    doc(db, 'classrooms', classroomId, 'assignments', assignmentId, 'submissions', uid),
    { points, note: note ?? '', gradedAt: serverTimestamp() },
  );
};

// ─── Attachments (private Vercel Blob; direct browser upload) ────────────────

const authHeader = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  return { Authorization: `Bearer ${await user.getIdToken()}` };
};

/** One safe pathname segment for the blob key (keeps the original extension). */
const uploadPathSegment = (name: string): string =>
  name
    .replace(/[^A-Za-z0-9._-]+/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 80) || 'file';

export const uploadAssignmentFile = async (
  classroomId: string,
  assignmentId: string,
  file: File,
): Promise<UploadedFileMeta> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const idToken = await user.getIdToken();

  // Direct browser → Vercel Blob upload. The server only signs a scoped token;
  // the file never passes through the Next.js function (4.5 MB body limit).
  const pathname = `classrooms/${classroomId}/assignments/${assignmentId}/${user.uid}/${Date.now()}-${uploadPathSegment(file.name)}`;
  const blob = await upload(pathname, file, {
    access: 'private',
    handleUploadUrl: '/api/classroom/file/upload',
    headers: { authorization: `Bearer ${idToken}` },
    clientPayload: JSON.stringify({ classroomId, assignmentId }),
  });

  // Persist only metadata in Firestore; the blob stays private.
  const res = await fetch('/api/classroom/file', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${idToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      classroomId,
      assignmentId,
      pathname: blob.pathname,
      fileName: file.name,
    }),
  });
  const json = (await res.json().catch(() => null)) as
    | (UploadedFileMeta & { error?: string })
    | null;
  if (!res.ok || !json?.fileId) {
    throw new Error(json?.error ?? 'Upload failed');
  }
  return json;
};

export const downloadSubmissionFile = async (fileId: string, fileName?: string) => {
  const headers = await authHeader();
  const res = await fetch(`/api/classroom/file?fileId=${encodeURIComponent(fileId)}`, {
    headers,
  });
  if (!res.ok) {
    const detail = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(detail?.error ?? 'Download failed');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'attachment';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

// ─── Leaderboard (server aggregate — students can't list submissions) ────────

export const fetchLeaderboard = async (classroomId: string): Promise<LeaderboardRow[]> => {
  const headers = await authHeader();
  const res = await fetch(
    `/api/classroom/leaderboard?classroomId=${encodeURIComponent(classroomId)}`,
    { headers, cache: 'no-store' },
  );
  const json = (await res.json().catch(() => null)) as
    | { rows?: LeaderboardRow[]; error?: string }
    | null;
  if (!res.ok) throw new Error(json?.error ?? 'Failed to load leaderboard');
  return json?.rows ?? [];
};

// ─── Feed (announcements + discussion) ────────────────────────────────────────

export const fetchFeed = async (classroomId: string): Promise<FeedPost[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'classrooms', classroomId, 'feed'),
      orderBy('createdAt', 'desc'),
    ),
  );
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      body: String(data.body ?? ''),
      authorId: String(data.authorId ?? ''),
      authorName: String(data.authorName ?? 'Anonymous'),
      type: (data.type as FeedPostType) ?? 'post',
      createdAt: toDate(data.createdAt) ?? new Date(),
    };
  });
};

export const postFeed = async (
  classroomId: string,
  data: { body: string; authorId: string; authorName: string; type: FeedPostType },
) => {
  await addDoc(collection(db, 'classrooms', classroomId, 'feed'), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

// ─── Roster ───────────────────────────────────────────────────────────────────

export const leaveClassroom = async (classroomId: string, uid: string) => {
  await updateDoc(doc(db, 'classrooms', classroomId), {
    students: arrayRemove(uid),
  });
  await deleteDoc(doc(db, 'users', uid, 'enrolledClassrooms', classroomId));
};

export const removeStudent = async (classroomId: string, uid: string) => {
  await updateDoc(doc(db, 'classrooms', classroomId), {
    students: arrayRemove(uid),
  });
};

export const regenerateJoinCode = async (classroomId: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await updateDoc(doc(db, 'classrooms', classroomId), { joinCode: code });
  return code;
};

const mapUserRole = (raw: unknown): 'student' | 'teacher' | 'admin' =>
  raw === 'teacher' || raw === 'admin' ? raw : 'student';

export const fetchStudentProfiles = async (
  uids: string[],
): Promise<Record<string, StudentProfileSummary>> => {
  const entries = await Promise.all(
    uids.map(async uid => {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        const data = snap.data() ?? {};
        return [
          uid,
          {
            uid,
            displayName: String(data.displayName ?? 'PixelCoder'),
            photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
            totalXP: Number(data.totalXP ?? 0),
            level: Number(data.level ?? 1),
            role: mapUserRole(data.role),
          },
        ] as const;
      } catch {
        return [
          uid,
          { uid, displayName: 'PixelCoder', photoURL: null, totalXP: 0, level: 1, role: 'student' as const },
        ] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
};
