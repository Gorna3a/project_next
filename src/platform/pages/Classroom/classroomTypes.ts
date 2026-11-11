// ─── Classroom shared types ───────────────────────────────────────────────────

import type { UserRole } from '../../../core/types';

/**
 * Maximum attachment size for `upload` assignments. Files go directly from the
 * browser to a private Vercel Blob store, so this is not limited by Vercel's
 * 4.5 MB serverless request-body cap. Keep in sync with the upload-token route.
 */
export const CLASSROOM_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const CLASSROOM_MAX_FILE_MB = 10;

export interface ClassroomData {
  id: string;
  name: string;
  description: string;
  joinCode: string;
  teacherId: string;
  teacherName: string;
  students: string[];
  createdAt: Date;
}

export type AssignmentType = 'task' | 'challenge' | 'upload';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  createdAt: Date;
  type: AssignmentType;
  challengeId: string | null;
  points: number;
  xp: number;
}

export interface Submission {
  uid: string;
  status: 'completed';
  points: number;
  xp: number;
  completedAt: Date | null;
  gradedAt?: Date | null;
  note?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export type FeedPostType = 'announcement' | 'post';

export interface FeedPost {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  type: FeedPostType;
  createdAt: Date;
}

export interface StudentProfileSummary {
  uid: string;
  displayName: string;
  photoURL: string | null;
  totalXP: number;
  level: number;
  /** Account role — shown as a badge in the roster. */
  role: UserRole;
}

export interface LeaderboardRow {
  uid: string;
  displayName: string;
  photoURL: string | null;
  level: number;
  totalXP: number;
  points: number;
  completed: number;
}

export interface UploadedFileMeta {
  fileId: string;
  fileName: string;
  contentType: string;
  size: number;
}
