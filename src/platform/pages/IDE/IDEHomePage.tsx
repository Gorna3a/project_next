"use client";

import "./ide.css";

import Link from "next/link";
import {
  Braces,
  ChevronLeft,
  Cloud,
  CloudOff,
  Keyboard,
  MoreHorizontal,
  Settings2,
  Sparkles,
} from "lucide-react";
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
  const { user, profile } = useAuth();
  const project = useProject();

  if (project.loading) {
    return (
      <div className="studio-noise grid min-h-[100dvh] place-items-center bg-[#111722] text-[#82a0a8]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-pulse rounded-full bg-[#42ddd0]" />
          <p className="font-mono text-xs">Preparing your studio…</p>
        </div>
      </div>
    );
  }

  const initials = (profile?.displayName ?? user?.displayName ?? "PixelCoder")
    .split(" ")
    .map(part => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="studio-noise min-h-[100dvh] bg-[#111722] text-[#dce6f0]" data-testid="app-learner-code-ide">
      <header className="flex h-[58px] items-center justify-between border-b border-[#273341] bg-[#0e151e] px-3 sm:px-5">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="rounded-md p-1.5 text-[#8093a0] hover:bg-[#1c2833] md:hidden"
            title="Back to dashboard"
            data-testid="button-mobile-back"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#42ddd0] text-[#102128] shadow-[0_0_20px_rgba(66,221,208,.12)]">
            <Braces size={18} strokeWidth={2.5} />
          </div>
          <div className="topbar-title flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-[-.02em] text-[#e5f0f1]">PixelCode Studio</span>
            <span className="text-[#425461]">/</span>
            <span className="font-mono text-xs text-[#8598a4]">{project.name}</span>
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${project.projectType === "python" ? "bg-[#1c3c33] text-[#8beba8]" : "bg-[#1c3c3e] text-[#65e1d6]"}`}>{project.projectType === "python" ? "python" : "starter"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded bg-[#0d151e] p-0.5 text-[11px] sm:flex">
            <button onClick={() => project.switchProjectType("web")} className={`rounded px-2.5 py-1 font-bold ${project.projectType === "web" ? "bg-[#263743] text-[#d8f8f4]" : "text-[#718691] hover:text-[#a9c4c8]"}`}>Web</button>
            <button onClick={() => project.switchProjectType("python")} className={`rounded px-2.5 py-1 font-bold ${project.projectType === "python" ? "bg-[#263743] text-[#b7f6c9]" : "text-[#718691] hover:text-[#a9c4c8]"}`}>Python</button>
          </div>
          <div className={`hidden items-center gap-2 text-[11px] sm:flex ${project.saveStatus === "error" ? "text-[#ef8d88]" : "text-[#6e818d]"}`}>
            {project.saveStatus === "error" ? <CloudOff size={14} className="text-[#ef8d88]" /> : <Cloud size={14} className={user ? "text-[#5ede9a]" : "text-[#5c7a8a]"} />}
            {saveLabel(project.saveStatus, !!user)}
          </div>
          <button className="rounded-md p-2 text-[#718592] hover:bg-[#1c2833] hover:text-[#c7e7e5]" title="Keyboard shortcuts" data-testid="button-keyboard-shortcuts"><Keyboard size={15} /></button>
          <button className="rounded-md p-2 text-[#718592] hover:bg-[#1c2833] hover:text-[#c7e7e5]" title="Settings" data-testid="button-settings"><Settings2 size={15} /></button>
          <Link href="/app/profile" className="grid h-7 w-7 place-items-center rounded-full border border-[#35505b] bg-[#1c3037] text-[10px] font-bold text-[#8de6db]" title="Profile" data-testid="avatar-learner">{initials || "PC"}</Link>
        </div>
      </header>
      <div className="flex h-[39px] items-center justify-between border-b border-[#273341] bg-[#111a24] px-3 text-[11px] text-[#708592] sm:px-5">
        <div className="flex items-center gap-2"><span className="text-[#708592]">Project</span><span className="text-[#405461]">›</span><span className="text-[#a1b4bd]">{project.name}</span></div>
        <div className="flex items-center gap-4"><span className="hidden sm:inline">Unsaved changes save automatically</span><button className="rounded p-1 hover:bg-[#23313c] hover:text-[#d6efeb]" title="More project actions" data-testid="button-project-actions"><MoreHorizontal size={15} /></button></div>
      </div>
      <main className="ide-grid grid min-h-[calc(100dvh-97px)] grid-cols-[230px_minmax(390px,1fr)_minmax(320px,40%)]">
        <FileTree files={project.files} activeId={project.activeId} projectType={project.projectType} onSelect={project.setActiveId} onAdd={project.addFile} onDelete={project.deleteFile} onRename={project.renameFile} onMove={project.moveFile} onReset={project.resetProject} />
        {project.activeFile ? <CodeEditor file={project.activeFile} files={project.files} activeId={project.activeId} onSelect={project.setActiveId} onChange={content => project.updateFile(project.activeFile.id, content)} savedAt={project.savedAt} /> : <div className="grid place-items-center bg-[#121b26] text-sm text-[#6e838e]">Create a file to begin.</div>}
        <RuntimePanel files={project.files} projectType={project.projectType} />
      </main>
      <footer className="fixed bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-[#2a4249] bg-[#15242c]/95 px-4 py-2 text-[10px] text-[#83a1a7] shadow-xl backdrop-blur md:flex"><Sparkles size={13} className="text-[#efd47a]" /><span>Tip: change a line, then run it.</span><span className="h-3 w-px bg-[#395057]" /><span className="font-mono text-[#5c7780]">⌘ K</span></footer>
    </div>
  );
}

export default IDEHomePage;
