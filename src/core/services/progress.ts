// ─── Course Progress Service (Firestore) ──────────────────────────────────────
// All user progress data lives in Firestore.
// Content (lessons, quizzes) lives in Sanity.

import {
  doc, getDoc, setDoc, updateDoc,
  collection, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

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

// ─── Write ────────────────────────────────────────────────────────────────────

/** Call when a user opens a course for the first time */
export const startCourse = async (uid: string, courseId: string): Promise<void> => {
  const ref  = doc(db, 'users', uid, 'courseProgress', courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      courseId,
      completedLessons: [],
      quizResults:      {},
      lastAccessed:     serverTimestamp(),
      startedAt:        serverTimestamp(),
      percentComplete:  0,
    });
  } else {
    await updateDoc(ref, { lastAccessed: serverTimestamp() });
  }
};

/** Mark a lesson as complete and recalculate progress */
export const completeLesson = async (
  uid:          string,
  courseId:     string,
  lessonId:     string,
  totalLessons: number,
  lessonXp:     number = 10,
): Promise<void> => {
  const ref  = doc(db, 'users', uid, 'courseProgress', courseId);
  const snap = await getDoc(ref);

  let completed: string[]                = [];
  let quizResults: Record<string, boolean> = {};

  if (snap.exists()) {
    completed   = snap.data().completedLessons ?? [];
    quizResults = snap.data().quizResults      ?? {};
  }

  if (!completed.includes(lessonId)) {
    completed = [...completed, lessonId];
  }

  const percent = Math.round((completed.length / totalLessons) * 100);

  await setDoc(ref, {
    courseId,
    completedLessons: completed,
    quizResults,
    lastAccessed: serverTimestamp(),
    startedAt:    snap.exists() ? snap.data().startedAt : serverTimestamp(),
    percentComplete: percent,
  });

  // Award XP to user
  const userRef  = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const current  = userSnap.data().totalXP ?? 0;
    const newXP    = current + lessonXp;
    const newLevel = Math.floor(newXP / 1000) + 1;
    await updateDoc(userRef, { totalXP: newXP, level: newLevel });
  }
};

/** Record a quiz answer */
export const recordQuizResult = async (
  uid:      string,
  courseId: string,
  quizKey:  string,
  correct:  boolean,
  quizXp:   number = 5,
): Promise<void> => {
  const ref  = doc(db, 'users', uid, 'courseProgress', courseId);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data().quizResults ?? {} : {};

  await setDoc(ref, {
    quizResults:  { ...existing, [quizKey]: correct },
    lastAccessed: serverTimestamp(),
  }, { merge: true });

  // Award XP for correct answers
  if (correct) {
    const userRef  = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const current  = userSnap.data().totalXP ?? 0;
      const newXP    = current + quizXp;
      const newLevel = Math.floor(newXP / 1000) + 1;
      await updateDoc(userRef, { totalXP: newXP, level: newLevel });
    }
  }
};
