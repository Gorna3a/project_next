"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Nodepod, type NodepodProcess } from "@scelar/nodepod";
import type { ProjectFile } from "./types";

export type ContainerState = "booting" | "ready" | "running" | "stopped" | "error";

const WORKDIR = "/project";

let pod: Nodepod | null = null;
let bootPromise: Promise<Nodepod> | null = null;
let serverReadyHandler: ((port: number, url: string) => void) | null = null;

const absolutePath = (file: ProjectFile) =>
  `${WORKDIR}/${file.parent ? `${file.parent}/` : ""}${file.name}`;

// Ensures the Nodepod service worker is active and controlling this page
// before we point the preview iframe at a /__virtual__ URL. Without this, the
// first preview navigation can race ahead of the SW and fall through to Next
// (404 / blocked by COEP on refresh or first load).
const ensureServiceWorkerReady = async () => {
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.ready;
    } catch {
      // SW unavailable — the preview falls back to the static srcDoc.
    }
  }
};

// One runtime per page. Nodepod is reused across project switches; files are
// re-synced before every run so the latest editor contents are live.
export function ensurePod(): Promise<Nodepod> {
  if (pod) return Promise.resolve(pod);
  if (!bootPromise) {
    bootPromise = Nodepod.boot({
      files: {},
      workdir: WORKDIR,
      watermark: false,
      // Nodepod hardcodes /__sw__.js for the service-worker registration
      // (it does not honor this option in 1.9.20). A rewrite in next.config.ts
      // maps /__sw__.js -> /sw.js, which is where the SW actually lives.
      swUrl: "/__sw__.js",
      allowedFetchDomains: null,
      preloadEsbuild: true,
      onServerReady: (port, url) => serverReadyHandler?.(port, url),
    })
      .then(instance => {
        pod = instance;
        return instance;
      })
      .catch(error => {
        bootPromise = null;
        throw error;
      });
  }
  return bootPromise;
}

async function syncFiles(files: ProjectFile[]) {
  const instance = await ensurePod();
  for (const file of files) {
    if (file.kind === "folder") continue;
    const path = absolutePath(file);
    await instance.fs.mkdir(path.slice(0, path.lastIndexOf("/")), { recursive: true });
    await instance.fs.writeFile(path, file.content ?? "");
  }
}

type UseNodepodOptions = {
  /** Only boot the runtime for web projects; Python runs on Pyodide instead. */
  enabled?: boolean;
  /** Stream raw process output (for the terminal view). */
  onOutput?: (chunk: string, isError: boolean) => void;
};

export function useNodepod(files: ProjectFile[], options: UseNodepodOptions = {}) {
  const { enabled = true, onOutput } = options;
  const [state, setState] = useState<ContainerState>("booting");
  const [logs, setLogs] = useState<string[]>(["$ studio boot", "Starting an in-browser Node.js workspace…"]);
  const [previewUrl, setPreviewUrl] = useState("");
  const processRef = useRef<NodepodProcess | null>(null);
  const outputRef = useRef(onOutput);
  outputRef.current = onOutput;

  const appendLog = useCallback((line: string) => {
    setLogs(current => [...current, line]);
  }, []);

  const streamChunk = useCallback((chunk: string, isError: boolean) => {
    const text = chunk.trimEnd();
    if (text) appendLog(text);
    outputRef.current?.(chunk, isError);
  }, [appendLog]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    ensurePod()
      .then(() => {
        if (cancelled) return;
        setState("ready");
        appendLog("✓ Node.js workspace ready");
      })
      .catch(error => {
        if (!cancelled) {
          setState("error");
          appendLog(`! Nodepod could not boot: ${error instanceof Error ? error.message : "browser support is unavailable"}`);
        }
      });
    return () => { cancelled = true; };
  }, [appendLog, enabled]);

  useEffect(() => {
    serverReadyHandler = async (_port, url) => {
      await ensureServiceWorkerReady();
      setPreviewUrl(url);
      setState("running");
      appendLog(`✓ Preview ready at ${url}`);
    };
    return () => {
      if (serverReadyHandler) serverReadyHandler = null;
    };
  }, [appendLog]);

  const run = useCallback(async () => {
    try {
      const instance = await ensurePod();
      setState("running");
      setPreviewUrl("");
      setLogs(["$ sync files", "Writing project into the browser workspace…"]);
      await syncFiles(files);

      const hasManifest = files.some(file => file.name === "package.json");
      if (hasManifest) {
        setLogs(["$ install", "Resolving project dependencies…"]);
        await instance.packages.installFromManifest(`${WORKDIR}/package.json`, { withDevDeps: true });
      }

      appendLog("$ npm run dev");
      const dev = await instance.spawn("npm", ["run", "dev"]);
      processRef.current = dev;
      dev.on("output", chunk => streamChunk(chunk, false));
      dev.on("error", chunk => streamChunk(chunk, true));
      dev.on("exit", code => {
        if (processRef.current === dev) processRef.current = null;
        if (code !== 0) appendLog(`! dev server exited with code ${code}`);
      });
    } catch (error) {
      setState("error");
      appendLog(`! Run failed: ${error instanceof Error ? error.message : "browser runtime unavailable"}`);
    }
  }, [appendLog, files, streamChunk]);

  const stop = useCallback(() => {
    processRef.current?.kill();
    processRef.current = null;
    setPreviewUrl("");
    setState("stopped");
    appendLog("$ process stopped");
  }, [appendLog]);

  return { state, logs, previewUrl, run, stop, clearLogs: () => setLogs([]) };
}
