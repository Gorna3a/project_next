// ─── /api/classroom/leaderboard ───────────────────────────────────────────────
// Firestore rules intentionally prevent students from listing the whole
// submissions collection (that would expose classmates' grades). This route
// aggregates points/completions with the Admin SDK and only returns the
// public leaderboard fields to classroom participants.

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../src/server/firebaseAdmin';
import { userIdFromRequest } from '../../../../src/server/apiAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Row {
  uid: string;
  displayName: string;
  photoURL: string | null;
  level: number;
  totalXP: number;
  points: number;
  completed: number;
}

export async function GET(req: NextRequest) {
  const uid = await userIdFromRequest(req);
  if (!uid) {
    return NextResponse.json({ error: 'Missing or invalid authorization token' }, { status: 401 });
  }

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (e) {
    console.error('[classroom/leaderboard] admin init failed:', e);
    return NextResponse.json({ error: 'Leaderboard service unavailable' }, { status: 503 });
  }

  try {
    const classroomId = req.nextUrl.searchParams.get('classroomId') ?? '';
    if (!classroomId) {
      return NextResponse.json({ error: 'classroomId is required' }, { status: 400 });
    }

    const roomRef = db.collection('classrooms').doc(classroomId);
    const roomSnap = await roomRef.get();
    if (!roomSnap.exists) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 });
    }
    const room = roomSnap.data() ?? {};
    const students: string[] = Array.isArray(room.students) ? room.students : [];
    if (room.teacherId !== uid && !students.includes(uid)) {
      return NextResponse.json({ error: 'Not a member of this classroom' }, { status: 403 });
    }

    const assignments = await roomRef.collection('assignments').get();
    const totals = new Map<string, { points: number; completed: number }>();
    students.forEach(id => totals.set(id, { points: 0, completed: 0 }));

    for (const assignment of assignments.docs) {
      const submissions = await assignment.ref.collection('submissions').get();
      for (const submission of submissions.docs) {
        const data = submission.data();
        const studentId = typeof data.uid === 'string' ? data.uid : submission.id;
        const row = totals.get(studentId);
        if (!row) continue;
        row.points += Number(data.points ?? 0) || 0;
        row.completed += 1;
      }
    }

    const rows: Row[] = await Promise.all(
      students.map(async studentId => {
        const userSnap = await db.collection('users').doc(studentId).get();
        const profile = userSnap.data() ?? {};
        const totalsRow = totals.get(studentId) ?? { points: 0, completed: 0 };
        return {
          uid: studentId,
          displayName: String(profile.displayName ?? 'PixelCoder'),
          photoURL: typeof profile.photoURL === 'string' ? profile.photoURL : null,
          level: Number(profile.level ?? 1) || 1,
          totalXP: Number(profile.totalXP ?? 0) || 0,
          points: totalsRow.points,
          completed: totalsRow.completed,
        };
      }),
    );

    rows.sort(
      (a, b) =>
        b.points - a.points ||
        b.totalXP - a.totalXP ||
        a.displayName.localeCompare(b.displayName),
    );

    return NextResponse.json({ rows });
  } catch (e) {
    console.error('[classroom/leaderboard] failed:', e);
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 });
  }
}
