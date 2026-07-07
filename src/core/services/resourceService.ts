import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export interface Bookmark {
  id: string;
  userId: string;
  resourceId: string;
  savedAt: Timestamp;
}

const bookmarksRef = collection(db, "bookmarks");

export const addBookmark = async (userId: string, resourceId: string) => {
  const existing = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("resourceId", "==", resourceId),
  );
  const snap = await getDocs(existing);
  if (!snap.empty) return;

  const ref = await addDoc(bookmarksRef, {
    userId,
    resourceId,
    savedAt: serverTimestamp(),
  });
  return ref.id;
};

export const removeBookmark = async (userId: string, resourceId: string) => {
  const existing = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("resourceId", "==", resourceId),
  );
  const snap = await getDocs(existing);
  if (snap.empty) return;

  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "bookmarks", d.id))));
};

export const getUserBookmarks = async (
  userId: string,
): Promise<Set<string>> => {
  const q = query(bookmarksRef, where("userId", "==", userId));
  const snap = await getDocs(q);
  return new Set(snap.docs.map((d) => d.data().resourceId));
};

export const isResourceBookmarked = async (
  userId: string,
  resourceId: string,
): Promise<boolean> => {
  const existing = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("resourceId", "==", resourceId),
  );
  const snap = await getDocs(existing);
  return !snap.empty;
};
