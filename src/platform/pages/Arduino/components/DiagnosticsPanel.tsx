'use client';

import { AlertCircle, AlertTriangle } from "lucide-react";
import type { Diagnostic } from "@core/simulator";
import { cn, DIAGNOSTIC_STYLES, formatWallTime, CRT_MONO } from "../utils/ui";

interface DiagnosticsPanelProps {
  diagnostics: Diagnostic[];
  onClear: () => void;
}

export const DiagnosticsPanel = ({ diagnostics, onClear }: DiagnosticsPanelProps) => {
  if (diagnostics.length === 0) {
    return (
      <div className="grid h-full place-items-center px-4">
        <p
          className={cn(
            "max-w-[440px] text-center text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#6E7D5E]",
            CRT_MONO,
          )}
        >
          {"> NO DIAGNOSTICS — BUILD PIPELINE CLEAN"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {diagnostics.map((item) => {
          const styles = DIAGNOSTIC_STYLES[item.severity];
          return (
            <div
              key={item.id}
              className="flex items-baseline gap-2 border-b border-[#2E312A]/60 py-1.5 last:border-b-0"
            >
              {item.severity === "error" ? (
                <AlertCircle className={cn("h-3.5 w-3.5 shrink-0 self-center", styles.icon)} />
              ) : (
                <AlertTriangle className={cn("h-3.5 w-3.5 shrink-0 self-center", styles.icon)} />
              )}
              <span className={cn("min-w-0 text-[11px] leading-[1.5]", CRT_MONO, styles.text)}>
                {item.message}
              </span>
              <span
                className={cn(
                  "ml-auto hidden shrink-0 rounded-none bg-[#0F100E] px-1.5 text-[9px] uppercase tracking-[0.12em] text-[#9AB08A] sm:inline",
                  CRT_MONO,
                )}
              >
                {item.source}
              </span>
              <span className={cn("hidden shrink-0 text-[10px] tabular-nums text-[#4E5A3F] md:inline", CRT_MONO)}>
                {formatWallTime(item.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex shrink-0 justify-end border-t-[3px] border-[#2E312A] py-1">
        <button
          onClick={onClear}
          className={cn("px-3 text-[9px] uppercase tracking-[0.16em] text-[#6E7D5E] transition-colors hover:text-[#FF6B1A]", CRT_MONO)}
        >
          clear
        </button>
      </div>
    </div>
  );
};
