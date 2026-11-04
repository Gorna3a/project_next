'use client';

import { Code2, Info, type LucideIcon } from "lucide-react";
import type { Diagnostic, EngineKind } from "@core/simulator";
import type { SceneDescriptor } from "./three/focus";
import { EditorPane } from "./EditorPane";
import { ComponentInspector } from "./ComponentInspector";
import { LessonOverview } from "./LessonOverview";
import {
  cn,
  CRT_INK,
  CRT_INK_TEXT,
  CRT_MONO,
  CRT_MUTED,
  CRT_PHOSPHOR,
  CRT_PIXEL,
} from "../utils/ui";

export type EditorSidebarTab = "code" | "info";

export interface EditorSidebarProps {
  activeTab: EditorSidebarTab;
  onTabChange: (tab: EditorSidebarTab) => void;
  sketch: string;
  onSketchChange: (value: string) => void;
  diagnostics: Diagnostic[];
  onRun: () => void;
  engine: EngineKind;
  selection: SceneDescriptor | null;
  onClearSelection: () => void;
  onRotateSelection: (delta: number) => void;
  onRemoveSelection: () => void;
}

export const EditorSidebar = ({
  activeTab,
  onTabChange,
  sketch,
  onSketchChange,
  diagnostics,
  onRun,
  engine,
  selection,
  onClearSelection,
  onRotateSelection,
  onRemoveSelection,
}: EditorSidebarProps) => {
  const tabs: { id: EditorSidebarTab; label: string; icon: LucideIcon }[] = [
    { id: "code", label: "Code", icon: Code2 },
    { id: "info", label: "Components", icon: Info },
  ];

  return (
    <div className={cn("aw-learning-sidebar flex h-full min-h-0 flex-col aw-stage")}>
      <LessonOverview />
      <div className="aw-editor-dock flex min-h-0 flex-1 flex-col">
        <div
          role="tablist"
          aria-label="Code and components"
          className={cn("aw-editor-tabs flex shrink-0 border-b-[3px]", CRT_INK)}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`arduino-sidebar-${tab.id}-tab`}
                aria-selected={active}
                aria-controls={`arduino-sidebar-${tab.id}-panel`}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "aw-editor-tab relative flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-3 py-2 uppercase transition-colors",
                  CRT_PIXEL,
                  active
                    ? "bg-[#161616] text-[#A6E000] dark:bg-[#161616] dark:text-[#BFFF00]"
                    : cn("bg-[#EFE9D9] dark:bg-[#1C1E1A]", CRT_MUTED),
                  tab.id === "info" &&
                    "border-s-[3px] border-[#161616] dark:border-[#2E312A]",
                )}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
                {tab.id === "info" && selection && (
                  <span
                    className={cn(
                      "h-1.5 w-1.5 border border-[#161616] bg-[#A6E000] dark:border-[#2E312A] dark:bg-[#BFFF00]",
                      active ? "opacity-100" : "animate-pulse opacity-80",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            id="arduino-sidebar-code-panel"
            role="tabpanel"
            aria-labelledby="arduino-sidebar-code-tab"
            className={cn("h-full min-h-0", activeTab !== "code" && "hidden")}
          >
            {engine === "wokwi" ? (
              <div className="flex h-full min-h-0 flex-col">
                <div className={cn("flex shrink-0 items-center border-b-[3px]", CRT_INK)}>
                  <span className={cn("text-[8px] uppercase tracking-[0.1em]", CRT_MONO, CRT_MUTED)}>
                    WOKWI MODE // PRECOMPILED FIRMWARE — SKETCHES NOT RECOMPILED YET
                  </span>
                </div>
                <div className="min-h-0 flex-1">
                  <EditorPane
                    sketch={sketch}
                    onSketchChange={onSketchChange}
                    diagnostics={diagnostics}
                    onRun={onRun}
                    compact
                  />
                </div>
              </div>
            ) : (
              <EditorPane
                sketch={sketch}
                onSketchChange={onSketchChange}
                diagnostics={diagnostics}
                onRun={onRun}
                compact
              />
            )}
          </div>

          <div
            id="arduino-sidebar-info-panel"
            role="tabpanel"
            aria-labelledby="arduino-sidebar-info-tab"
            className={cn("h-full min-h-0", activeTab !== "info" && "hidden")}
          >
            {engine === "wokwi" ? (
              <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4">
                <p className={cn("text-[8px] uppercase tracking-[0.1em]", CRT_PIXEL, CRT_INK_TEXT)}>WOKWI // CONTEXT</p>
                <div className="mt-5 max-w-[280px]">
                  <p className={cn("text-[10px] leading-relaxed", CRT_MONO, CRT_MUTED)}>
                    THE WOKWI EMBED IS CONNECTED TO THE BOARD AND RUNNING THE FIRMWARE YOU UPLOADED. EDITOR SKETCHES ARE NOT RECOMPILED BY WOKWI YET.
                  </p>
                  <p className={cn("mt-4 border-t-[3px] pt-3 text-[8px] uppercase leading-relaxed tracking-[0.08em]", CRT_INK, CRT_MUTED)}>
                    ENGINE: WOKWI EMBED · BOARD: UNO R3 · FIRMWARE: PRECOMPILED
                  </p>
                </div>
              </div>
            ) : (
              <ComponentInspector
                selection={selection}
                onClear={onClearSelection}
                onRotate={onRotateSelection}
                onRemove={onRemoveSelection}
              />
            )}
          </div>
        </div>

        <div
          className={cn(
            "aw-editor-foot flex shrink-0 items-center justify-between gap-2 border-t-[3px] px-2 py-1 uppercase tracking-[0.08em]",
            CRT_INK,
            CRT_MONO,
            CRT_MUTED,
          )}
        >
          <span>{activeTab === "code" ? "MONACO // C++" : "SCENE // COMPONENTS"}</span>
          <span className={CRT_PHOSPHOR}>
            {activeTab === "code"
              ? engine === "wokwi"
                ? "WOKWI // PRECOMPILED FIRMWARE"
                : "CTRL/CMD+S RUN"
              : "LIVE PARTS"}
          </span>
        </div>
      </div>
    </div>
  );
};
