// ─── /api/classroom/file ──────────────────────────────────────────────────────
// Assignment attachments backed by a private Vercel Blob store.
//
// Upload flow:
//   1. Browser asks /api/classroom/file/upload for a scoped client token.
//   2. Browser uploads directly to Vercel Blob (no 4.5 MB function limit).
//   3. Browser POSTs the resulting pathname here; this route verifies
//      ownership/membership with the Admin SDK and stores metadata in
//      `classroomFiles` (the file bytes never enter Firestore).
//
// Download: GET ?fileId=... streams the private blob after checking that the
// caller is the uploader or the classroom teacher. Legacy base64 attachments
// from the earlier Firestore-backed implementation are still served.

import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { get, head } from '@vercel/blob';
import { adminDb } from '../../../../src/server/firebaseAdmin';
import { userIdFromRequest } from '../../../../src/server/apiAuth';
import {
  assertStudentUploadTarget,
  blobStorageConfigured,
  isSafeUploadPath,
  safeFileName,
  uploadPathPrefix,
  uploadTargetStatus,
} from '../../../../src/server/classroomUpload';
import {
  CLASSROOM_MAX_FILE_BYTES,
  CLASSROOM_MAX_FILE_MB,
} from '../../../../src/platform/pages/Classroom/classroomTypes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const contentDisposition = (fileName: string): string =>
  `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;

export async function POST(req: NextRequest) {
  const uid = await userIdFromRequest(req);
  if (!uid) return error('Missing or invalid authorization token', 401);

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (e) {
    console.error('[classroom/file] admin init failed:', e);
    return error('File service unavailable', 503);
  }

  try {
    const payload = (await req.json().catch(() => null)) as
      | {
          classroomId?: unknown;
          assignmentId?: unknown;
          pathname?: unknown;
          fileName?: unknown;
        }
      | null;
    if (!payload) return error('Invalid request body', 400);

    const classroomId =
      typeof payload.classroomId === 'string' ? payload.classroomId : '';
    const assignmentId =
      typeof payload.assignmentId === 'string' ? payload.assignmentId : '';
    const pathname = typeof payload.pathname === 'string' ? payload.pathname : '';
    if (!classroomId || !assignmentId || !pathname) {
      return error('classroomId, assignmentId and pathname are required', 400);
    }

    if (!blobStorageConfigured()) {
      return error(
        'File storage is not configured: add BLOB_READ_WRITE_TOKEN (private Vercel Blob store).',
        503,
      );
    }

    try {
      await assertStudentUploadTarget(db, uid, classroomId, assignmentId);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Not allowed to upload this file';
      return error(message, uploadTargetStatus(message));
    }

    const prefix = uploadPathPrefix(classroomId, assignmentId, uid);
    if (!isSafeUploadPath(pathname, prefix)) {
      return error('Invalid upload path', 400);
    }

    // Idempotent registration: retries reuse the existing metadata document.
    const duplicate = await db
      .collection('classroomFiles')
      .where('pathname', '==', pathname)
      .limit(1)
      .get();
    const existing = duplicate.docs[0];
    if (existing) {
      const data = existing.data();
      if (
        data.uid === uid &&
        data.classroomId === classroomId &&
        data.assignmentId === assignmentId
      ) {
        return NextResponse.json({
          fileId: existing.id,
          fileName: String(data.fileName ?? safeFileName(payload.fileName)),
          contentType: String(data.contentType ?? 'application/octet-stream'),
          size: Number(data.size ?? 0) || 0,
        });
      }
    }

    let meta: Awaited<ReturnType<typeof head>>;
    try {
      meta = await head(pathname);
    } catch {
      return error('Uploaded file not found', 404);
    }
    if (!meta || !Number.isFinite(meta.size) || meta.size <= 0) {
      return error('Uploaded file not found', 404);
    }
    if (meta.size > CLASSROOM_MAX_FILE_BYTES) {
      return error(`File is too large (max ${CLASSROOM_MAX_FILE_MB} MB)`, 413);
    }

    const fileName = safeFileName(payload.fileName);
    const contentType = meta.contentType || 'application/octet-stream';
    const ref = await db.collection('classroomFiles').add({
      classroomId,
      assignmentId,
      uid,
      fileName,
      contentType,
      size: meta.size,
      pathname,
      url: meta.url,
      etag: meta.etag,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      fileId: ref.id,
      fileName,
      contentType,
      size: meta.size,
    });
  } catch (e) {
    console.error('[classroom/file] registration failed:', e);
    return error('Could not register the uploaded file', 500);
  }
}

export async function GET(req: NextRequest) {
  const uid = await userIdFromRequest(req);
  if (!uid) return error('Missing or invalid authorization token', 401);

  let db: ReturnType<typeof adminDb>;
  try {
    db = adminDb();
  } catch (e) {
    console.error('[classroom/file] admin init failed:', e);
    return error('File service unavailable', 503);
  }

  try {
    const fileId = req.nextUrl.searchParams.get('fileId') ?? '';
    if (!fileId) return error('fileId is required', 400);

    const snap = await db.collection('classroomFiles').doc(fileId).get();
    if (!snap.exists) return error('File not found', 404);
    const data = snap.data() ?? {};

    const roomSnap = await db
      .collection('classrooms')
      .doc(String(data.classroomId ?? ''))
      .get();
    if (!roomSnap.exists) return error('Classroom not found', 404);

    const room = roomSnap.data() ?? {};
    const isTeacher = room.teacherId === uid;
    const isOwner = data.uid === uid;
    if (!isTeacher && !isOwner) return error('Not allowed to read this file', 403);

    const fileName = safeFileName(data.fileName);
    const disposition = contentDisposition(fileName);

    // ── New attachments: private Vercel Blob object ──────────────────────
    const pathname = typeof data.pathname === 'string' ? data.pathname : '';
    if (pathname) {
      if (!blobStorageConfigured()) {
        return error('File storage is not configured', 503);
      }

      const result = await get(pathname, {
        access: 'private',
        ifNoneMatch: req.headers.get('if-none-match') ?? undefined,
      });
      if (!result) return error('File not found', 404);

      if (result.statusCode === 304) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            ETag: result.blob.etag,
            'Cache-Control': 'private, no-cache',
          },
        });
      }
      if (!result.stream) return error('File not found', 404);

      const headers: Record<string, string> = {
        'Content-Type': result.blob.contentType ?? String(data.contentType ?? 'application/octet-stream'),
        'Content-Disposition': disposition,
        'Cache-Control': 'private, no-cache',
        'X-Content-Type-Options': 'nosniff',
        ETag: result.blob.etag,
      };
      if (typeof result.blob.size === 'number') {
        headers['Content-Length'] = String(result.blob.size);
      }

      return new NextResponse(result.stream, { status: 200, headers });
    }

    // ── Legacy attachments: base64 stored in Firestore ───────────────────
    if (typeof data.data === 'string' && data.data) {
      const bytes = Buffer.from(data.data, 'base64');
      return new NextResponse(new Uint8Array(bytes), {
        status: 200,
        headers: {
          'Content-Type': String(data.contentType ?? 'application/octet-stream'),
          'Content-Length': String(bytes.length),
          'Content-Disposition': disposition,
          'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    return error('File not found', 404);
  } catch (e) {
    console.error('[classroom/file] download failed:', e);
    return error('Download failed', 500);
  }
}
