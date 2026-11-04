import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Service instances are created LAZILY on first access (via Proxy), not at
// module scope: during static prerendering (SSG) no env validation happens,
// so a missing/invalid NEXT_PUBLIC_FIREBASE_API_KEY can't crash the build.
// On the client the first real usage initializes everything as usual.
let _auth: ReturnType<typeof getAuth> | null = null;
const getFirebaseAuth = () => (_auth ??= getAuth(app));

let _db: ReturnType<typeof getFirestore> | null = null;
const getFirebaseDb = () => (_db ??= getFirestore(app));

export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get: (_t, prop) => Reflect.get(getFirebaseAuth() as object, prop),
  set: (_t, prop, value) => (Reflect.set(getFirebaseAuth() as object, prop, value), true),
  has: (_t, prop) => Reflect.has(getFirebaseAuth() as object, prop),
});

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get: (_t, prop) => Reflect.get(getFirebaseDb() as object, prop),
  set: (_t, prop, value) => (Reflect.set(getFirebaseDb() as object, prop, value), true),
  has: (_t, prop) => Reflect.has(getFirebaseDb() as object, prop),
});

// Analytics only in browser environments that support it
if (typeof window !== 'undefined') {
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
