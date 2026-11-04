'use client';

import { RotateCcw, RotateCw, Trash2, X } from "lucide-react";
import type { SceneDescriptor } from "./three/focus";
import {
  cn,
  CRT_INK,
  CRT_INK_TEXT,
  CRT_MONO,
  CRT_MUTED,
  CRT_PHOSPHOR,
  CRT_PIXEL,
  CRT_SURFACE,
} from "../utils/ui";

export interface ComponentInspectorProps {
  selection: SceneDescriptor | null;
  onClear: () => void;
  onRotate: (delta: number) => void;
  onRemove: () => void;
}

const actionButton = cn(
  "inline-flex items-center justify-center gap-1.5 rounded-none border-[3px] px-2 py-1 text-[7px] uppercase tracking-[0.06em]",
  CRT_PIXEL,
  CRT_INK,
  "bg-[#EFE9D9] text-[#161616] shadow-[2px_2px_0_0_#161616] transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_#161616] dark:bg-[#1C1E1A] dark:text-[#E8FFD0] dark:shadow-[2px_2px_0_0_#2E312A] dark:hover:shadow-[3px_3px_0_0_#2E312A]",
);

export const ComponentInspector = ({
  selection,
  onClear,
  onRotate,
  onRemove,
}: ComponentInspectorProps) => {
  if (!selection) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4">
        <p
          className={cn(
            "text-[8px] uppercase tracking-[0.1em]",
            CRT_PIXEL,
            CRT_INK_TEXT,
          )}
        >
          COMPONENT INFO
        </p>
        <div className="mt-5 max-w-[280px]">
          <p className={cn("text-[10px] leading-relaxed", CRT_MONO, CRT_MUTED)}>
            CLICK A PART TO INSPECT AND FOCUS IT. DRAG TO MOVE; USE THIS PANEL
            TO ROTATE OR REMOVE IT.
          </p>
          <p
            className={cn(
              "mt-4 border-t-[3px] pt-3 text-[8px] uppercase leading-relaxed tracking-[0.08em]",
              CRT_INK,
              CRT_MUTED,
            )}
          >
            WIRE MODE OWNS PIN AND TIE-POINT CLICKS. SELECT MODE OWNS COMPONENT
            EDITING AND CAMERA ROAM.
          </p>
        </div>
      </div>
    );
  }

  const degrees = Math.round(
    (((selection.rotationY * 180) / Math.PI) % 360 + 360) % 360,
  );
  const isPart = selection.kind === "part";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          "flex shrink-0 items-start justify-between gap-3 border-b-[3px] px-3 py-2",
          CRT_INK,
          CRT_SURFACE,
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[7px] uppercase tracking-[0.1em]",
              CRT_PIXEL,
              CRT_PHOSPHOR,
            )}
          >
            {selection.category}
          </p>
          <h3
            className={cn(
              "mt-1 truncate text-[11px] uppercase tracking-[0.04em]",
              CRT_MONO,
              CRT_INK_TEXT,
            )}
          >
            {selection.label}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Close component info"
          className={cn(
            "grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-none border-[3px]",
            CRT_INK,
            "bg-[#EFE9D9] text-[#161616] transition-colors hover:bg-[#FFE600] dark:bg-[#1C1E1A] dark:text-[#E8FFD0] dark:hover:bg-[#FFE600] dark:hover:text-[#161616]",
          )}
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className={cn("text-[8px] uppercase tracking-[0.1em]", CRT_PHOSPHOR)}>
          {selection.tooltip}
        </p>
        <p className={cn("text-[10px] leading-relaxed", CRT_MONO, CRT_MUTED)}>
          {selection.description}
        </p>

        <div className="mt-3 grid gap-1">
          {selection.specs.map((spec) => (
            <div
              key={spec}
              className={cn(
                "flex items-center gap-2 border-s-[3px] border-[#A6E000] ps-2 text-[8px] uppercase tracking-[0.08em] dark:border-[#BFFF00]",
                CRT_MONO,
                CRT_INK_TEXT,
              )}
            >
              <span className={cn("text-[#7AA800] dark:text-[#BFFF00]")}>+</span>
              {spec}
            </div>
          ))}
        </div>

        <div
          className={cn(
            "mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-t-[3px] pt-3 text-[8px] uppercase tracking-[0.08em]",
            CRT_INK,
            CRT_MONO,
            CRT_MUTED,
          )}
        >
          <span>POS X</span>
          <span className={cn("text-right", CRT_INK_TEXT)}>
            {selection.position[0].toFixed(2)}
          </span>
          <span>POS Y</span>
          <span className={cn("text-right", CRT_INK_TEXT)}>
            {selection.position[1].toFixed(2)}
          </span>
          <span>POS Z</span>
          <span className={cn("text-right", CRT_INK_TEXT)}>
            {selection.position[2].toFixed(2)}
          </span>
          <span>ROTATION</span>
          <span className={cn("text-right", CRT_INK_TEXT)}>
            {isPart ? `${degrees} DEG` : "FIXED"}
          </span>
        </div>

        {isPart && selection.removable ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onRotate(-Math.PI / 4)}
              className={actionButton}
              title="Rotate the selected part 45 degrees left"
            >
              <RotateCcw className="h-3 w-3" />
              -45
            </button>
            <button
              type="button"
              onClick={() => onRotate(Math.PI / 4)}
              className={actionButton}
              title="Rotate the selected part 45 degrees right"
            >
              <RotateCw className="h-3 w-3" />
              +45
            </button>
            <button
              type="button"
              onClick={onRemove}
              className={cn(
                actionButton,
                "ml-auto bg-[#FF6B1A] text-[#161616] hover:bg-[#FFE600]",
              )}
              title="Remove the selected part"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <p
            className={cn(
              "mt-4 border-[3px] px-2 py-1.5 text-[8px] uppercase tracking-[0.1em]",
              CRT_INK,
              CRT_MUTED,
            )}
          >
            FIXED HARDWARE // SELECT ONLY
          </p>
        )}
      </div>
    </div>
  );
};
