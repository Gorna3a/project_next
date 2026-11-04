// ─── Firebase Admin SDK bootstrap (server only) ───────────────────────────────
// Lazily initializes a single Admin app from FIREBASE_SERVICE_ACCOUNT_B64
// (base64 of the service-account JSON — see .env.example). Never import from
// client components; the private key must never reach the browser bundle.

import {
  getApps,
  initializeApp,
  cert,
  type App,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | null = null;

export const getAdminApp = (): App => {
  if (app) return app;
  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0];
    return app;
  }
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_B64 is not set. ' +
        'Base64-encode the service-account JSON and add it to .env.local (or Vercel env vars).',
    );
  }
  const json = Buffer.from(b64, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(json);
  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  return app;
};

export const adminDb = (): Firestore => getFirestore(getAdminApp());

export const adminAuth = (): Auth => getAuth(getAdminApp());
