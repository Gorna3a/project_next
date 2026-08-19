"use client";

import { type ReactElement, useMemo, useState } from "react";
import { FileCode2, FilePlus2, FileText, Folder, FolderOpen, FolderPlus, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import type { FileKind, ProjectFile, ProjectType } from "./types";

type Props = {
  files: ProjectFile[];
  activeId: string;
  projectType: ProjectType;
  onSelect: (id: string) => void;
  onAdd: (name: string, kind: FileKind, parent?: string) => boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => boolean;
  onMove: (id: string, parent?: string) => boolean;
  onReset: () => void;
};

const iconFor = (kind: FileKind) =>
  kind === "folder" ? <Folder size={15} />
  : kind === "html" ? <FileCode2 size={15} />
  : kind === "css" ? <span className="file-css">#</span>
  : kind === "js" || kind === "ts" ? <span className="file-js">{kind.toUpperCase()}</span>
  : kind === "py" ? <span className="file-py">PY</span>
  : <FileText size={15} />;

export function FileTree({ files, activeId, projectType, onSelect, onAdd, onDelete, onRename, onMove, onReset }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [addKind, setAddKind] = useState<FileKind>("js");
  const [parent, setParent] = useState<string | undefined>();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const rootItems = useMemo(() => files.filter(file => !file.parent), [files]);
  const children = (parentId: string) => files.filter(file => file.parent === parentId);
  const submit = () => {
    const inferred = name.includes(".")
      ? name.endsWith(".py") ? "py"
      : name.endsWith(".css") ? "css"
      : name.endsWith(".ts") ? "ts"
      : name.endsWith(".json") ? "json"
      : name.endsWith(".html") ? "html"
      : name.endsWith(".md") ? "md"
      : "js"
      : addKind;
    if (name.trim() && onAdd(name.trim(), inferred, parent)) { setName(""); setAdding(false); setParent(undefined); }
  };
  const startRename = (file: ProjectFile) => { setRenaming(file.id); setRenameValue(file.name); };
  const commitRename = (file: ProjectFile) => { if (onRename(file.id, renameValue)) setRenaming(null); };
  const renderItem = (file: ProjectFile, depth = 0): ReactElement => <div key={file.id}>
    <div draggable onDragStart={event => event.dataTransfer.setData("text/plain", file.id)} onDragOver={event => file.kind === "folder" && event.preventDefault()} onDrop={event => { event.preventDefault(); onMove(event.dataTransfer.getData("text/plain"), file.id); }} className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-left text-[13px] transition-all ${file.id === activeId ? "bg-[var(--accent-subtle)] text-[var(--accent-text)] shadow-[inset_2px_0_0_#6272f5]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"}`} style={{ paddingLeft: `${8 + depth * 15}px` }}>
      <button onClick={() => file.kind !== "folder" ? onSelect(file.id) : undefined} className="flex min-w-0 flex-1 items-center gap-2 text-left" data-testid={`${file.kind === "folder" ? "folder" : "file"}-${file.id.replaceAll("/", "-")}`}>
        <span className={file.kind === "js" || file.kind === "ts" ? "text-[#e9ca71]" : file.kind === "css" ? "text-[#71c9ee]" : file.kind === "py" ? "text-[#9ece6a]" : file.kind === "folder" ? "text-[#d6aa67]" : "text-[#df9873]"}>{file.kind === "folder" ? <FolderOpen size={15} /> : iconFor(file.kind)}</span><span className="truncate">{file.name}</span>
      </button>
      <button onClick={() => startRename(file)} className="invisible rounded p-1 text-[var(--text-muted)] group-hover:visible hover:text-[var(--accent-text)]" title="Rename" data-testid={`button-rename-${file.id.replaceAll("/", "-")}`}><Pencil size={12} /></button>
      <button onClick={() => onDelete(file.id)} className="invisible rounded p-1 text-[var(--text-muted)] group-hover:visible hover:text-rose-400" title="Delete" data-testid={`button-delete-${file.id.replaceAll("/", "-")}`}><Trash2 size={12} /></button>
    </div>
    {renaming === file.id && <div className="ml-5 mt-1 flex gap-1" style={{ paddingLeft: `${depth * 15}px` }}><input autoFocus value={renameValue} onChange={event => setRenameValue(event.target.value)} onKeyDown={event => { if (event.key === "Enter") commitRename(file); if (event.key === "Escape") setRenaming(null); }} className="min-w-0 flex-1 rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 font-mono text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" data-testid={`input-rename-${file.id.replaceAll("/", "-")}`} /><button onClick={() => commitRename(file)} className="rounded bg-[var(--accent)] px-2 text-[10px] font-bold text-white" data-testid={`button-confirm-rename-${file.id.replaceAll("/", "-")}`}>OK</button></div>}
    {file.kind === "folder" && children(file.id).map(child => renderItem(child, depth + 1))}
  </div>;
  return <aside className="file-panel flex min-h-0 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)]" data-testid="panel-file-tree">
    <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
      <div><p className="m-0 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--text-muted)]">Explorer</p><p className="m-0 mt-1 text-xs text-[var(--text-secondary)]">{projectType === "python" ? "python-starter" : "first-light"} <span className="text-[var(--text-muted)]">/</span> {projectType}</p></div>
      <div className="flex items-center gap-1"><button onClick={() => { setAddKind(projectType === "python" ? "py" : "js"); setParent(undefined); setAdding(true); }} className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]" title="New file" data-testid="button-new-file"><FilePlus2 size={16} /></button><button onClick={() => { setAddKind("folder"); setParent(undefined); setAdding(true); }} className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[#d6aa67]" title="New folder" data-testid="button-new-folder"><FolderPlus size={15} /></button><button onClick={onReset} className="rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-amber-300" title="Reset project" data-testid="button-reset-project"><RotateCcw size={14} /></button></div>
    </div>
    <div className="thin-scroll min-h-0 flex-1 overflow-y-auto p-2">
      <div className="mb-2 flex items-center gap-2 px-2 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-[var(--text-muted)]"><FolderOpen size={14} className="text-[#d6aa67]" /> project files <span className="ml-auto font-mono text-[10px] font-normal text-[var(--text-muted)]">{files.filter(file => file.kind !== "folder").length}</span></div>
      {rootItems.map(file => renderItem(file))}
      {adding && <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] p-2 fade-up"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">New {addKind === "folder" ? "folder" : "file"}</span><button onClick={() => setAdding(false)} data-testid="button-cancel-file"><X size={13} /></button></div><input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder={addKind === "folder" ? "components" : projectType === "python" ? "utils.py" : "lesson.js"} className="mt-2 w-full rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1.5 font-mono text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" data-testid="input-file-name" /><button onClick={submit} className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-[var(--accent)] py-1.5 text-[11px] font-bold text-white" data-testid="button-create-file"><Plus size={13} /> Create {addKind === "folder" ? "folder" : "file"}</button></div>}
    </div>
    <div className="border-t border-[var(--border)] p-3 text-[11px] text-[var(--text-muted)]"><div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Local project</div><p className="mb-0 mt-1 pl-3.5">Saved automatically</p></div>
  </aside>;
}
