"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import {
  listProjects,
  getProject,
  createProject,
  saveProject,
  deleteProject,
  migrateLegacyProject,
  type ProjectSummary,
  type SavedProject,
} from "@/core/services/projectService";
import {
  detectProjectType,
  reactTsStarterFiles,
  reactJsStarterFiles,
  pythonStarterFiles,
  starterFiles,
  type FileKind,
  type ProjectFile,
  type ProjectType,
} from "./types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

const LOCAL_KEY = "pixelcode_projects_v2";

type ProjectData = Pick<SavedProject, "name" | "files" | "projectType" | "activeId">;

const readLocalProjects = (): SavedProject[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalProjects = (projects: SavedProject[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(projects));
};

const firstEditableId = (files: ProjectFile[]) =>
  files.find((file) => file.kind !== "folder")?.id ?? "index.html";

const templateFor = (type: ProjectType): ProjectFile[] =>
  type === "python"
    ? pythonStarterFiles
    : type === "react-ts"
      ? reactTsStarterFiles
      : type === "react-js"
        ? reactJsStarterFiles
        : starterFiles;

const defaultNameFor = (type: ProjectType): string =>
  type === "python"
    ? "python-starter"
    : type === "react-ts"
      ? "react-ts-app"
      : type === "react-js"
        ? "react-js-app"
        : "web-app";

export function useProject() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [projectType, setProjectType] = useState<ProjectType>("web");
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Load the project list and open the most recent project (or show the
  // clean launcher when there are none).
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setLoading(true);
    (async () => {
      try {
        let list: ProjectSummary[] = [];
        let active: SavedProject | null = null;
        if (uid) {
          await migrateLegacyProject(uid);
          list = await listProjects(uid);
          if (list.length) active = await getProject(uid, list[0].id);
        } else {
          const local = readLocalProjects();
          list = local.map((p) => ({
            id: p.id,
            name: p.name,
            projectType: p.projectType,
            updatedAt: p.updatedAt,
          }));
          if (list.length) active = local[0];
        }
        if (!cancelled) {
          setProjects(list);
          if (active && Array.isArray(active.files) && active.files.length) {
            setActiveProjectId(active.id);
            setFiles(active.files);
            setProjectType(active.projectType ?? detectProjectType(active.files));
            setName(active.name ?? "untitled");
            setActiveId(active.activeId ?? firstEditableId(active.files));
            setIsEmpty(false);
          } else {
            setFiles([]);
            setActiveId("");
            setIsEmpty(true);
            setProjectType("web");
            setName("");
          }
        }
      } catch {
        if (!cancelled) {
          setFiles([]);
          setActiveId("");
          setIsEmpty(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Debounced persistence to Firestore (signed-in) or localStorage (guests).
  useEffect(() => {
    if (!loaded || isEmpty) return;
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const data: ProjectData = {
          name,
          files,
          projectType,
          activeId: activeId || undefined,
        };
        if (uid) {
          if (activeProjectId) {
            await saveProject(uid, activeProjectId, data);
          } else {
            const id = await createProject(uid, { ...data });
            setActiveProjectId(id);
            setProjects((prev) => [
              { id, name, projectType, updatedAt: new Date() },
              ...prev,
            ]);
          }
        } else {
          const local = readLocalProjects();
          const updated: SavedProject = {
            id: activeProjectId ?? `local_${Date.now()}`,
            userId: "",
            name,
            files,
            projectType,
            activeId: activeId || undefined,
            updatedAt: new Date(),
          };
          const idx = local.findIndex((p) => p.id === updated.id);
          if (idx >= 0) local[idx] = updated;
          else local.unshift(updated);
          writeLocalProjects(local);
          setActiveProjectId(updated.id);
          setProjects(
            local.map((p) => ({
              id: p.id,
              name: p.name,
              projectType: p.projectType,
              updatedAt: p.updatedAt,
            })),
          );
        }
        setSaveStatus("saved");
        setSavedAt(new Date());
      } catch {
        setSaveStatus("error");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [files, activeId, projectType, name, uid, loaded, isEmpty, activeProjectId]);

  const activeFile = useMemo(
    () =>
      files.find((file) => file.id === activeId) ??
      files.find((file) => file.kind !== "folder") ??
      null,
    [files, activeId],
  );

  const updateFile = (id: string, content: string) =>
    setFiles((items) =>
      items.map((item) => (item.id === id ? { ...item, content } : item)),
    );

  const addFile = (fileName: string, kind: FileKind, parent?: string) => {
    const normalized =
      kind === "folder"
        ? fileName.replaceAll("/", "-").trim()
        : fileName.includes(".")
          ? fileName.trim()
          : `${fileName.trim()}.${kind === "py" ? "py" : kind === "js" ? "js" : kind === "ts" ? "ts" : kind === "css" ? "css" : kind === "json" ? "json" : "html"}`;
    if (
      !normalized ||
      files.some((file) => file.name === normalized && file.parent === parent)
    )
      return false;
    const id = `${parent ? `${parent}/` : ""}${normalized}`;
    const content =
      kind === "folder"
        ? undefined
        : kind === "css"
          ? "/* Start styling here */\n"
          : kind === "js"
            ? "// Start writing JavaScript here\n"
            : kind === "ts"
              ? "// Start writing TypeScript here\n"
              : kind === "py"
                ? "# Start writing Python here\n"
                : kind === "json"
                  ? "{\n  \n}\n"
                  : "<!-- Start writing HTML here -->\n";
    setFiles((items) => [
      ...items,
      { id, name: normalized, kind, content, parent },
    ]);
    if (kind !== "folder") setActiveId(id);
    return true;
  };

  const deleteFile = (id: string) => {
    setFiles((items) => {
      const idsToRemove = new Set([id]);
      let changed = true;
      while (changed) {
        changed = false;
        items.forEach((item) => {
          if (
            item.parent &&
            idsToRemove.has(item.parent) &&
            !idsToRemove.has(item.id)
          ) {
            idsToRemove.add(item.id);
            changed = true;
          }
        });
      }
      return items.filter((item) => !idsToRemove.has(item.id));
    });
    if (activeId === id || activeId.startsWith(`${id}/`))
      setActiveId(
        files.find((file) => file.id !== id && file.kind !== "folder")?.id ?? "",
      );
  };

  const renameFile = (id: string, fileName: string) => {
    const item = files.find((file) => file.id === id);
    if (
      !item ||
      !fileName.trim() ||
      files.some(
        (file) =>
          file.parent === item.parent &&
          file.name === fileName.trim() &&
          file.id !== id,
      )
    )
      return false;
    const nextId = `${item.parent ? `${item.parent}/` : ""}${fileName.trim()}`;
    setFiles((items) =>
      items.map((file) =>
        file.id === id || file.id.startsWith(`${id}/`)
          ? {
              ...file,
              id: file.id === id ? nextId : `${nextId}${file.id.slice(id.length)}`,
              name: file.id === id ? fileName.trim() : file.name,
              parent: file.parent === id ? nextId : file.parent,
            }
          : file,
      ),
    );
    if (activeId === id) setActiveId(nextId);
    return true;
  };

  const moveFile = (id: string, parent?: string) => {
    const item = files.find((file) => file.id === id);
    if (
      !item ||
      item.parent === parent ||
      id === parent ||
      parent?.startsWith(`${id}/`)
    )
      return false;
    const nextId = `${parent ? `${parent}/` : ""}${item.name}`;
    if (files.some((file) => file.id === nextId)) return false;
    setFiles((items) =>
      items.map((file) =>
        file.id === id || file.id.startsWith(`${id}/`)
          ? {
              ...file,
              id: file.id === id ? nextId : `${nextId}${file.id.slice(id.length)}`,
              parent: file.id === id ? parent : file.parent === id ? nextId : file.parent,
            }
          : file,
      ),
    );
    if (activeId === id) setActiveId(nextId);
    return true;
  };

  const createNewProject = (type: ProjectType, projectName = "") => {
    const tmpl = templateFor(type);
    setProjectType(type);
    setName(projectName || defaultNameFor(type));
    setFiles(tmpl);
    setActiveId(firstEditableId(tmpl));
    setActiveProjectId(null);
    setIsEmpty(false);
  };

  const importProject = (imported: ProjectFile[], projectName = "imported") => {
    const type = detectProjectType(imported);
    setProjectType(type);
    setName(projectName);
    setFiles(imported);
    setActiveId(firstEditableId(imported));
    setActiveProjectId(null);
    setIsEmpty(false);
  };

  const selectProject = async (id: string) => {
    let p: SavedProject | null = null;
    if (uid) p = await getProject(uid, id);
    else p = readLocalProjects().find((x) => x.id === id) ?? null;
    if (!p) return;
    setActiveProjectId(id);
    setFiles(p.files);
    setProjectType(p.projectType ?? detectProjectType(p.files));
    setName(p.name ?? "untitled");
    setActiveId(p.activeId ?? firstEditableId(p.files));
    setIsEmpty(false);
  };

  const deleteCurrentProject = async () => {
    const current = activeProjectId;
    if (!current) {
      setFiles([]);
      setIsEmpty(true);
      setActiveProjectId(null);
      return;
    }
    try {
      if (uid) await deleteProject(uid, current);
      else {
        const local = readLocalProjects().filter((p) => p.id !== current);
        writeLocalProjects(local);
      }
    } catch {
      /* ignore */
    }
    const remaining = projects.filter((p) => p.id !== current);
    setProjects(remaining);
    if (remaining.length) await selectProject(remaining[0].id);
    else {
      setFiles([]);
      setActiveProjectId(null);
      setIsEmpty(true);
    }
  };

  const resetProject = () => {
    const tmpl = templateFor(projectType);
    setFiles(tmpl);
    setActiveId(firstEditableId(tmpl));
  };

  return {
    projects,
    activeProjectId,
    files,
    activeId,
    setActiveId,
    activeFile,
    projectType,
    name,
    setName,
    isEmpty,
    saveStatus,
    savedAt,
    loading,
    updateFile,
    addFile,
    deleteFile,
    renameFile,
    moveFile,
    createNewProject,
    importProject,
    selectProject,
    deleteCurrentProject,
    resetProject,
  };
}
