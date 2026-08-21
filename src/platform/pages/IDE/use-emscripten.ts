"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectFile } from "./types";

export type EmState = "idle" | "loading" | "ready" | "running" | "error";

const RUNNER_URL = "/runtimes/emcc/runner.mjs";

type RunnerHandle = {
  compileAndRun: (sources: { name: string; content: string }[]) => Promise<{ output: string }>;
};

type EmWindow = Window & {
  __emccRunner?: RunnerHandle;
};

async function loadRunner(): Promise<RunnerHandle> {
  const win = window as unknown as EmWindow;
  if (win.__emccRunner) return win.__emccRunner;
  const mod = await import(/* webpackIgnore: true */ RUNNER_URL);
  const handle = (await mod.createRunner()) as RunnerHandle;
  win.__emccRunner = handle;
  return handle;
}

export function useEmscripten(files: ProjectFile[], enabled: boolean, language: "c" | "cpp") {
  const [state, setState] = useState<EmState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const handleRef = useRef<RunnerHandle | null>(null);
  const loadPromiseRef = useRef<Promise<RunnerHandle> | null>(null);

  const ensureRunner = useCallback((): Promise<RunnerHandle> => {
    if (handleRef.current) return Promise.resolve(handleRef.current);
    if (!loadPromiseRef.current) {
      loadPromiseRef.current = loadRunner()
        .then((handle) => { handleRef.current = handle; return handle; })
        .catch((error) => { loadPromiseRef.current = null; throw error; });
    }
    return loadPromiseRef.current;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setState("loading");
    ensureRunner()
      .then(() => setState("ready"))
      .catch((error) => {
        setState("error");
        setLogs([`! C/C++ toolchain could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      });
  }, [enabled, ensureRunner]);

  const run = useCallback(async () => {
    if (!enabled) return;
    try {
      await ensureRunner();
    } catch (error) {
      setState("error");
      setLogs([`! C/C++ toolchain could not load: ${error instanceof Error ? error.message : "network unavailable"}`]);
      return;
    }
    const ext = language === "cpp" ? ".cpp" : ".c";
    const sources = files
      .filter((file) => file.name.endsWith(ext) || file.name.endsWith(".h") || file.name.endsWith(".hpp"))
      .map((file) => ({ name: file.id, content: file.content ?? "" }));
    setState("running");
    setLogs([language === "cpp" ? "$ clang++ *.cpp && ./a.out" : "$ clang *.c && ./a.out"]);
    let output = "";
    try {
      const result = await handleRef.current!.compileAndRun(sources);
      output = result.output;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      output += `\n${message}`;
    } finally {
      setState("ready");
    }
    const lines = output.split("\n").filter((line) => line.length > 0);
    setLogs((current) => [...current, ...lines]);
  }, [enabled, ensureRunner, files, language]);

  return { state, logs, run, clearLogs: () => setLogs([]) };
}
