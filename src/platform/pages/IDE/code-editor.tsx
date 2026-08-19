"use client";

import { useCallback, useState } from "react";
import Editor, { type BeforeMount } from "@monaco-editor/react";
import { Braces, Check, Circle, Code2, Copy, Download, FileCode2, FileText, Hash, Save } from "lucide-react";
import type { ProjectFile } from "./types";

type Props = {
  file: ProjectFile;
  files: ProjectFile[];
  activeId: string;
  onSelect: (id: string) => void;
  onChange: (value: string) => void;
  savedAt: Date | null;
};

const language = (kind: string) =>
  kind === "html" ? "HTML"
  : kind === "css" ? "CSS"
  : kind === "js" ? "JavaScript"
  : kind === "ts" ? "TypeScript"
  : kind === "json" ? "JSON"
  : kind === "py" ? "Python"
  : kind === "md" ? "Markdown"
  : "Plain text";

const monacoLanguage = (kind: string) =>
  kind === "html" ? "html"
  : kind === "css" ? "css"
  : kind === "js" ? "javascript"
  : kind === "ts" ? "typescript"
  : kind === "json" ? "json"
  : kind === "py" ? "python"
  : kind === "md" ? "markdown"
  : "plaintext";

type PixelcodeTheme = {
  base: "vs-dark";
  inherit: boolean;
  rules: { token: string; foreground: string }[];
  colors: Record<string, string>;
};

const pixelcodeTheme: PixelcodeTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "5a5c90" },
    { token: "keyword", foreground: "8898fa" },
    { token: "string", foreground: "9ece6a" },
    { token: "number", foreground: "e9ca71" },
    { token: "type", foreground: "7a8af7" },
    { token: "delimiter", foreground: "9395c8" },
  ],
  colors: {
    "editor.background": "#1a1a2e",
    "editor.foreground": "#e8e8ff",
    "editorCursor.foreground": "#8898fa",
    "editor.lineHighlightBackground": "#16162a",
    "editor.selectionBackground": "#1a1d40",
    "editorLineNumber.foreground": "#5a5c90",
    "editorLineNumber.activeForeground": "#9395c8",
    "editorIndentGuide.background": "#2a2a45",
    "editorWidget.background": "#13131f",
    "scrollbarSlider.background": "#2a2a45",
  },
};

const defineTheme: BeforeMount = monaco => {
  monaco.editor.defineTheme("pixelcode", pixelcodeTheme as never);
};
export function CodeEditor({ file, files, activeId, onSelect, onChange, savedAt }: Props) {
  const [copied, setCopied] = useState(false);

  const copyFile = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(file.content ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [file.content]);

  const downloadFile = useCallback(() => {
    const blob = new Blob([file.content ?? ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [file.name, file.content]);

  return <section className="editor-panel flex min-h-0 flex-col bg-[var(--bg-surface)]" data-testid="panel-code-editor">
    <div className="thin-scroll flex h-[45px] shrink-0 items-end overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-elevated)]">
      {files.map(item => <button key={item.id} onClick={() => onSelect(item.id)} className={`relative flex h-full min-w-[132px] items-center gap-2 border-r border-[var(--border)] px-3 text-[12px] ${item.id === activeId ? "bg-[var(--bg-surface)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"}`} data-testid={`tab-${item.id}`}>{item.id === activeId && <span className="absolute left-0 top-0 h-[2px] w-full bg-[var(--accent)]" />}{item.kind === "html" ? <FileCode2 size={14} className="text-[#de9970]" /> : item.kind === "css" ? <Hash size={14} className="text-[#72c8ed]" /> : item.kind === "js" || item.kind === "ts" ? <Braces size={14} className="text-[#e2c66f]" /> : item.kind === "py" ? <span className="text-[9px] font-bold text-[#9ece6a]">PY</span> : <FileText size={14} />}<span>{item.name}</span>{item.id === activeId && <Circle size={6} fill={savedAt ? "#34d399" : "#fbbf24"} strokeWidth={0} className="ml-auto" />}</button>)}
      <button onClick={downloadFile} className="ml-auto mr-2 hidden p-2 text-[var(--text-muted)] hover:text-[var(--accent-text)] sm:block" title="Download active file" data-testid="button-download"><Download size={15} /></button>
    </div>
    <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 text-[11px] text-[var(--text-muted)]"><div className="flex items-center gap-2"><Code2 size={13} className="text-[var(--accent-text)]" /><span>{language(file.kind)}</span><span className="text-[var(--text-muted)]">·</span><span>{file.name}</span></div><div className="flex items-center gap-2">{savedAt && <span className="hidden text-[var(--text-muted)] sm:inline">Saved just now</span>}<button className="rounded p-1.5 hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)]" title="Save file" data-testid="button-save"><Save size={14} /></button><button onClick={copyFile} className="flex items-center gap-1 rounded p-1.5 text-[var(--accent-text)] hover:bg-[var(--bg-subtle)]" title="Copy code" data-testid="button-copy">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div></div>
    <div className="code-scroll min-h-0 flex-1 overflow-hidden bg-[var(--bg-elevated)]" data-testid="input-code-editor"><Editor height="100%" path={file.id} language={monacoLanguage(file.kind)} value={file.content ?? ""} onChange={value => onChange(value ?? "")} theme="pixelcode" beforeMount={defineTheme} options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', 'DM Mono', monospace", lineNumbersMinChars: 3, padding: { top: 16, bottom: 16 }, smoothScrolling: true, tabSize: 2, wordWrap: "on", scrollBeyondLastLine: false }} /></div>
    <div className="flex shrink-0 items-center justify-between border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-[10px] uppercase tracking-[.1em] text-[var(--text-muted)]"><span>Ln 1, Col 1</span><span>UTF-8 · LF · {language(file.kind)}</span></div>
  </section>;
}
