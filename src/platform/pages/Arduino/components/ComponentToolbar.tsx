'use client';

import {
  BENCH_PART_ORDER,
  BENCH_PART_SPECS,
  type BenchComponentKind,
  type BenchTool,
} from "./three/bench";
import {
  cn,
  CRT_INK,
  CRT_INK_TEXT,
  CRT_MONO,
  CRT_MUTED,
  CRT_PIXEL,
  CRT_SURFACE,
} from "../utils/ui";

export interface ComponentToolbarProps {
  tool: BenchTool;
  placementKind: BenchComponentKind | null;
  partCount: number;
  onToolChange: (tool: "select" | "wire") => void;
  onStartPlacement: (kind: BenchComponentKind) => void;
  onCancelPlacement: () => void;
}

const toolButton = cn(
  "aw-tool-button rounded-none border px-3 py-1 uppercase tracking-[0.06em]",
  CRT_PIXEL,
  CRT_INK,
  "bg-[#EFE9D9] text-[#161616] shadow-[2px_2px_0_0_#161616] dark:bg-[#1C1E1A] dark:text-[#E8FFD0] dark:shadow-[2px_2px_0_0_#2E312A]",
  "cursor-pointer transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_#161616] dark:hover:shadow-[3px_3px_0_0_#2E312A]",
);

const activeButton = cn(
  "aw-tool-active bg-[#A6E000] text-[#161616] dark:bg-[#BFFF00] dark:text-[#161616]",
);

export const ComponentToolbar = ({
  tool,
  placementKind,
  partCount,
  onToolChange,
  onStartPlacement,
  onCancelPlacement,
}: ComponentToolbarProps) => {
  const placing = tool === "place" && placementKind !== null;

  return (
    <div
      className={cn(
        "aw-part-toolbar flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-3 py-2",
        CRT_INK,
        CRT_SURFACE,
      )}
    >
      <span className={cn("aw-toolbar-label uppercase tracking-[0.08em]", CRT_INK_TEXT)}>
        TOOL
      </span>

      <div className="flex items-center gap-1.5" role="group" aria-label="Bench tool">
        <button
          type="button"
          aria-pressed={tool === "select"}
          onClick={() => onToolChange("select")}
          className={cn(toolButton, tool === "select" && activeButton)}
        >
          Select
        </button>
        <button
          type="button"
          aria-pressed={tool === "wire"}
          onClick={() => onToolChange("wire")}
          className={cn(toolButton, tool === "wire" && activeButton)}
        >
          Wire
        </button>
      </div>

      <span
        className={cn(
          "inline-block h-4 w-[2px] shrink-0 bg-[#161616] dark:bg-[#2E312A]",
        )}
      />

      <span className={cn("aw-toolbar-label uppercase tracking-[0.08em]", CRT_INK_TEXT)}>
        PARTS
      </span>

      <div className="flex items-center gap-1.5" role="group" aria-label="Place a component">
        {BENCH_PART_ORDER.map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={placing && placementKind === kind}
            onClick={() => onStartPlacement(kind)}
            className={cn(
              toolButton,
              placing && placementKind === kind && activeButton,
            )}
          >
            + {BENCH_PART_SPECS[kind].shortLabel}
          </button>
        ))}
      </div>

      {placing && (
        <button
          type="button"
          onClick={onCancelPlacement}
          className={cn(toolButton, "text-[#CC4E0E] dark:text-[#FF6B1A]")}
        >
          Cancel
        </button>
      )}

      <span
        className={cn(
          "aw-part-count ml-auto uppercase tracking-[0.1em]",
          CRT_MONO,
          CRT_MUTED,
        )}
      >
        {placing && placementKind
          ? `PLACING ${BENCH_PART_SPECS[placementKind].shortLabel.toUpperCase()}`
          : `PARTS ${String(partCount).padStart(2, "0")}`}
      </span>
    </div>
  );
};
