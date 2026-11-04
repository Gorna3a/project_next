'use client';

import { Loader2 } from "lucide-react";
import type { SessionState } from "@core/simulator";
import {
  cn,
  OPERATION_LABELS,
  PILL_STYLES,
  CRT_PIXEL,
  CRT_INK,
  CRT_SHADOW,
} from "../utils/ui";

interface StatusPillProps {
  state: SessionState;
  className?: string;
}

export const StatusPill = ({ state, className }: StatusPillProps) => {
  const styles = PILL_STYLES[state.runtime];
  const busy = state.operation.kind !== null;
  const label = busy ? OPERATION_LABELS[state.operation.kind as "build"] : styles.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-none border-[3px] px-2 py-1 text-[8px] uppercase tracking-[0.08em] whitespace-nowrap",
        CRT_PIXEL,
        CRT_INK,
        CRT_SHADOW,
        styles.ring,
        styles.text,
        className,
      )}
      title={busy ? `Operation: ${state.operation.kind}` : `Runtime: ${state.runtime}`}
    >
      {busy ? (
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
      ) : (
        <span
          className={cn("h-1.5 w-1.5 rounded-none", styles.dot, state.runtime === "running" && "animate-pulse")}
        />
      )}
      {label}
    </span>
  );
};
