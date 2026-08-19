"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { getProject, saveProject } from "@/core/services/projectService";
import {
  detectProjectType,
  pythonStarterFiles,
  starterFiles,
  type FileKind,
  type ProjectFile,
  type ProjectType,
} from "./types";

const STORAGE_KEY = "pixelcode-project";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const readLocal = (): ProjectFile[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

const writeLocal = (files: ProjectFile[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};

const firstEditableId = (files: ProjectFile[]) =>
  files.find(file => file.kind !== "folder")?.id ?? "index.html";

export function useProject() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [files, setFiles] = useState<ProjectFile[]>(() => {
    const local = readLocal();
    return local ?? starterFiles;
  });
  const [activeId, setActiveId] = useState(() => {
    const local = readLocal();
    return firstEditableId(local ?? starterFiles);
  });
  const [projectType, setProjectType] = useState<ProjectType>(() => {
    const local = readLocal();
    return detectProjectType(local ?? starterFiles);
  });
  const [name, setName] = useState("first-light");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Load project for the current user (cloud for signed-in users, localStorage otherwise).
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setLoading(true);

    (async () => {
      try {
        const local = readLocal();
        let nextFiles = starterFiles;
        if (uid) {
          try {
            const cloud = await getProject(uid);
            if (cloud?.files?.length) {
              nextFiles = cloud.files;
              setProjectType(cloud.projectType ?? detectProjectType(cloud.files));
              setName(cloud.name ?? "first-light");
              setActiveId(cloud.activeId ?? firstEditableId(cloud.files));
            } else if (local?.length) {
              // First login: migrate the anonymous localStorage project to the cloud.
              nextFiles = local;
              setProjectType(detectProjectType(local));
              setActiveId(firstEditableId(local));
            }
          } catch {
            // Cloud read failed (network, auth, or Firestore rules). Fall back to
            // the local copy so the editor stays usable.
            if (local?.length) {
              nextFiles = local;
              setProjectType(detectProjectType(local));
              setActiveId(firstEditableId(local));
            }
          }
        } else if (local?.length) {
          nextFiles = local;
          setProjectType(detectProjectType(local));
          setActiveId(firstEditableId(local));
        }
        if (!cancelled) setFiles(nextFiles);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoaded(true);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [uid]);

  // Debounced persistence: Firestore for signed-in users, localStorage for guests.
  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        if (uid) {
          await saveProject(uid, { name, files, projectType, activeId });
        } else {
          writeLocal(files);
        }
        setSaveStatus("saved");
        setSavedAt(new Date());
      } catch {
        setSaveStatus("error");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [files, activeId, projectType, name, uid, loaded]);

  const activeFile = useMemo(
    () => files.find(file => file.id === activeId) ?? files.find(file => file.kind !== "folder") ?? null,
    [files, activeId],
  );

  const updateFile = (id: string, content: string) =>
    setFiles(items => items.map(item => (item.id === id ? { ...item, content } : item)));

  const addFile = (name: string, kind: FileKind, parent?: string) => {
    const normalized = kind === "folder"
      ? name.replaceAll("/", "-").trim()
      : name.includes(".") ? name.trim() : `${name.trim()}.${kind === "py" ? "py" : kind === "js" ? "js" : kind === "ts" ? "ts" : kind === "css" ? "css" : kind === "json" ? "json" : "html"}`;
    if (!normalized || files.some(file => file.name === normalized && file.parent === parent)) return false;
    const id = `${parent ? `${parent}/` : ""}${normalized}`;
    const content = kind === "folder"
      ? undefined
      : kind === "css" ? "/* Start styling here */\n"
      : kind === "js" ? "// Start writing JavaScript here\n"
      : kind === "ts" ? "// Start writing TypeScript here\n"
      : kind === "py" ? "# Start writing Python here\n"
      : kind === "json" ? "{\n  \n}\n"
      : "<!-- Start writing HTML here -->\n";
    setFiles(items => [...items, { id, name: normalized, kind, content, parent }]);
    if (kind !== "folder") setActiveId(id);
    return true;
  };

  const deleteFile = (id: string) => {
    setFiles(items => {
      const idsToRemove = new Set([id]);
      let changed = true;
      while (changed) {
        changed = false;
        items.forEach(item => {
          if (item.parent && idsToRemove.has(item.parent) && !idsToRemove.has(item.id)) {
            idsToRemove.add(item.id);
            changed = true;
          }
        });
      }
      return items.filter(item => !idsToRemove.has(item.id));
    });
    if (activeId === id || activeId.startsWith(`${id}/`))
      setActiveId(files.find(file => file.id !== id && file.kind !== "folder")?.id ?? "");
  };

  const renameFile = (id: string, name: string) => {
    const item = files.find(file => file.id === id);
    if (!item || !name.trim() || files.some(file => file.parent === item.parent && file.name === name.trim() && file.id !== id)) return false;
    const nextId = `${item.parent ? `${item.parent}/` : ""}${name.trim()}`;
    setFiles(items => items.map(file =>
      file.id === id || file.id.startsWith(`${id}/`)
        ? {
            ...file,
            id: file.id === id ? nextId : `${nextId}${file.id.slice(id.length)}`,
            name: file.id === id ? name.trim() : file.name,
            parent: file.parent === id ? nextId : file.parent,
          }
        : file,
    ));
    if (activeId === id) setActiveId(nextId);
    return true;
  };

  const moveFile = (id: string, parent?: string) => {
    const item = files.find(file => file.id === id);
    if (!item || item.parent === parent || id === parent || parent?.startsWith(`${id}/`)) return false;
    const nextId = `${parent ? `${parent}/` : ""}${item.name}`;
    if (files.some(file => file.id === nextId)) return false;
    setFiles(items => items.map(file =>
      file.id === id || file.id.startsWith(`${id}/`)
        ? {
            ...file,
            id: file.id === id ? nextId : `${nextId}${file.id.slice(id.length)}`,
            parent: file.id === id ? parent : file.parent === id ? nextId : file.parent,
          }
        : file,
    ));
    if (activeId === id) setActiveId(nextId);
    return true;
  };

  const resetProject = () => {
    setFiles(projectType === "python" ? pythonStarterFiles : starterFiles);
    setActiveId(projectType === "python" ? "main.py" : "index.html");
  };

  const switchProjectType = (type: ProjectType) => {
    const next = type === "python" ? pythonStarterFiles : starterFiles;
    setProjectType(type);
    setName(type === "python" ? "python-starter" : "first-light");
    setFiles(next);
    setActiveId(firstEditableId(next));
  };

  return {
    files,
    activeId,
    setActiveId,
    activeFile,
    projectType,
    name,
    saveStatus,
    savedAt,
    loading,
    updateFile,
    addFile,
    deleteFile,
    renameFile,
    moveFile,
    resetProject,
    switchProjectType,
  };
}
