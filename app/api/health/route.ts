// ─── GET /api/health ──────────────────────────────────────────────────────────
// Temporary self-diagnosing endpoint. It reports the function's Node runtime,
// whether the admin credentials are present, and the exact error (if any) from
// loading firebase-admin / reading Firestore. No secret values are returned.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const describe = (e: unknown): string =>
  e instanceof Error ? `${e.name}: ${e.message}` : String(e);

export async function GET() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64 ?? '';

  const out: Record<string, unknown> = {
    node: process.version,
    platform: `${process.platform}/${process.arch}`,
    env: {
      firebaseServiceAccount: b64.length > 0,
      firebaseServiceAccountLength: b64.length,
    },
  };

  try {
    const firestore = await import('firebase-admin/firestore');
    out.firebaseModule =
      typeof firestore.FieldValue === 'function'
        ? 'ok'
        : `unexpected FieldValue: ${typeof firestore.FieldValue}`;
  } catch (e) {
    out.firebaseModuleError = describe(e);
  }

  try {
    const admin = await import('../../../src/server/firebaseAdmin');
    out.adminModule = typeof admin.adminDb === 'function' ? 'ok' : 'missing adminDb';
    const db = admin.adminDb();
    const snap = await db.collection('users').limit(1).get();
    out.firestoreRead = `ok (${snap.size} doc${snap.size === 1 ? '' : 's'})`;
  } catch (e) {
    out.firestoreError = describe(e);
  }

  return NextResponse.json(out);
}
