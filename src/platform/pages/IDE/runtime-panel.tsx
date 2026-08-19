"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, CircleStop, ExternalLink, LoaderCircle, Play, RefreshCw, TerminalSquare, X } from "lucide-react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { NodepodTerminal } from "@scelar/nodepod";
import type { ProjectFile, ProjectType } from "./types";
import { ensurePod, useNodepod } from "./use-nodepod";
import { usePyodide } from "./use-pyodide";

type Props = { files: ProjectFile[]; projectType: ProjectType };

export function RuntimePanel({ files, projectType }: Props) {
  const isPython = projectType === "python";
  const [view, setView] = useState<"preview" | "terminal">("preview");
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<NodepodTerminal | null>(null);

  const web = useNodepod(files, {
    enabled: !isPython,
    onOutput: chunk => terminalInstance.current?.write(chunk),
  });
  const python = usePyodide(files, isPython);
  const { state, previewUrl, run, stop, clearLogs } = web;

  const html = files.find(file => file.name === "index.html")?.content ?? "";
  const css = files.find(file => file.name === "style.css")?.content ?? "";
  const js = files.find(file => file.name === "script.js")?.content ?? "";
  const fallbackSrcDoc = useMemo(() => {
    // Self-contained preview: strip external <link>/<script src> references
    // (there is no script.js/style.css route to fetch) and inline the editor
    // contents instead. Otherwise the iframe 503s on the missing assets.
    const cleaned = html
      .replace(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi, "")
      .replace(/<script[^>]+src=["'][^"']*["'][^>]*>\s*<\/script>/gi, "");
    return cleaned
      .replace("</head>", `<style>${css}</style></head>`)
      .replace("</body>", `<script>${js}<\/script></body>`);
  }, [html, css, js]);

  // Interactive Nodepod shell (xterm.js) for the Terminal view.
  useEffect(() => {
    if (isPython || !terminalRef.current) return;
    let disposed = false;
    ensurePod()
      .then(pod => {
        if (disposed || !terminalRef.current) return;
        const terminal = pod.createTerminal({
          Terminal,
          FitAddon,
          fontSize: 12,
          fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
          theme: {
            background: "#1a1a2e",
            foreground: "#9395c8",
            cursor: "#8898fa",
            selectionBackground: "#1a1d40",
            black: "#0a0a0f",
            brightBlack: "#5a5c90",
            white: "#e8e8ff",
            brightWhite: "#ffffff",
          },
        });
        terminal.attach(terminalRef.current);
        terminal.setCwd("/project");
        terminal.fit();
        terminalInstance.current = terminal;
        const observer = new ResizeObserver(() => terminal.fit());
        observer.observe(terminalRef.current);
        return () => {
          observer.disconnect();
          terminal.detach();
          terminalInstance.current = null;
        };
      })
      .catch(() => { /* boot failures are surfaced by the hook */ });
    return () => { disposed = true; };
  }, [isPython]);

  // Jump to the live preview once the dev server is ready.
  useEffect(() => {
    if (previewUrl) setView("preview");
  }, [previewUrl]);

  const isBooting = state === "booting";
  const isRunning = isPython ? python.state === "running" : state === "running";
  const hasError = isPython ? python.state === "error" : state === "error";
  const isPythonLoading = isPython && (python.state === "loading" || python.state === "idle");

  const statusLabel = isPython
    ? python.state === "running" ? "Running"
    : python.state === "error" ? "Runtime needs attention"
    : python.state === "ready" ? "Python ready"
    : "Loading Python runtime…"
    : isRunning ? "Running"
    : isBooting ? "Booting workspace"
    : hasError ? "Runtime needs attention"
    : state === "stopped" ? "Stopped"
    : "Ready to run";

  const statusDot = isRunning ? "bg-emerald-400" : isPythonLoading || isBooting ? "bg-amber-400 boot-pulse" : hasError ? "bg-rose-400" : "bg-[var(--text-muted)]";

  const runProject = () => {
    if (isPython) { void python.run(); return; }
    setView("terminal");
    void run();
  };

  const refresh = () => {
    if (previewUrl) {
      const iframe = document.querySelector<HTMLIFrameElement>("[data-testid='iframe-live-preview']");
      if (iframe) iframe.src = `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}refresh=${Date.now()}`;
    }
  };

  return <section className="runtime-panel flex min-h-0 flex-col border-l border-[var(--border)] bg-[var(--bg-surface)]" data-testid="panel-runtime">
    <div className="flex h-[45px] shrink-0 items-center justify-between border-b border-[var(--border)] px-3">
      {!isPython && <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-base)] p-1">
        <button onClick={() => setView("preview")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold ${view === "preview" ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`} data-testid="button-view-preview"><ExternalLink size={13} /> Preview</button>
        <button onClick={() => setView("terminal")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold ${view === "terminal" ? "bg-[var(--accent-subtle)] text-[var(--accent-text)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`} data-testid="button-view-terminal"><TerminalSquare size={13} /> Terminal</button>
      </div>}
      {isPython && <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-[var(--text-muted)]"><span className="file-py">PY</span> Python · Pyodide</div>}
      <div className="flex items-center gap-1">
        {isRunning ? <button onClick={stop} disabled={isPython} className="rounded-md p-2 text-rose-400 hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-40" title="Stop runtime" data-testid="button-stop-runtime"><CircleStop size={15} /></button> : <button onClick={runProject} disabled={isPythonLoading || isBooting} className="rounded-md bg-[var(--accent)] p-2 text-white shadow-[0_0_16px_rgba(98,114,245,.2)] hover:bg-[var(--accent-hover)] disabled:cursor-wait disabled:opacity-50" title="Run project" data-testid="button-run-project"><Play size={14} fill="currentColor" /></button>}
        {!isPython && <button onClick={refresh} disabled={!previewUrl} className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-text)] disabled:opacity-40" title="Refresh preview" data-testid="button-refresh-preview"><RefreshCw size={14} /></button>}
      </div>
    </div>
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2 text-[11px] text-[var(--text-muted)]">
        <span className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />{statusLabel}</span>
        <span className="flex items-center gap-1">{isPython ? "pyodide" : previewUrl ? "nodepod" : "localhost"} <ChevronDown size={12} /></span>
      </div>
      {isPython ? <div className="thin-scroll min-h-0 flex-1 overflow-y-auto bg-[var(--bg-elevated)] p-4" data-testid="python-output">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[.14em] text-[var(--text-muted)]"><span>python · workspace</span><button onClick={python.clearLogs} title="Clear output" data-testid="button-clear-python"><X size={13} /></button></div>
        <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-[var(--text-secondary)]">{python.logs.length ? python.logs.join("\n") : "Run main.py to see the output here."}</pre>
      </div> : view === "preview" ? <div className="relative min-h-0 flex-1 bg-[var(--bg-elevated)] p-3 sm:p-5">
        {!isRunning && !hasError && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-surface)]/90 p-8 text-center backdrop-blur-[2px]">
          <div className="max-w-[260px]">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--accent-text)]">{isBooting ? <LoaderCircle size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}</div>
            <h3 className="m-0 text-[15px] font-bold text-[var(--text-primary)]">{isBooting ? "Warming up your workspace" : hasError ? "Browser runtime unavailable" : state === "stopped" ? "Preview paused" : "Your canvas is ready"}</h3>
            <p className="mb-5 mt-2 text-xs leading-5 text-[var(--text-secondary)]">{isBooting ? "The in-browser Node.js runtime takes a moment on first load." : hasError ? "You can still use the editor and local preview. Try Run again after checking browser support." : "Run the project to see your page here. Changes will sync into the workspace."}</p>
            {!isBooting && <button onClick={runProject} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-bold text-white" data-testid="button-run-empty-state">Run project <Play className="ml-1 inline" size={12} fill="currentColor" /></button>}
          </div>
        </div>}
        {hasError && <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-3 rounded-lg border border-rose-400/40 bg-[var(--bg-surface)]/95 px-3 py-2 text-[11px] text-rose-300 shadow-xl backdrop-blur">
          <span><strong className="text-rose-200">Browser runtime unavailable.</strong> Showing local preview instead.</span>
          <button onClick={runProject} className="shrink-0 rounded bg-[var(--accent)] px-2.5 py-1 font-bold text-white" data-testid="button-retry-runtime">Retry</button>
        </div>}
        <iframe title="Project preview" src={previewUrl || undefined} srcDoc={previewUrl ? undefined : fallbackSrcDoc} className="h-full w-full rounded-lg border border-[var(--border)] bg-[#f3eadb] shadow-[0_12px_32px_rgba(0,0,0,.35)]" data-testid="iframe-live-preview" />
      </div> : <div className="thin-scroll min-h-0 flex-1 overflow-y-auto bg-[var(--bg-elevated)] p-4" data-testid="terminal-output">
        <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[.14em] text-[var(--text-muted)]"><span>node · workspace</span><button onClick={clearLogs} title="Clear terminal" data-testid="button-clear-terminal"><X size={13} /></button></div>
        <div ref={terminalRef} className="h-[calc(100%-32px)] min-h-[260px] w-full overflow-hidden" />
      </div>}
    </div>
    <div className="flex shrink-0 items-center gap-2 border-t border-[var(--border)] px-4 py-2 text-[10px] text-[var(--text-muted)]"><Check size={13} className="text-emerald-400" /> Files persisted automatically <span className="ml-auto">{isPython ? "Python in browser" : "Node.js in browser"}</span></div>
  </section>;
}
