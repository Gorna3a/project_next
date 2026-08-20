import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { ProjectFile, ProjectType } from "../../platform/pages/IDE/types";

export interface ProjectSummary {
  id: string;
  name: string;
  projectType: ProjectType;
  updatedAt?: unknown;
}

export interface SavedProject extends ProjectSummary {
  userId: string;
  files: ProjectFile[];
  activeId?: string;
  createdAt?: unknown;
}

const projectsCol = (userId: string) =>
  collection(db, "users", userId, "projects");

export async function listProjects(userId: string): Promise<ProjectSummary[]> {
  const q = query(projectsCol(userId), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as SavedProject;
    return {
      id: d.id,
      name: data.name ?? "untitled",
      projectType: data.projectType ?? "web",
      updatedAt: data.updatedAt,
    };
  });
}

export async function getProject(
  userId: string,
  id: string,
): Promise<SavedProject | null> {
  const snap = await getDoc(doc(projectsCol(userId), id));
  if (!snap.exists()) return null;
  const data = snap.data() as SavedProject;
  if (!Array.isArray(data.files) || data.files.length === 0) return null;
  return { ...data, id: snap.id, userId };
}

export async function createProject(
  userId: string,
  data: Pick<SavedProject, "name" | "files" | "projectType" | "activeId">,
): Promise<string> {
  const ref = await addDoc(projectsCol(userId), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function saveProject(
  userId: string,
  id: string,
  data: Pick<SavedProject, "name" | "files" | "projectType" | "activeId">,
): Promise<void> {
  await setDoc(
    doc(projectsCol(userId), id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  await deleteDoc(doc(projectsCol(userId), id));
}

/**
 * Moves a legacy single-doc `projects/{userId}` into the new
 * `users/{userId}/projects/{id}` subcollection so existing users keep their work.
 * No-op once the user already has projects or has no legacy data.
 */
export async function migrateLegacyProject(userId: string): Promise<void> {
  const existing = await listProjects(userId);
  if (existing.length > 0) return;
  const legacy = await getDoc(doc(db, "projects", userId));
  if (!legacy.exists()) return;
  const data = legacy.data() as SavedProject;
  if (!Array.isArray(data.files) || data.files.length === 0) {
    await deleteDoc(doc(db, "projects", userId));
    return;
  }
  await createProject(userId, {
    name: data.name ?? "starter",
    files: data.files,
    projectType: data.projectType ?? "web",
    activeId: data.activeId,
  });
  await deleteDoc(doc(db, "projects", userId));
}
