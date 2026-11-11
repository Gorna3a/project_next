// ─── /api/classroom/file/upload ───────────────────────────────────────────────
// Issues Vercel Blob client-upload tokens. The browser uploads the file
// directly to a **private** Blob store, bypassing Vercel's 4.5 MB function
// request-body limit. After the upload the client registers the blob at
// POST /api/classroom/file, which stores only metadata in Firestore.
//
// Auth: Firebase ID token in the Authorization header. Membership and the
// assignment type are re-checked in `onBeforeGenerateToken` before a token is
// issued, and the upload path is locked to the caller's uid.
//
// Requires BLOB_READ_WRITE_TOKEN (create a private Blob store in Vercel and
// add the read-write token to the project/environment). OIDC alone is not
// enough for `handleUpload` client tokens.

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../src/server/firebaseAdmin';
import { userIdFromRequest } from '../../../../../src/server/apiAuth';
import {
  assertStudentUploadTarget,
  isSafeUploadPath,
  uploadPathPrefix,
  uploadTargetStatus,
} from '../../../../../src/server/classroomUpload';
import { CLASSROOM_MAX_FILE_BYTES } from '../../../../../src/platform/pages/Classroom/classroomTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: NextRequest) {
  const uid = await userIdFromRequest(req);
  if (!uid) return error('Missing or invalid authorization token', 401);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return error(
      'File storage is not configured: add BLOB_READ_WRITE_TOKEN (create a private Vercel Blob store and connect it to this project).',
      503,
    );
  }

  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return error('Invalid request body', 400);

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payload: { classroomId?: unknown; assignmentId?: unknown } = {};
        try {
          payload = JSON.parse(clientPayload ?? '{}') as typeof payload;
        } catch {
          // Fall through to the required-field error below.
        }

        const classroomId =
          typeof payload.classroomId === 'string' ? payload.classroomId : '';
        const assignmentId =
          typeof payload.assignmentId === 'string' ? payload.assignmentId : '';
        if (!classroomId || !assignmentId) {
          throw new Error('classroomId and assignmentId are required');
        }

        const db = adminDb();
        await assertStudentUploadTarget(db, uid, classroomId, assignmentId);

        const prefix = uploadPathPrefix(classroomId, assignmentId, uid);
        if (!isSafeUploadPath(pathname, prefix)) {
          throw new Error('Invalid upload path');
        }

        return {
          maximumSizeInBytes: CLASSROOM_MAX_FILE_BYTES,
          addRandomSuffix: true,
          // Kept for observability if a completion webhook is added later.
          tokenPayload: JSON.stringify({ uid, classroomId, assignmentId }),
        };
      },
      // No onUploadCompleted: registration is explicit, which also works in
      // local development where Vercel cannot call back to localhost.
    });

    return NextResponse.json(jsonResponse);
  } catch (e) {
    console.error('[classroom/file/upload] failed:', e);
    const message = e instanceof Error ? e.message : 'Upload authorization failed';
    return error(message, uploadTargetStatus(message));
  }
}
