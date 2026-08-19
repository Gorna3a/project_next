"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectFile } from "./types";

export type PyState = "idle" | "loading" | "ready" | "running" | "error";

const PYODIDE_VERSION = "v0.26.4";
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;
const PYODIDE_CDN = `${PYODIDE_INDEX}pyodide.js`;

interface PyodideModule {
  setStdout: (opts: { batched: (text: string) => void }) => void;
  setStderr: (opts: { batched: (text: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

interface PyodideWindow extends Window {
  loadPyodide: (opts: { indexURL: string }) => Promise<PyodideModule>;
}

export function usePyodide(files: ProjectFile[], enabled = true) {
  const [state, setState] = useState<PyState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const pyRef = useRef<PyodideModule | null>(null);
  const loadPromiseRef = useRef<Promise<PyodideModule> | null>(null);
  const runningRef = useRef(false);

  const ensurePyodide = useCallback((): Promise<PyodideModule> => {
    if (pyRef.current) return Promise.resolve(pyRef.current);
    if (!loadPromiseRef.current) {
      loadPromiseRef.current = (async () => {
        try {
          if (typeof (window as unknown as PyodideWindow).loadPyodide !== "function") {
            const script = document.createElement("script");
            script.src = PYODIDE_CDN;
            await new Promise<void>((resolve, reject) => {
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Pyodide could not be fetched from the CDN"));
              document.head.appendChild(script);
            });
          }
          const loadPyodide = (window as unknown as PyodideWindow).loadPyodide;
          const py = await loadPyodide({ indexURL: PYODIDE_INDEX });
          pyRef.current = py;
          return py;
        } catch (error) {
          loadPromiseRef.current = null;
          throw error;
        }
      })();
    }
    return loadPromiseRef.current;
  }, []);

  // Warm up the runtime as soon as the panel mounts (Python projects only).
  useEffect(() => {
    if (!enabled) return;
    setState("loading");
    ensurePyodide()
      .then(() => setState("ready"))
      .catch(error => {
        setState("error");
        setLogs([`! Pyodide could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      });
  }, [enabled, ensurePyodide]);

  const run = useCallback(async () => {
    if (runningRef.current) return;
    let py: PyodideModule;
    try {
      py = await ensurePyodide();
    } catch (error) {
      setState("error");
      setLogs([`! Pyodide could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      return;
    }

    const main = files.find(file => file.name === "main.py")?.content ?? "";
    runningRef.current = true;
    setState("running");
    setLogs(["$ python main.py"]);

    let output = "";
    try {
      py.setStdout({ batched: (text: string) => { output += text; } });
      py.setStderr({ batched: (text: string) => { output += text; } });
      await py.runPythonAsync(main);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      output += `\nTraceback: ${message}`;
    } finally {
      runningRef.current = false;
      setState("ready");
      py.setStdout({ batched: () => undefined });
      py.setStderr({ batched: () => undefined });
    }

    const lines = output.split("\n").filter(line => line.length > 0);
    setLogs(current => [...current, ...lines]);
  }, [ensurePyodide, files]);

  return { state, logs, run, clearLogs: () => setLogs([]) };
}
