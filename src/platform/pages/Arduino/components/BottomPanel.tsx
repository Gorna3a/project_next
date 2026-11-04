'use client';

import { ChevronDown, Terminal, Trash2 } from "lucide-react";
import type { SessionState } from "@core/simulator";
import { cn, DIAGNOSTIC_STYLES, CRT_PIXEL, CRT_INK, CRT_MONO } from "../utils/ui";
import { SerialConsole } from "./SerialConsole";
import { DiagnosticsPanel } from "./DiagnosticsPanel";

export type BottomTab = "serial" | "diagnostics";

interface BottomPanelProps {
  state: SessionState;
  tab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
  onClearSerial: () => void;
  onClearDiagnostics: () => void;
}

export const BottomPanel = ({
  state,
  tab,
  onTabChange,
  expanded,
  onToggleExpanded,
  onClearSerial,
  onClearDiagnostics,
}: BottomPanelProps) => {
  const errorCount = state.diagnostics.filter((item) => item.severity === "error").length;
  const warnCount = state.diagnostics.length - errorCount;

  const tabs: { id: BottomTab; label: string; icon: typeof Terminal; badge?: string; badgeClass?: string }[] = [
    { id: "serial", label: "Serial", icon: Terminal, badge: state.serial.length > 0 ? String(state.serial.length) : undefined },
    {
      id: "diagnostics",
      label: "Errors",
      icon: Trash2,
      badge: state.diagnostics.length > 0 ? String(state.diagnostics.length) : undefined,
      badgeClass: errorCount > 0 ? DIAGNOSTIC_STYLES.error.text : DIAGNOSTIC_STYLES.warning.text,
    },
  ];

  return (
    <div
      className={cn(
        "aw-console flex shrink-0 flex-col border-t-[3px] transition-[height] duration-150",
        CRT_INK,
        expanded ? "h-56" : "h-10",
      )}
    >
      <div className="aw-console-head flex h-10 shrink-0 items-center gap-1 border-b-[3px] px-2">
        {tabs.map((entry) => {
          const active = tab === entry.id && expanded;
          return (
            <button
              key={entry.id}
              onClick={() => {
                if (tab === entry.id && expanded) onToggleExpanded();
                else {
                  onTabChange(entry.id);
                  if (!expanded) onToggleExpanded();
                }
              }}
              className={cn(
                "aw-console-tab inline-flex items-center gap-1.5 rounded-none uppercase transition-colors",
                CRT_PIXEL,
                active && "is-active",
                active
                  ? "bg-[#2E312A] text-[#BFFF00] shadow-[3px_3px_0_0_#0F100E]"
                  : "text-[#6E7D5E] hover:bg-[#101208] hover:text-[#9AB08A]",
              )}
            >
              {errorCount > 0 && entry.id === "diagnostics" ? (
                <span className={cn("h-1.5 w-1.5 rounded-none", DIAGNOSTIC_STYLES.error.dot)} />
              ) : (
                <entry.icon className="h-3.5 w-3.5" />
              )}
              {entry.label}
              {entry.badge !== undefined && (
                <span
                  className={cn(
                    "rounded-none bg-[#0F100E] px-1 text-[9px] tabular-nums",
                    CRT_MONO,
                    entry.badgeClass ?? "text-[#9AB08A]",
                  )}
                >
                  {entry.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-1">
          {expanded && warnCount > 0 && errorCount > 0 && (
            <span className={cn("mr-1 hidden text-[9px] uppercase tracking-[0.14em] text-[#6E7D5E] sm:inline", CRT_MONO)}>
              {errorCount} err · {warnCount} warn
            </span>
          )}
          {expanded && (
            <button
              onClick={() => (tab === "serial" ? onClearSerial() : onClearDiagnostics())}
              className="grid h-7 w-7 place-items-center rounded-none text-[#6E7D5E] transition-colors hover:bg-[#101208] hover:text-[#FF6B1A]"
              title={tab === "serial" ? "Clear serial buffer" : "Clear diagnostics"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onToggleExpanded}
            className="grid h-7 w-7 place-items-center rounded-none text-[#6E7D5E] transition-colors hover:bg-[#101208] hover:text-[#A6E000]"
            title={expanded ? "Collapse panel" : "Expand panel"}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", !expanded && "rotate-180")} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="min-h-0 flex-1">
          {tab === "serial" ? (
            <SerialConsole feed={state.serial} onClear={onClearSerial} />
          ) : (
            <DiagnosticsPanel diagnostics={state.diagnostics} onClear={onClearDiagnostics} />
          )}
        </div>
      )}
    </div>
  );
};
