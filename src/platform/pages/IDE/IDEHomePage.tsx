"use client";

import "./ide.css";

import { useState } from "react";
import {
  Braces,
  Cloud,
  CloudOff,
  Keyboard,
  Settings2,
  ChevronDown,
  Plus,
  Trash2,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "./use-project";
import { FileTree } from "./file-tree";
import { CodeEditor } from "./code-editor";
import { RuntimePanel } from "./runtime-panel";
import { StartScreen } from "./StartScreen";
import { projectLabel } from "./types";

const saveLabel = (status: string, signedIn: boolean) =>
  status === "saving"
    ? "Saving…"
    : status === "error"
      ? "Save failed"
      : signedIn
        ? "Saved to cloud"
        : "Saved locally";

export function IDEHomePage() {
  const { user } = useAuth();
  const project = useProject();
  const [showLauncher, setShowLauncher] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [runtimeCollapsed, setRuntimeCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("pixelcode_preview_collapsed") === "1",
  );

  const toggleCollapse = () => {
    setRuntimeCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(
          "pixelcode_preview_collapsed",
          next ? "1" : "0",
        );
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (project.loading) {
    return (
      <div className="grid h-[calc(100dvh-112px)] min-h-[540px] place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-pulse rounded-full bg-[var(--accent)]" />
          <p className="font-mono text-xs">Preparing your studio…</p>
        </div>
      </div>
    );
  }

  if (project.isEmpty || showLauncher) {
    return (
      <StartScreen
        onCreate={(type) => {
          project.createNewProject(type);
          setShowLauncher(false);
        }}
        onImport={(files, name) => {
          project.importProject(files, name);
          setShowLauncher(false);
        }}
      />
    );
  }

  return (
    <div className="flex h-[calc(100dvh-112px)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
      <header className="relative flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(98,114,245,.25)]">
            <Braces size={18} strokeWidth={2.5} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-extrabold tracking-[-.02em] text-[var(--text-primary)]">
              PixelCode Studio
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="truncate font-mono text-xs text-[var(--text-secondary)]">
              {project.name}
            </span>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${project.projectType === "python" ? "bg-emerald-400/10 text-emerald-300" : project.projectType.startsWith("react") ? "bg-sky-400/10 text-sky-300" : "bg-[var(--accent-subtle)] text-[var(--accent-text)]"}`}
            >
              {projectLabel(project.projectType)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className={`hidden items-center gap-2 text-[11px] sm:flex ${project.saveStatus === "error" ? "text-rose-400" : "text-[var(--text-muted)]"}`}
          >
            {project.saveStatus === "error" ? (
              <CloudOff size={14} className="text-rose-400" />
            ) : (
              <Cloud
                size={14}
                className={user ? "text-emerald-400" : "text-[var(--text-muted)]"}
              />
            )}
            {saveLabel(project.saveStatus, !!user)}
          </div>

          <div className="relative">
            <button
              onClick={() => setProjectsOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
            >
              Projects
              <ChevronDown size={13} />
            </button>
            {projectsOpen && (
              <div className="absolute right-0 z-30 mt-1 w-60 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl">
                <button
                  onClick={() => {
                    setShowLauncher(true);
                    setProjectsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-b border-[var(--border)] px-3 py-2.5 text-left text-xs font-bold text-[var(--accent-text)] hover:bg-[var(--bg-subtle)]"
                >
                  <Plus size={14} /> New / import project
                </button>
                <div className="max-h-64 overflow-y-auto thin-scroll">
                  {project.projects.map((p) => (
                    <div
                      key={p.id}
                      className="group flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--bg-subtle)]"
                    >
                      <button
                        onClick={() => {
                          void project.selectProject(p.id);
                          setProjectsOpen(false);
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="truncate font-semibold text-[var(--text-primary)]">
                          {p.name}
                        </div>
                        <div className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                          {projectLabel(p.projectType)}
                        </div>
                      </button>
                      {project.activeProjectId === p.id && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      )}
                      <button
                        onClick={() => void project.deleteCurrentProject()}
                        className="shrink-0 text-[var(--text-muted)] opacity-0 hover:text-rose-400 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]"
            title={runtimeCollapsed ? "Expand preview" : "Collapse preview"}
          >
            {runtimeCollapsed ? (
              <PanelRightOpen size={15} />
            ) : (
              <PanelRightClose size={15} />
            )}
          </button>
          <button
            className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]"
            title="Keyboard shortcuts"
          >
            <Keyboard size={15} />
          </button>
          <button
            className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]"
            title="Settings"
          >
            <Settings2 size={15} />
          </button>
        </div>
      </header>

      <main
        className={`ide-grid grid min-h-0 flex-1 ${
          runtimeCollapsed
            ? "grid-cols-[220px_minmax(360px,1fr)_44px]"
            : "grid-cols-[220px_minmax(360px,1fr)_minmax(300px,36%)]"
        }`}
      >
        <FileTree
          files={project.files}
          activeId={project.activeId}
          projectType={project.projectType}
          onSelect={project.setActiveId}
          onAdd={project.addFile}
          onDelete={project.deleteFile}
          onRename={project.renameFile}
          onMove={project.moveFile}
          onReset={project.resetProject}
        />
        {project.activeFile ? (
          <CodeEditor
            file={project.activeFile}
            files={project.files}
            activeId={project.activeId}
            onSelect={project.setActiveId}
            onChange={(content) =>
              project.updateFile(project.activeFile!.id, content)
            }
            savedAt={project.savedAt}
          />
        ) : (
          <div className="grid place-items-center bg-[var(--bg-surface)] text-sm text-[var(--text-muted)]">
            Create a file to begin.
          </div>
        )}
        <RuntimePanel
          files={project.files}
          projectType={project.projectType}
          collapsed={runtimeCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </main>
    </div>
  );
}

export default IDEHomePage;
