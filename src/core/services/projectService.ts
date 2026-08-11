import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { ProjectFile, ProjectType } from "../../platform/pages/IDE/types";

export interface SavedProject {
  userId: string;
  name: string;
  files: ProjectFile[];
  projectType: ProjectType;
  activeId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const projectRef = (userId: string) => doc(db, "projects", userId);

export async function getProject(userId: string): Promise<SavedProject | null> {
  const snap = await getDoc(projectRef(userId));
  if (!snap.exists()) return null;
  const data = snap.data() as SavedProject;
  if (!Array.isArray(data.files) || data.files.length === 0) return null;
  return {
    userId: data.userId ?? userId,
    name: data.name ?? "starter",
    files: data.files,
    projectType: data.projectType ?? "web",
    activeId: data.activeId,
  };
}

export async function saveProject(
  userId: string,
  data: Pick<SavedProject, "name" | "files" | "projectType" | "activeId">,
): Promise<void> {
  await setDoc(
    projectRef(userId),
    {
      userId,
      name: data.name,
      files: data.files,
      projectType: data.projectType,
      activeId: data.activeId ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
