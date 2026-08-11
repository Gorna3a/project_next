"use client";

import { useCallback, useState } from "react";
import Editor from "@monaco-editor/react";
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

  return <section className="editor-panel flex min-h-0 flex-col bg-[#121b26]" data-testid="panel-code-editor">
    <div className="thin-scroll flex h-[45px] shrink-0 items-end overflow-x-auto border-b border-[#273341] bg-[#111a24]">
      {files.map(item => <button key={item.id} onClick={() => onSelect(item.id)} className={`relative flex h-full min-w-[132px] items-center gap-2 border-r border-[#273341] px-3 text-[12px] ${item.id === activeId ? "bg-[#182531] text-[#e9f6f6]" : "text-[#697c88] hover:bg-[#17222e]"}`} data-testid={`tab-${item.id}`}>{item.id === activeId && <span className="absolute left-0 top-0 h-[2px] w-full bg-[#43ded2]" />}{item.kind === "html" ? <FileCode2 size={14} className="text-[#de9970]" /> : item.kind === "css" ? <Hash size={14} className="text-[#72c8ed]" /> : item.kind === "js" || item.kind === "ts" ? <Braces size={14} className="text-[#e2c66f]" /> : item.kind === "py" ? <span className="text-[9px] font-bold text-[#9ece6a]">PY</span> : <FileText size={14} />}<span>{item.name}</span>{item.id === activeId && <Circle size={6} fill={savedAt ? "#5cdf91" : "#e4b968"} strokeWidth={0} className="ml-auto" />}</button>)}
      <button onClick={downloadFile} className="ml-auto mr-2 hidden p-2 text-[#657987] hover:text-[#d9ebef] sm:block" title="Download active file" data-testid="button-download"><Download size={15} /></button>
    </div>
    <div className="flex items-center justify-between border-b border-[#202d39] px-4 py-2 text-[11px] text-[#728794]"><div className="flex items-center gap-2"><Code2 size={13} className="text-[#48dcd1]" /><span>{language(file.kind)}</span><span className="text-[#3f5462]">·</span><span>{file.name}</span></div><div className="flex items-center gap-2">{savedAt && <span className="hidden text-[#70858c] sm:inline">Saved just now</span>}<button className="rounded p-1.5 hover:bg-[#21303b] hover:text-[#44dfd3]" title="Save file" data-testid="button-save"><Save size={14} /></button><button onClick={copyFile} className="flex items-center gap-1 rounded p-1.5 text-[#44dfd3] hover:bg-[#21303b]" title="Copy code" data-testid="button-copy">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div></div>
    <div className="code-scroll min-h-0 flex-1 overflow-hidden bg-[#111a24]" data-testid="input-code-editor"><Editor height="100%" path={file.id} language={monacoLanguage(file.kind)} value={file.content ?? ""} onChange={value => onChange(value ?? "")} theme="vs-dark" options={{ automaticLayout: true, minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', 'DM Mono', monospace", lineNumbersMinChars: 3, padding: { top: 16, bottom: 16 }, smoothScrolling: true, tabSize: 2, wordWrap: "on", scrollBeyondLastLine: false }} /></div>
    <div className="flex shrink-0 items-center justify-between border-t border-[#273341] bg-[#111a24] px-4 py-2 text-[10px] uppercase tracking-[.1em] text-[#586d79]"><span>Ln 1, Col 1</span><span>UTF-8 · LF · {language(file.kind)}</span></div>
  </section>;
}
