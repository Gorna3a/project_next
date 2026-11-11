// ─── Classroom upload helpers (server-only) ──────────────────────────────────
// Shared validation for Vercel Blob attachments. Paths are scoped to a single
// student + assignment so a token can never be used to write another user's
// files or a different classroom's folder.

import type { Firestore } from 'firebase-admin/firestore';

/** True when either a read-write token or Vercel OIDC credentials exist. */
export const blobStorageConfigured = (): boolean =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN) ||
  Boolean(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN);

/** Safe display filename (pathname safety is handled separately). */
export const safeFileName = (name: unknown): string =>
  String(name ?? 'attachment')
    .replace(/["\\\r\n]/g, '_')
    .slice(0, 180) || 'attachment';

export const uploadPathPrefix = (
  classroomId: string,
  assignmentId: string,
  uid: string,
): string => `classrooms/${classroomId}/assignments/${assignmentId}/${uid}/`;

/** The pathname must be exactly one file directly under the expected prefix. */
export const isSafeUploadPath = (pathname: string, prefix: string): boolean => {
  if (!pathname.startsWith(prefix)) return false;
  const rest = pathname.slice(prefix.length);
  return Boolean(rest) && !rest.includes('/') && !rest.includes('\\') && !rest.includes('..');
};

/**
 * Throws a user-facing error unless `uid` is a student in the classroom and the
 * assignment exists and accepts file uploads.
 */
export const assertStudentUploadTarget = async (
  db: Firestore,
  uid: string,
  classroomId: string,
  assignmentId: string,
): Promise<void> => {
  const roomRef = db.collection('classrooms').doc(classroomId);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists) throw new Error('Classroom not found');

  const room = roomSnap.data() ?? {};
  const students: string[] = Array.isArray(room.students) ? room.students : [];
  if (room.teacherId === uid || !students.includes(uid)) {
    throw new Error('Only students in this classroom can upload files');
  }

  const assignmentSnap = await roomRef.collection('assignments').doc(assignmentId).get();
  if (!assignmentSnap.exists) throw new Error('Assignment not found');
  if (assignmentSnap.data()?.type !== 'upload') {
    throw new Error('This assignment does not accept file uploads');
  }
};

/** Maps upload validation errors to an HTTP status. */
export const uploadTargetStatus = (message: string): number => {
  if (/not found/i.test(message)) return 404;
  if (/only students|not allowed/i.test(message)) return 403;
  return 400;
};
