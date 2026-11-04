// ─── Course Progress Service ──────────────────────────────────────────────────
// Reads stay client-side (Firestore rules allow owner reads only).
// ALL writes go through /api/xp/award, which is server-authoritative:
// XP, level, streak, courseProgress and xpEvents are committed by the
// server in a single transaction. Clients never write XP fields directly.

import {
  doc, getDoc,
  collection, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { requestXpAward, type XpAwardResponse } from './xpClient';

export interface LessonProgress {
  lessonId:    string;
  completed:   boolean;
  completedAt: Date | null;
}

export interface QuizResult {
  lessonId:   string;
  quizKey:    string;
  correct:    boolean;
  answeredAt: Date;
}

export interface CourseProgressData {
  courseId:         string;
  completedLessons: string[];
  quizResults:      Record<string, boolean>; // quizKey -> correct
  lastAccessed:     Date;
  percentComplete:  number;
  startedAt:        Date;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export const getCourseProgress = async (
  uid:      string,
  courseId: string,
): Promise<CourseProgressData | null> => {
  const ref  = doc(db, 'users', uid, 'courseProgress', courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...d,
    lastAccessed: d.lastAccessed?.toDate?.() ?? new Date(),
    startedAt:    d.startedAt?.toDate?.()    ?? new Date(),
  } as CourseProgressData;
};

export const getAllCourseProgress = async (
  uid: string,
): Promise<CourseProgressData[]> => {
  const ref  = collection(db, 'users', uid, 'courseProgress');
  const snap = await getDocs(ref);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      lastAccessed: data.lastAccessed?.toDate?.() ?? new Date(),
      startedAt:    data.startedAt?.toDate?.()    ?? new Date(),
    } as CourseProgressData;
  });
};

// ─── Write (via /api/xp/award) ───────────────────────────────────────────────

/** Call when a user opens a course for the first time */
export const startCourse = async (_uid: string, courseId: string): Promise<void> => {
  await requestXpAward('start-course', { courseId });
};

/** Mark a lesson as complete. XP is awarded only on first completion. */
export const completeLesson = async (
  _uid:         string,
  courseId:     string,
  lessonId:     string,
  totalLessons: number,
  lessonXp:     number = 10,
): Promise<XpAwardResponse | null> =>
  requestXpAward('lesson-complete', { courseId, lessonId, totalLessons, lessonXp });

/** Record a quiz answer. XP is awarded only for first-time correct answers. */
export const recordQuizResult = async (
  _uid:      string,
  courseId:  string,
  quizKey:   string,
  correct:   boolean,
  quizXp:    number = 5,
): Promise<XpAwardResponse | null> =>
  requestXpAward('quiz-correct', { courseId, quizKey, correct, quizXp });
