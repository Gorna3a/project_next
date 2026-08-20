"use client";

import { useRef, useState } from "react";
import {
  GitBranch,
  FolderUp,
  Sparkles,
  LoaderCircle,
  FileCode2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/core/context/AuthContext";
import { importGithubRepo, fileKindFromName } from "./github-import";
import type { ProjectFile, ProjectType } from "./types";

interface StartScreenProps {
  onCreate: (type: ProjectType, name?: string) => void;
  onImport: (files: ProjectFile[], name: string) => void;
}

const TEMPLATES: { type: ProjectType; label: string; desc: string }[] = [
  { type: "react-ts", label: "React + TypeScript", desc: "Vite + React with TS" },
  { type: "react-js", label: "React + JavaScript", desc: "Vite + React with JS" },
  { type: "python", label: "Python", desc: "Pyodide in the browser" },
];

export function StartScreen({ onCreate, onImport }: StartScreenProps) {
  const { githubToken, signInWithGithub } = useAuth();
  const fileInput = useRef<HTMLInputElement>(null);
  const [ghInput, setGhInput] = useState("");
  const [busy, setBusy] = useState<"" | "local" | "github">("");
  const [error, setError] = useState<string | null>(null);

  const readLocal = async (list: FileList) => {
    setBusy("local");
    setError(null);
    try {
      const files: ProjectFile[] = [];
      for (const file of Array.from(list)) {
        const rel =
          (file as unknown as { webkitRelativePath?: string }).webkitRelativePath ||
          file.name;
        const parent = rel.includes("/")
          ? rel.slice(0, rel.lastIndexOf("/"))
          : undefined;
        const content = await file.text();
        files.push({
          id: rel,
          name: file.name,
          kind: fileKindFromName(file.name),
          content,
          parent,
        });
      }
      if (!files.length) throw new Error("No files found in the selected folder.");
      onImport(files, "local-project");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const importGithub = async () => {
    if (!ghInput.trim()) {
      setError("Enter a repository URL or owner/repo.");
      return;
    }
    setBusy("github");
    setError(null);
    try {
      let token = githubToken;
      if (!token) {
        const ok = await signInWithGithub();
        if (!ok) return;
        token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("pixelcode_gh_token")
            : null;
      }
      const result = await importGithubRepo(ghInput, token);
      onImport(result.files, result.name);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="grid h-[calc(100dvh-112px)] min-h-[540px] place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_0_28px_rgba(98,114,245,.35)]">
            <Sparkles size={26} />
          </div>
          <h1 className="m-0 text-2xl font-extrabold tracking-[-.02em] text-[var(--text-primary)]">
            Start something new
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Create a project, import a folder, or load a GitHub repository.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.type}
              onClick={() => onCreate(tpl.type)}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-left transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_14px_40px_rgba(98,114,245,.18)]"
            >
              <FileCode2 size={22} className="text-[var(--accent-text)]" />
              <div className="mt-3 font-bold text-[var(--text-primary)]">
                {tpl.label}
              </div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">
                {tpl.desc}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => fileInput.current?.click()}
            disabled={busy === "local"}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-left transition hover:-translate-y-1 hover:border-[var(--accent)] disabled:opacity-50"
          >
            <FolderUp size={22} className="text-[var(--accent-text)]" />
            <div>
              <div className="font-bold text-[var(--text-primary)]">
                {busy === "local" ? "Importing…" : "Load local project"}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Choose a folder from your computer
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
            <GitBranch size={22} className="shrink-0 text-[var(--accent-text)]" />
            <input
              value={ghInput}
              onChange={(e) => setGhInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && importGithub()}
              placeholder="owner/repo or GitHub URL"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
            <button
              onClick={importGithub}
              disabled={busy === "github"}
              className="shrink-0 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {busy === "github" ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                "Import"
              )}
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            // @ts-expect-error webkitdirectory is non-standard
            webkitdirectory=""
            multiple
            className="hidden"
            onChange={(e) => e.target.files && readLocal(e.target.files)}
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
