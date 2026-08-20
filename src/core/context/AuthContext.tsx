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
  type AuthCredential,
  type OAuthCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  type AuthError,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "../firebase";
import type { UserProfile, UserRole } from "../types";

const GH_TOKEN_KEY = "pixelcode_gh_token";

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
  signInWithGoogle: (password?: string) => Promise<boolean>;
  signInWithGithub: (password?: string) => Promise<boolean>;
  /** GitHub OAuth access token (for repo import). Null when not signed in via GitHub. */
  githubToken: string | null;
  /** Set when an OAuth sign-in collides with an existing password account. */
  linkEmail: string | null;
  linkProvider: "github" | "google" | null;
  clearLink: () => void;
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
      return "An account already exists with this email. Sign in with your original method to link this one.";
    case "auth/operation-not-allowed":
      return "GitHub sign-in is not enabled in the Firebase console.";
    case "auth/credential-already-in-use":
      return "This credential is already linked to another account.";
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

const readGithubToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(GH_TOKEN_KEY);
  } catch {
    return null;
  }
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
  const [githubToken, setGithubToken] = useState<string | null>(readGithubToken);
  const [linkEmail, setLinkEmail] = useState<string | null>(null);
  const [linkProvider, setLinkProvider] = useState<"github" | "google" | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => setError(null);
  const clearLink = () => {
    setLinkEmail(null);
    setLinkProvider(null);
  };

  const captureGithubToken = (result: { credential: AuthCredential | null } | null) => {
    const cred = result?.credential as OAuthCredential | undefined | null;
    const token = cred?.accessToken;
    if (token) {
      try {
        window.localStorage.setItem(GH_TOKEN_KEY, token);
      } catch {
        /* ignore */
      }
      setGithubToken(token);
    }
  };

  const finalizeAuth = async (result: { user: User }) => {
    captureGithubToken(result as unknown as { credential: AuthCredential | null });
    await ensureUserDocument(result.user);
    const prof = await fetchProfile(result.user.uid);
    setProfile(prof);
  };

  /**
   * Signs in with an OAuth provider and transparently links the account when it
   * collides with an existing credential for the same email. Returns the
   * UserCredential, or null when the redirect flow was used.
   */
  const oauthSignInAndLink = async (
    provider: FirebaseAuthProvider,
    opts?: { password?: string },
  ): Promise<{ user: User } | null> => {
    if (isCrossOriginIsolatedDoc()) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    try {
      return await signInWithPopup(auth, provider);
    } catch (e) {
      const err = e as AuthError & {
        credential?: AuthCredential;
        email?: string;
      };
      if (
        err.code !== "auth/account-exists-with-different-credential" ||
        !err.credential ||
        !err.email
      ) {
        throw e;
      }
      const pendingCred = err.credential as AuthCredential;
      const email = err.email!;
      // If the caller already supplied the password (modal retry), sign in and link.
      if (opts?.password) {
        const cred = await signInWithEmailAndPassword(auth, email, opts.password);
        await linkWithCredential(cred.user, pendingCred);
        return cred;
      }
      // Otherwise try linking via an existing OAuth provider (no password needed).
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes("google.com")) {
        const res = await signInWithPopup(auth, googleProvider);
        await linkWithCredential(res.user, pendingCred);
        return res;
      }
      if (methods.includes("github.com")) {
        const res = await signInWithPopup(auth, githubProvider);
        await linkWithCredential(res.user, pendingCred);
        return res;
      }
      // Only a password account exists — ask the user for the password.
      setLinkEmail(email);
      setLinkProvider(provider === githubProvider ? "github" : "google");
      throw Object.assign(new Error("needs-password"), { code: "auth/needs-password" });
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
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
          await finalizeAuth(result);
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

  const signInWithGoogle = async (password?: string) => {
    setLoading(true);
    try {
      const result = await oauthSignInAndLink(googleProvider, { password });
      if (!result) return false;
      await finalizeAuth(result);
      return true;
    } catch (e) {
      if ((e as { code?: string })?.code !== "auth/needs-password") {
        showError(getFriendlyError(e as AuthError));
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async (password?: string) => {
    setLoading(true);
    try {
      const result = await oauthSignInAndLink(githubProvider, { password });
      if (!result) return false;
      await finalizeAuth(result);
      return true;
    } catch (e) {
      if ((e as { code?: string })?.code !== "auth/needs-password") {
        showError(getFriendlyError(e as AuthError));
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setGithubToken(null);
    try {
      window.localStorage.removeItem(GH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
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
        githubToken,
        linkEmail,
        linkProvider,
        clearLink,
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
