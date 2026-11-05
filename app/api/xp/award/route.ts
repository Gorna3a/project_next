// ─── POST /api/xp/award ───────────────────────────────────────────────────────
// Server-authoritative XP awards. Clients can only *request* an award; this
// route verifies the Firebase ID token, checks the award is earned and not
// already granted, and commits XP / level / streak atomically in one
// transaction. Firestore rules no longer let clients write XP fields at all.

import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, adminAuth } from '../../../../src/server/firebaseAdmin';
import {
  clampInt,
  levelForXp,
  nextStreak,
  sanitizeClientDate,
  utcDayKey,
} from '../../../../src/server/xp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const serverTs = FieldValue.serverTimestamp;

const XP_TABLE = {
  courseCompletionBonus: 100,
  duelLoss: 10,
} as const;

class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface AwardResult {
  awarded: number;
  totalXP: number;
  level: number;
  streak: number;
  reason: string | null;
}

export async function POST(req: NextRequest) {
  // ── Auth: the caller must be a signed-in Firebase user ──────────────────
  const authz = req.headers.get('authorization') ?? '';
  const idToken = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!idToken) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
  }
  let uid: string;
  try {
    ({ uid } = await adminAuth().verifyIdToken(idToken));
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.action !== 'string') {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 });
  }

  const action = body.action;
  const todayKey = sanitizeClientDate(body.clientDate) ?? utcDayKey();

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[xp/award] admin init failed:', msg);
    return NextResponse.json(
      { error: 'XP service unavailable: server credentials missing/invalid', detail: msg },
      { status: 503 },
    );
  }

  try {
    const result = await db.runTransaction<AwardResult>(async (tx) => {
      const eventRef = (id: string) => db.collection('xpEvents').doc(id);
      const userRef = db.collection('users').doc(uid);
      const rawUser = await tx.get(userRef);
      const userData = (rawUser.exists ? rawUser.data() : {}) ?? {};
      const totalXP = clampInt(userData.totalXP, 0, Number.MAX_SAFE_INTEGER, 0);
      const streak = clampInt(userData.streak, 0, Number.MAX_SAFE_INTEGER, 0);
      const level = clampInt(userData.level, 1, Number.MAX_SAFE_INTEGER, 1);
      const lastStreakDate =
        typeof userData.lastStreakDate === 'string' ? userData.lastStreakDate : null;

      const finishWithAward = (award: number, reason: string | null): AwardResult => {
        if (award > 0) {
          const newXP = totalXP + award;
          const newLevel = levelForXp(newXP);
          const newStreak = nextStreak(streak, lastStreakDate, todayKey);
          tx.set(
            userRef,
            {
              totalXP: newXP,
              level: newLevel,
              streak: newStreak,
              lastStreakDate: todayKey,
              lastActive: serverTs(),
            },
            { merge: true },
          );
          return { awarded: award, totalXP: newXP, level: newLevel, streak: newStreak, reason };
        }
        return { awarded: 0, totalXP, level, streak, reason };
      };

      const none = (reason: string): AwardResult =>
        ({ awarded: 0, totalXP, level, streak, reason });

      // ── Action: start-course ─────────────────────────────────────────────
      if (action === 'start-course') {
        const courseId = String(body.courseId ?? '');
        if (!courseId) throw new HttpError(400, 'courseId is required');
        const cpRef = db
          .collection('users')
          .doc(uid)
          .collection('courseProgress')
          .doc(courseId);
        const cpSnap = await tx.get(cpRef);
        if (!cpSnap.exists) {
          tx.set(cpRef, {
            courseId,
            completedLessons: [],
            quizResults: {},
            percentComplete: 0,
            lastAccessed: serverTs(),
            startedAt: serverTs(),
          });
        } else {
          tx.set(cpRef, { lastAccessed: serverTs() }, { merge: true });
        }
        return none('start-course');
      }

      // ── Action: lesson-complete ──────────────────────────────────────────
      if (action === 'lesson-complete') {
        const courseId = String(body.courseId ?? '');
        const lessonId = String(body.lessonId ?? '');
        const totalLessons = clampInt(body.totalLessons, 1, 100000, 1);
        const lessonXp = clampInt(body.lessonXp, 1, 100, 10);
        if (!courseId || !lessonId) {
          throw new HttpError(400, 'courseId and lessonId are required');
        }
        const evId = `${uid}_lesson_${courseId}_${lessonId}`;
        const evSnap = await tx.get(eventRef(evId));
        if (evSnap.exists) return none('already-awarded');

        const cpRef = db
          .collection('users')
          .doc(uid)
          .collection('courseProgress')
          .doc(courseId);
        const cpSnap = await tx.get(cpRef);
        const cp = (cpSnap.exists ? cpSnap.data() : {}) ?? {};
        const completed: string[] = Array.isArray(cp.completedLessons)
          ? cp.completedLessons
          : [];
        if (completed.includes(lessonId)) return none('already-completed');

        const nextCompleted = [...completed, lessonId];
        const percent = Math.min(
          100,
          Math.round((nextCompleted.length / totalLessons) * 100),
        );
        const wasComplete = clampInt(cp.percentComplete, 0, 100, 0) >= 100;
        const bonus = percent >= 100 && !wasComplete
          ? XP_TABLE.courseCompletionBonus
          : 0;
        const award = lessonXp + bonus;
        const reason = bonus > 0 ? 'lesson-complete+course-bonus' : 'lesson-complete';
        tx.set(
          cpRef,
          {
            courseId,
            completedLessons: nextCompleted,
            percentComplete: percent,
            lastAccessed: serverTs(),
            startedAt: cp.startedAt ?? serverTs(),
            quizResults: cp.quizResults ?? {},
          },
          { merge: true },
        );
        tx.set(
          eventRef(evId),
          { uid, action, amount: award, courseId, lessonId, awardedAt: serverTs(), reason },
          { merge: true },
        );
        return finishWithAward(award, reason);
      }

      // ── Action: quiz-correct ─────────────────────────────────────────────
      if (action === 'quiz-correct') {
        const courseId = String(body.courseId ?? '');
        const quizKey = String(body.quizKey ?? '');
        const quizXp = clampInt(body.quizXp, 1, 50, 1);
        const correct = body.correct === true;
        if (!courseId || !quizKey) {
          throw new HttpError(400, 'courseId and quizKey are required');
        }
        if (!correct) return none('not-correct');
        const evId = `${uid}_quiz_${courseId}_${quizKey}`;
        const evSnap = await tx.get(eventRef(evId));
        if (evSnap.exists) return none('already-awarded');

        const cpRef = db
          .collection('users')
          .doc(uid)
          .collection('courseProgress')
          .doc(courseId);
        const cpSnap = await tx.get(cpRef);
        const cp = (cpSnap.exists ? cpSnap.data() : {}) ?? {};
        const quizResults: Record<string, boolean> =
          cp.quizResults && typeof cp.quizResults === 'object'
            ? { ...cp.quizResults }
            : {};
        if (quizResults[quizKey] === true) return none('already-correct');
        quizResults[quizKey] = true;
        const award = quizXp;
        tx.set(
          cpRef,
          { courseId, quizResults, lastAccessed: serverTs() },
          { merge: true },
        );
        tx.set(
          eventRef(evId),
          { uid, action, amount: award, courseId, quizKey, awardedAt: serverTs() },
          { merge: true },
        );
        return finishWithAward(award, 'quiz-correct');
      }

      // ── Action: challenge-complete ───────────────────────────────────────
      if (action === 'challenge-complete') {
        const challengeId = String(body.challengeId ?? '');
        if (!challengeId) throw new HttpError(400, 'challengeId is required');
        const evId = `${uid}_challenge_${challengeId}`;
        const evSnap = await tx.get(eventRef(evId));
        if (evSnap.exists) return none('already-awarded');

        const challengeRef = db.collection('challenges').doc(challengeId);
        const challengeSnap = await tx.get(challengeRef);
        if (!challengeSnap.exists) throw new HttpError(404, 'Challenge not found');
        const challengeXp = clampInt(challengeSnap.data()?.xp, 0, 10000, 25);
        const xpOverride =
          body.xpOverride !== undefined
            ? clampInt(body.xpOverride, 0, 10000, challengeXp)
            : null;
        const award = xpOverride ?? challengeXp;
        tx.set(
          db.collection('users').doc(uid).collection('completedChallenges').doc(challengeId),
          {
            challengeId,
            xp: Math.max(0, award),
            revealed: xpOverride === 0,
            completedAt: serverTs(),
          },
          { merge: true },
        );
        if (award <= 0) {
          return none('revealed');
        }
        tx.set(
          eventRef(evId),
          { uid, action, amount: award, challengeId, awardedAt: serverTs(), reason: 'challenge-complete' },
          { merge: true },
        );
        return finishWithAward(award, 'challenge-complete');
      }

      // ── Action: duel-finish ──────────────────────────────────────────────
      if (action === 'duel-finish') {
        const roomId = String(body.roomId ?? '');
        if (!roomId) throw new HttpError(400, 'roomId is required');
        const roomRef = db.collection('duel_rooms').doc(roomId);
        const roomSnap = await tx.get(roomRef);
        if (!roomSnap.exists) throw new HttpError(404, 'Duel room not found');
        const room = roomSnap.data() ?? {};
        const isCreator = room.creatorId === uid;
        const isOpponent = room.opponentId === uid;
        if (!isCreator && !isOpponent) {
          throw new HttpError(403, 'Not a participant of this duel');
        }
        const leaderboardRef = db.collection('competitive_leaderboard').doc(uid);
        const bumpLeaderboard = (isWin: boolean) =>
          tx.set(
            leaderboardRef,
            {
              uid,
              wins: FieldValue.increment(isWin ? 1 : 0),
              matchesPlayed: FieldValue.increment(1),
              rating: FieldValue.increment(isWin ? 25 : -10),
            },
            { merge: true },
          );

        if (!room.winnerId) {
          // First caller to finish wins the duel. The transaction makes this
          // atomic, so concurrent calls can never both take the win branch.
          tx.update(roomRef, { winnerId: uid, status: 'finished' });
          const challengeSnap = await tx.get(
            db.collection('challenges').doc(String(room.challengeId ?? '')),
          );
          const challengeXp = clampInt(challengeSnap.data()?.xp, 10, 10000, 50);
          const evId = `${uid}_duel_win_${roomId}`;
          tx.set(
            eventRef(evId),
            { uid, action, amount: challengeXp, roomId, awardedAt: serverTs(), reason: 'duel-win' },
            { merge: true },
          );
          bumpLeaderboard(true);
          return finishWithAward(challengeXp, 'duel-win');
        }

        if (room.winnerId === uid) return none('already-won');

        // The second participant to finish loses.
        const evId = `${uid}_duel_loss_${roomId}`;
        const evSnap = await tx.get(eventRef(evId));
        if (evSnap.exists) return none('already-awarded');
        tx.set(
          eventRef(evId),
          { uid, action, amount: XP_TABLE.duelLoss, roomId, awardedAt: serverTs(), reason: 'duel-loss' },
          { merge: true },
        );
        bumpLeaderboard(false);
        return finishWithAward(XP_TABLE.duelLoss, 'duel-loss');
      }

      throw new HttpError(400, `Unknown action: ${action}`);
    });

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    const detail = e instanceof Error ? e.message : String(e);
    console.error('[xp/award] unexpected error:', detail);
    return NextResponse.json({ error: 'Internal error', detail }, { status: 500 });
  }
}
