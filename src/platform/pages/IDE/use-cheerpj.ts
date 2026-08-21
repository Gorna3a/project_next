"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectFile } from "./types";

export type CheerpJState = "idle" | "loading" | "ready" | "running" | "error";

const CHEERPJ_CDN = "https://cjrtnc.leaningtech.com/4.3/loader.js";

const CheerpJWindow = window as unknown as {
  cheerpjInit?: (opts?: unknown) => Promise<void>;
  cheerpjRunMain?: (main: string, args: string[]) => Promise<number>;
  cheerpjAddStringFile?: (path: string, data: string) => void;
  cjImport?: (name: string) => Promise<unknown>;
};

export function useCheerpj(files: ProjectFile[], enabled: boolean) {
  const [state, setState] = useState<CheerpJState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const readyRef = useRef(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const ensureReady = useCallback((): Promise<void> => {
    if (readyRef.current) return Promise.resolve();
    if (!initPromiseRef.current) {
      initPromiseRef.current = (async () => {
        if (typeof CheerpJWindow.cheerpjInit !== "function") {
          const script = document.createElement("script");
          script.src = CHEERPJ_CDN;
          script.async = true;
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("CheerpJ failed to load from the CDN"));
            document.head.appendChild(script);
          });
        }
        try {
          await CheerpJWindow.cheerpjInit?.({});
        } catch (error) {
          // CheerpJ may already be initialized (auto-init on load or a
          // concurrent init); treat that as success rather than a hard failure.
          const message = error instanceof Error ? error.message : String(error);
          if (!/already initialized/i.test(message)) throw error;
        }
        readyRef.current = true;
      })().catch((error) => {
        initPromiseRef.current = null;
        throw error;
      });
    }
    return initPromiseRef.current;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setState("loading");
    ensureReady()
      .then(() => setState("ready"))
      .catch((error) => {
        setState("error");
        setLogs([`! CheerpJ could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      });
  }, [enabled, ensureReady]);

  const run = useCallback(async () => {
    if (!enabled) return;
    try {
      await ensureReady();
    } catch (error) {
      setState("error");
      setLogs([`! CheerpJ could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      return;
    }
    const javaFiles = files.filter((file) => file.name.endsWith(".java") && file.content != null);
    if (!javaFiles.length) {
      setLogs(["$ java Main.java", "No .java files found."]);
      return;
    }
    setState("running");
    setLogs(["$ javac *.java && java Main"]);
    let output = "";
    const originalLog = console.log;
    const originalError = console.error;
    const capture = (...args: unknown[]) => {
      output += args.map((a) => String(a)).join(" ") + "\n";
    };
    console.log = (...args: unknown[]) => { capture(...args); originalLog(...args); };
    console.error = (...args: unknown[]) => { capture(...args); originalError(...args); };
    try {
      for (const file of javaFiles) {
        CheerpJWindow.cheerpjAddStringFile?.(`/str/${file.name}`, file.content ?? "");
      }
      const main = javaFiles.find((f) => f.name === "Main.java") ?? javaFiles[0];
      const className = main.name.replace(/\.java$/, "");
      await CheerpJWindow.cheerpjRunMain?.("com.sun.tools.javac.Main", [main.name]);
      await CheerpJWindow.cheerpjRunMain?.(className, []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      output += `\n${message}`;
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setState("ready");
    }
    const lines = output.split("\n").filter((line) => line.length > 0);
    setLogs((current) => [...current, ...lines]);
  }, [enabled, ensureReady, files]);

  return { state, logs, run, clearLogs: () => setLogs([]) };
}
