// ─── Server-side request authentication ───────────────────────────────────────
// Reads the Firebase ID token from `Authorization: Bearer <token>` and verifies
// it with the Admin SDK. Returns the user's uid, or null when unauthenticated.

import type { NextRequest } from 'next/server';
import { adminAuth } from './firebaseAdmin';

/** Verifies a raw Firebase ID token and returns its uid, or null if invalid. */
export const userIdFromIdToken = async (
  idToken: string | null | undefined,
): Promise<string | null> => {
  if (!idToken) return null;
  try {
    const { uid } = await adminAuth().verifyIdToken(idToken);
    return uid;
  } catch {
    return null;
  }
};

/** Reads `Authorization: Bearer <Firebase ID token>` from a route request. */
export const userIdFromRequest = async (req: NextRequest): Promise<string | null> => {
  const authz = req.headers.get('authorization') ?? '';
  return userIdFromIdToken(authz.startsWith('Bearer ') ? authz.slice(7) : null);
};
