"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer, type FileSystemTree, type WebContainerProcess } from "@webcontainer/api";
import type { ProjectFile } from "./types";

export type ContainerState = "booting" | "ready" | "running" | "stopped" | "error";

let container: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

function pathFor(file: ProjectFile) {
  return file.parent ? `${file.parent}/${file.name}` : file.name;
}

function toFileSystemTree(files: ProjectFile[]): FileSystemTree {
  const tree: FileSystemTree = {};
  for (const file of files) {
    const path = pathFor(file);
    const segments = path.split("/");
    let current = tree;
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      if (isLast) {
        if (file.kind === "folder") current[segment] = { directory: {} };
        else current[segment] = { file: { contents: file.content ?? "" } };
        return;
      }
      const existing = current[segment];
      if (!existing || !("directory" in existing)) {
        current[segment] = { directory: {} };
      }
      current = (current[segment] as { directory: FileSystemTree }).directory;
    });
  }
  return tree;
}

export function useWebContainer(files: ProjectFile[]) {
  const [state, setState] = useState<ContainerState>("booting");
  const [logs, setLogs] = useState<string[]>(["$ studio boot", "Starting an in-browser Node.js workspace…"]);
  const [previewUrl, setPreviewUrl] = useState("");
  const processRef = useRef<WebContainerProcess | null>(null);
  const mountedRef = useRef(false);

  const appendLog = useCallback((line: string) => {
    setLogs(current => [...current, line]);
  }, []);

  const boot = useCallback(async () => {
    if (container) return container;
    if (!bootPromise) {
      bootPromise = WebContainer.boot({
        // Cross-origin isolation headers are set for /app/ide in next.config.ts,
        // so the shared-memory Node.js runtime can boot inside the preview.
        coep: "credentialless",
        forwardPreviewErrors: "exceptions-only",
        workdirName: "first-light",
      }).then(instance => {
        container = instance;
        return instance;
      }).catch(error => {
        bootPromise = null;
        throw error;
      });
    }
    return bootPromise;
  }, []);

  useEffect(() => {
    let cancelled = false;
    boot()
      .then(instance => {
        if (cancelled) return;
        instance.on("server-ready", (_port, url) => {
          setPreviewUrl(url);
          setState("running");
          appendLog(`✓ Preview ready at ${url}`);
        });
        setState("ready");
        appendLog("✓ Node.js workspace ready");
      })
      .catch(error => {
        if (!cancelled) {
          setState("error");
          appendLog(`! WebContainer could not boot: ${error instanceof Error ? error.message : "browser support is unavailable"}`);
        }
      });
    return () => { cancelled = true; };
  }, [appendLog, boot]);

  useEffect(() => {
    if (!container || !mountedRef.current) return;
    container.mount(toFileSystemTree(files)).catch(error => {
      appendLog(`! Filesystem sync failed: ${error instanceof Error ? error.message : "unknown error"}`);
    });
  }, [appendLog, files]);

  const run = useCallback(async () => {
    try {
      const instance = await boot();
      setState("running");
      setPreviewUrl("");
      setLogs(["$ npm install", "Resolving project dependencies…"]);
      await instance.mount(toFileSystemTree(files));
      mountedRef.current = true;
      const install = await instance.spawn("npm", ["install"]);
      processRef.current = install;
      install.output.pipeTo(new WritableStream({ write: chunk => appendLog(chunk.trimEnd()) })).catch(() => undefined);
      const installExit = await install.exit;
      if (installExit !== 0) {
        setState("error");
        appendLog(`! npm install exited with code ${installExit}`);
        return;
      }
      appendLog("$ npm run dev");
      const dev = await instance.spawn("npm", ["run", "dev"]);
      processRef.current = dev;
      dev.output.pipeTo(new WritableStream({ write: chunk => appendLog(chunk.trimEnd()) })).catch(() => undefined);
    } catch (error) {
      setState("error");
      appendLog(`! Run failed: ${error instanceof Error ? error.message : "browser runtime unavailable"}`);
    }
  }, [appendLog, boot, files]);

  const stop = useCallback(() => {
    processRef.current?.kill();
    processRef.current = null;
    setPreviewUrl("");
    setState("stopped");
    appendLog("$ process stopped");
  }, [appendLog]);

  const sendInput = useCallback((input: string) => {
    const writer = processRef.current?.input.getWriter();
    if (!writer) return;
    void writer.write(input).finally(() => writer.releaseLock());
  }, []);

  return { state, logs, previewUrl, run, stop, sendInput, clearLogs: () => setLogs([]) };
}
