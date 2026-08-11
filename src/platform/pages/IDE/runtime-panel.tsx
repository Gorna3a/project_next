"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, CircleStop, ExternalLink, LoaderCircle, Play, RefreshCw, TerminalSquare, X } from "lucide-react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";
import type { ProjectFile, ProjectType } from "./types";
import { useWebContainer } from "./use-webcontainer";
import { usePyodide } from "./use-pyodide";

type Props = { files: ProjectFile[]; projectType: ProjectType };

export function RuntimePanel({ files, projectType }: Props) {
  const isPython = projectType === "python";
  const [view, setView] = useState<"preview" | "terminal">("preview");
  const [terminalReady, setTerminalReady] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const web = useWebContainer(files);
  const python = usePyodide(files);
  const { state, logs, previewUrl, run, stop, sendInput, clearLogs } = web;

  const html = files.find(file => file.name === "index.html")?.content ?? "";
  const css = files.find(file => file.name === "style.css")?.content ?? "";
  const js = files.find(file => file.name === "script.js")?.content ?? "";
  const fallbackSrcDoc = useMemo(() => {
    const withoutLinks = html.replace(/<link[^>]+href=["']style\.css["'][^>]*>/i, "");
    return withoutLinks
      .replace("</head>", `<style>${css}</style></head>`)
      .replace("</body>", `<script>${js}<\/script></body>`);
  }, [html, css, js]);

  useEffect(() => {
    if (isPython || !terminalRef.current || terminalInstance.current) return;
    const terminal = new Terminal({
      convertEol: true,
      cursorBlink: true,
      fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
      fontSize: 12,
      theme: { background: "#0d141c", foreground: "#91a9b1", cursor: "#42ddd0", green: "#67df9a", brightGreen: "#8beeb0" },
      rows: 18,
    });
    const fit = new FitAddon();
    terminal.loadAddon(fit);
    terminal.open(terminalRef.current);
    fit.fit();
    terminal.onData(sendInput);
    terminalInstance.current = terminal;
    fitAddon.current = fit;
    setTerminalReady(true);
    const resizeObserver = new ResizeObserver(() => fit.fit());
    resizeObserver.observe(terminalRef.current);
    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      terminalInstance.current = null;
    };
  }, [isPython, sendInput]);

  useEffect(() => {
    if (isPython || !terminalReady || !terminalInstance.current) return;
    terminalInstance.current.clear();
    terminalInstance.current.write(logs.map(log => {
      const color = log.startsWith("✓") ? "\x1b[32m" : log.startsWith("!") ? "\x1b[31m" : log.startsWith("$") ? "\x1b[97m" : "\x1b[37m";
      return `${color}${log}\x1b[0m\r\n`;
    }).join(""));
    fitAddon.current?.fit();
  }, [isPython, logs, terminalReady]);

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

  const statusDot = isRunning ? "bg-[#5fe29a]" : isPythonLoading || isBooting ? "bg-[#e5bd68] boot-pulse" : hasError ? "bg-[#ef8d88]" : "bg-[#607684]";

  const runProject = () => {
    if (isPython) { void python.run(); return; }
    setView("terminal");
    void run().then(() => setView("preview"));
  };

  const refresh = () => {
    if (previewUrl) {
      const iframe = document.querySelector<HTMLIFrameElement>("[data-testid='iframe-live-preview']");
      if (iframe) iframe.src = `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}refresh=${Date.now()}`;
    }
  };

  return <section className="runtime-panel flex min-h-0 flex-col border-l border-[#273341] bg-[#111a24]" data-testid="panel-runtime">
    <div className="flex h-[45px] shrink-0 items-center justify-between border-b border-[#273341] px-3">
      {!isPython && <div className="flex items-center gap-1 rounded-lg bg-[#0d151e] p-1">
        <button onClick={() => setView("preview")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold ${view === "preview" ? "bg-[#263743] text-[#d8f8f4]" : "text-[#718691]"}`} data-testid="button-view-preview"><ExternalLink size={13} /> Preview</button>
        <button onClick={() => setView("terminal")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold ${view === "terminal" ? "bg-[#263743] text-[#d8f8f4]" : "text-[#718691]"}`} data-testid="button-view-terminal"><TerminalSquare size={13} /> Terminal</button>
      </div>}
      {isPython && <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-[#8aa6ad]"><span className="file-py">PY</span> Python · Pyodide</div>}
      <div className="flex items-center gap-1">
        {isRunning ? <button onClick={stop} disabled={isPython} className="rounded-md p-2 text-[#f28c83] hover:bg-[#2c2229] disabled:cursor-not-allowed disabled:opacity-40" title="Stop runtime" data-testid="button-stop-runtime"><CircleStop size={15} /></button> : <button onClick={runProject} disabled={isPythonLoading || isBooting} className="rounded-md bg-[#44ded1] p-2 text-[#102128] shadow-[0_0_16px_rgba(68,222,209,.14)] hover:bg-[#64eee3] disabled:cursor-wait disabled:opacity-50" title="Run project" data-testid="button-run-project"><Play size={14} fill="currentColor" /></button>}
        {!isPython && <button onClick={refresh} disabled={!previewUrl} className="rounded-md p-2 text-[#718794] hover:bg-[#202f3a] hover:text-[#b9e9e2] disabled:opacity-40" title="Refresh preview" data-testid="button-refresh-preview"><RefreshCw size={14} /></button>}
      </div>
    </div>
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-[#202d39] px-4 py-2 text-[11px] text-[#77909b]">
        <span className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />{statusLabel}</span>
        <span className="flex items-center gap-1">{isPython ? "pyodide" : previewUrl ? "webcontainer" : "localhost"} <ChevronDown size={12} /></span>
      </div>
      {isPython ? <div className="thin-scroll min-h-0 flex-1 overflow-y-auto bg-[#0d141d] p-4" data-testid="python-output">
        <div className="mb-3 flex items-center justify-between border-b border-[#24323d] pb-3 text-[10px] uppercase tracking-[.14em] text-[#5c7580]"><span>python · workspace</span><button onClick={python.clearLogs} title="Clear output" data-testid="button-clear-python"><X size={13} /></button></div>
        <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-[#9fb5bd]">{python.logs.length ? python.logs.join("\n") : "Run main.py to see the output here."}</pre>
      </div> : view === "preview" ? <div className="relative min-h-0 flex-1 bg-[#d9cbb5] p-3 sm:p-5">
        {!isRunning && !hasError && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#17232d]/90 p-8 text-center backdrop-blur-[2px]">
          <div className="max-w-[260px]">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#385661] bg-[#20333c] text-[#4be0d3]">{isBooting ? <LoaderCircle size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}</div>
            <h3 className="m-0 text-[15px] font-bold text-[#deefef]">{isBooting ? "Warming up your workspace" : hasError ? "Browser runtime unavailable" : state === "stopped" ? "Preview paused" : "Your canvas is ready"}</h3>
            <p className="mb-5 mt-2 text-xs leading-5 text-[#8da4a9]">{isBooting ? "The in-browser Node.js runtime takes a moment on first load." : hasError ? "You can still use the editor and local preview. Try Run again after checking browser support." : "Run the project to see your page here. Changes will sync into the workspace."}</p>
            {!isBooting && <button onClick={runProject} className="rounded-lg bg-[#43ded1] px-4 py-2 text-xs font-bold text-[#102128]" data-testid="button-run-empty-state">Run project <Play className="ml-1 inline" size={12} fill="currentColor" /></button>}
          </div>
        </div>}
        {hasError && <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-3 rounded-lg border border-[#6b4548] bg-[#251f28]/95 px-3 py-2 text-[11px] text-[#e5b0aa] shadow-xl backdrop-blur">
          <span><strong className="text-[#f2c3bc]">Browser runtime unavailable.</strong> Showing local preview instead.</span>
          <button onClick={runProject} className="shrink-0 rounded bg-[#3fd9cd] px-2.5 py-1 font-bold text-[#102027]" data-testid="button-retry-runtime">Retry</button>
        </div>}
        <iframe title="Project preview" src={previewUrl || undefined} srcDoc={previewUrl ? undefined : fallbackSrcDoc} className="h-full w-full rounded-lg border border-[#b3a28c] bg-[#faf1e2] shadow-[0_12px_32px_rgba(79,57,37,.2)]" sandbox="allow-scripts allow-forms" data-testid="iframe-live-preview" />
      </div> : <div className="thin-scroll min-h-0 flex-1 overflow-y-auto bg-[#0d141c] p-4" data-testid="terminal-output">
        <div className="mb-3 flex items-center justify-between border-b border-[#24323d] pb-3 text-[10px] uppercase tracking-[.14em] text-[#5c7580]"><span>node · workspace</span><button onClick={clearLogs} title="Clear terminal" data-testid="button-clear-terminal"><X size={13} /></button></div>
        <div ref={terminalRef} className="h-[calc(100%-32px)] min-h-[260px] w-full overflow-hidden" />
      </div>}
    </div>
    <div className="flex shrink-0 items-center gap-2 border-t border-[#273341] px-4 py-2 text-[10px] text-[#617883]"><Check size={13} className="text-[#55d894]" /> Files persisted automatically <span className="ml-auto">{isPython ? "Python in browser" : "Node.js in browser"}</span></div>
  </section>;
}
