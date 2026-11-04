import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OperationKind, RuntimePhase, SessionState } from "@core/simulator";

export const cn = (...inputs: ClassValue[]): string =>
  twMerge(clsx(inputs));

export const STORAGE_SPLIT_RATIO = "pixelcode-arduino-split-v2";
export const DEFAULT_SPLIT_RATIO = 0.36;
export const MIN_SPLIT_RATIO = 0.28;
export const MAX_SPLIT_RATIO = 0.45;
export const MOBILE_BREAKPOINT_PX = 900;

export const CRT_PIXEL = "font-['Press_Start_2P']";
export const CRT_SILK = "font-['Silkscreen']";
export const CRT_MONO = "font-['Space_Mono'] font-bold";
export const CRT_INK = "border-[#161616] dark:border-[#2E312A]";
export const CRT_SHADOW =
  "shadow-[4px_4px_0_0_#161616] dark:shadow-[4px_4px_0_0_#2E312A]";
export const CRT_NUDGE =
  "transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_#161616] dark:hover:shadow-[6px_6px_0_0_#2E312A]";
export const CRT_BEZEL = "bg-[#D6CFBC] dark:bg-[#0F100E]";
export const CRT_SURFACE = "bg-[#EFE9D9] dark:bg-[#1C1E1A]";
export const CRT_CHANNEL = "bg-[#161616]";
export const CRT_PHOSPHOR = "text-[#7AA800] dark:text-[#BFFF00]";
export const CRT_PHOSPHOR_BRIGHT = "text-[#A6E000] dark:text-[#BFFF00]";
export const CRT_INK_TEXT = "text-[#161616] dark:text-[#E8FFD0]";
export const CRT_MUTED = "text-[#6B6560] dark:text-[#9AB08A]";

export const PILL_STYLES: Record<
  RuntimePhase,
  { label: string; dot: string; text: string; ring: string }
> = {
  idle: { label: "IDLE", dot: "bg-[#8A867F]", text: CRT_MUTED, ring: CRT_SURFACE },
  ready: {
    label: "READY",
    dot: "bg-[#A6E000] dark:bg-[#BFFF00]",
    text: CRT_PHOSPHOR,
    ring: CRT_SURFACE,
  },
  starting: {
    label: "BUILDING",
    dot: "bg-[#E5B800] dark:bg-[#FFE600]",
    text: "text-[#C77E00] dark:text-[#FFE600]",
    ring: CRT_SURFACE,
  },
  running: {
    label: "RUNNING",
    dot: "bg-[#A6E000] dark:bg-[#BFFF00]",
    text: CRT_PHOSPHOR,
    ring: CRT_SURFACE,
  },
  paused: {
    label: "PAUSED",
    dot: "bg-[#FF6B1A]",
    text: "text-[#CC4E0E] dark:text-[#FF6B1A]",
    ring: CRT_SURFACE,
  },
  stopped: { label: "STOPPED", dot: "bg-[#8A867F]", text: CRT_MUTED, ring: CRT_SURFACE },
};

export const OPERATION_LABELS: Record<Exclude<OperationKind, null>, string> = {
  build: "COMPILING",
  upload: "UPLOADING",
  start: "STARTING SIM",
  pause: "PAUSING",
  resume: "RESUMING",
  reset: "RESETTING",
};

export const formatSimTime = (simTimeNs: number): string => {
  if (simTimeNs <= 0) return "T+0.0s";
  const totalSeconds = simTimeNs / 1e9;
  if (totalSeconds < 60) return `T+${totalSeconds.toFixed(1)}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `T+${minutes}:${seconds.toFixed(1).padStart(4, "0")}`;
};

export const formatWallTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

export const getBusy = (state: SessionState): boolean => state.operation.kind !== null;

export const isDirty = (state: SessionState): boolean =>
  state.activeHash !== null && state.draftHash !== state.activeHash;

export const canRun = (state: SessionState): boolean => !getBusy(state);
export const canPause = (state: SessionState): boolean =>
  state.runtime === "running" && !getBusy(state);
export const canResume = (state: SessionState): boolean =>
  state.runtime === "paused" && !getBusy(state);
export const canReset = (state: SessionState): boolean =>
  state.runtime !== "idle" && state.runtime !== "starting" && !getBusy(state);

export const hasBuildError = (state: SessionState): boolean =>
  state.buildError !== null ||
  state.diagnostics.some(
    (item) => item.severity === "error" && item.source === "compiler",
  );

export const DIAGNOSTIC_STYLES: Record<
  "error" | "warning",
  { icon: string; text: string; dot: string }
> = {
  error: { icon: "text-[#FF6B1A]", text: "text-[#FF6B1A]", dot: "bg-[#FF6B1A]" },
  warning: { icon: "text-[#FFE600]", text: "text-[#FFE600]", dot: "bg-[#FFE600]" },
};

export const SERIAL_LINE_STYLES: Record<"out" | "in", string> = {
  out: CRT_PHOSPHOR_BRIGHT,
  in: "text-[#FFE600]",
};
