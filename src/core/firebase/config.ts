import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Prevent duplicate app initialization (useful with HMR)
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// During SSG / static prerendering (server), service instances are never
// created — nothing calls them there, and creating them at module scope made
// `next build` crash when the API key was missing/invalid on the host.
// On the client we export the REAL instances so Firestore/auth pass their
// internal instanceof checks. If server code ever touches them, it fails
// loudly with a clear message instead of a cryptic FirebaseError.
const serverOnly = <T extends object>(name: string): T =>
  new Proxy({} as T, {
    get: () => {
      throw new Error(
        `[firebase] ${name} was accessed during server-side prerendering. ` +
          'Firebase service instances are only available in the browser.',
      );
    },
  });

const isClient = typeof window !== 'undefined';

export const auth: Auth = isClient ? getAuth(app) : serverOnly<Auth>('auth');
export const db: Firestore = isClient ? getFirestore(app) : serverOnly<Firestore>('db');

// Analytics only in browser environments that support it
if (isClient) {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  }).catch(() => {
    /* analytics optional */
  });
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
export const githubProvider = new GithubAuthProvider();
// `repo` scope lets the app import the user's private repositories later.
githubProvider.addScope("repo");
githubProvider.setCustomParameters({ allow_signup: "true" });

export default app;
