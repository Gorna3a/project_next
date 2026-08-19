"use client";

import "./ide.css";

import { Braces, Cloud, CloudOff, Keyboard, Settings2 } from "lucide-react";
import { useAuth } from "@/core/context/AuthContext";
import { useProject } from "./use-project";
import { FileTree } from "./file-tree";
import { CodeEditor } from "./code-editor";
import { RuntimePanel } from "./runtime-panel";

const saveLabel = (status: string, signedIn: boolean) =>
  status === "saving" ? "Saving…"
  : status === "error" ? "Save failed"
  : signedIn ? "Saved to cloud"
  : "Saved locally";

export function IDEHomePage() {
  const { user } = useAuth();
  const project = useProject();

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

  return (
    <div className="flex h-[calc(100dvh-112px)] min-h-[540px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]" data-testid="app-learner-code-ide">
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(98,114,245,.25)]">
            <Braces size={18} strokeWidth={2.5} />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-extrabold tracking-[-.02em] text-[var(--text-primary)]">PixelCode Studio</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="truncate font-mono text-xs text-[var(--text-secondary)]">{project.name}</span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${project.projectType === "python" ? "bg-emerald-400/10 text-emerald-300" : "bg-[var(--accent-subtle)] text-[var(--accent-text)]"}`}>{project.projectType === "python" ? "python" : "starter"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-1 rounded-lg bg-[var(--bg-base)] p-0.5 text-[11px] sm:flex">
            <button onClick={() => project.switchProjectType("web")} className={`rounded px-2.5 py-1 font-bold ${project.projectType === "web" ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}>Web</button>
            <button onClick={() => project.switchProjectType("python")} className={`rounded px-2.5 py-1 font-bold ${project.projectType === "python" ? "bg-emerald-400/10 text-emerald-300" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}>Python</button>
          </div>
          <div className={`hidden items-center gap-2 text-[11px] sm:flex ${project.saveStatus === "error" ? "text-rose-400" : "text-[var(--text-muted)]"}`}>
            {project.saveStatus === "error" ? <CloudOff size={14} className="text-rose-400" /> : <Cloud size={14} className={user ? "text-emerald-400" : "text-[var(--text-muted)]"} />}
            {saveLabel(project.saveStatus, !!user)}
          </div>
          <button className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]" title="Keyboard shortcuts" data-testid="button-keyboard-shortcuts"><Keyboard size={15} /></button>
          <button className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]" title="Settings" data-testid="button-settings"><Settings2 size={15} /></button>
        </div>
      </header>
      <main className="ide-grid grid min-h-0 flex-1 grid-cols-[220px_minmax(360px,1fr)_minmax(300px,36%)]">
        <FileTree files={project.files} activeId={project.activeId} projectType={project.projectType} onSelect={project.setActiveId} onAdd={project.addFile} onDelete={project.deleteFile} onRename={project.renameFile} onMove={project.moveFile} onReset={project.resetProject} />
        {project.activeFile ? <CodeEditor file={project.activeFile} files={project.files} activeId={project.activeId} onSelect={project.setActiveId} onChange={content => project.updateFile(project.activeFile.id, content)} savedAt={project.savedAt} /> : <div className="grid place-items-center bg-[var(--bg-surface)] text-sm text-[var(--text-muted)]">Create a file to begin.</div>}
        <RuntimePanel files={project.files} projectType={project.projectType} />
      </main>
    </div>
  );
}

export default IDEHomePage;
