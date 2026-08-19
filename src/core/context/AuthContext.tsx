'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  type AuthProvider as FirebaseAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type AuthError,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../firebase";
import type { UserProfile, UserRole } from "../types";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithGithub: () => Promise<boolean>;
  logOut: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getFriendlyError = (error: AuthError): string => {
  switch (error.code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/popup-closed-by-user":
      return "The sign-in popup was closed before completion.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Please sign in using your original method.";
    case "auth/operation-not-allowed":
      return "GitHub sign-in is not enabled in the Firebase console.";
    default:
      return "Something went wrong. Please try again.";
  }
};

/**
 * signInWithPopup reads `popup.closed` to detect cancellation, which
 * Cross-Origin-Opener-Policy: same-origin (set on /app/ide for the Nodepod SW)
 * blocks. When the document is cross-origin isolated we fall back to the
 * redirect flow, which performs a full navigation instead of opening a popup.
 */
const isCrossOriginIsolatedDoc = (): boolean =>
  typeof window !== "undefined" &&
  (window as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated ===
    true;

const oauthSignIn = async (provider: FirebaseAuthProvider) => {
  if (isCrossOriginIsolatedDoc()) {
    await signInWithRedirect(auth, provider);
    return null; // result is finalized by getRedirectResult on the return navigation
  }
  return signInWithPopup(auth, provider);
};

/** Creates or updates the user document in Firestore on first login */
const ensureUserDocument = async (user: User, role: UserRole = "student") => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "PixelCoder",
      photoURL: user.photoURL ?? null,
      role,
      totalXP: 0,
      level: 1,
      streak: 0,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      preferences: {
        theme: "system",
        language: "python",
        emailNotifs: true,
      },
    });
  } else {
    // Update last active
    await setDoc(ref, { lastActive: serverTimestamp() }, { merge: true });
  }
};

const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    lastActive: data.lastActive?.toDate?.() ?? new Date(),
  } as UserProfile;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => setError(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Ensures the Firestore user doc exists for redirect-based sign-ins
        // (popup/email paths create it themselves in their handlers).
        await ensureUserDocument(firebaseUser);
        const prof = await fetchProfile(firebaseUser.uid);
        setProfile(prof);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Consume an OAuth redirect result (used when cross-origin isolated) and
  // surface any errors from the redirect flow.
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await ensureUserDocument(result.user);
          const prof = await fetchProfile(result.user.uid);
          setProfile(prof);
        }
      })
      .catch((e) => showError(getFriendlyError(e as AuthError)));
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await ensureUserDocument(cred.user);
      const prof = await fetchProfile(cred.user.uid);
      setProfile(prof);
    } catch (e) {
      showError(getFriendlyError(e as AuthError));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserDocument(cred.user);
      const prof = await fetchProfile(cred.user.uid);
      setProfile(prof);
    } catch (e) {
      showError(getFriendlyError(e as AuthError));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await oauthSignIn(googleProvider);
      if (!cred) return false; // redirect flow: browser navigated to provider
      await ensureUserDocument(cred.user);
      const prof = await fetchProfile(cred.user.uid);
      setProfile(prof);
      return true;
    } catch (e) {
      showError(getFriendlyError(e as AuthError));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    try {
      const cred = await oauthSignIn(githubProvider);
      if (!cred) return false; // redirect flow: browser navigated to provider
      await ensureUserDocument(cred.user);
      const prof = await fetchProfile(cred.user.uid);
      setProfile(prof);
      return true;
    } catch (e) {
      showError(getFriendlyError(e as AuthError));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        clearError,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
