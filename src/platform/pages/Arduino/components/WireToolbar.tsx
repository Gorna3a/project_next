'use client';

import {
  WIRE_PALETTE,
  type WireColor,
} from "../hooks/useWireRouting";
import type { WireAnchor } from "./three/layout";
import {
  cn,
  CRT_PIXEL,
  CRT_MONO,
  CRT_INK,
  CRT_SURFACE,
  CRT_INK_TEXT,
  CRT_MUTED,
} from "../utils/ui";

interface WireToolbarProps {
  color: WireColor;
  activeSource: WireAnchor | null;
  wireCount: number;
  onColorChange: (color: WireColor) => void;
  onClear: () => void;
  onCancel: () => void;
}

const toolbarButton = cn(
  "aw-tool-button rounded-none border px-3 py-1 uppercase tracking-[0.06em]",
  CRT_PIXEL,
  CRT_INK,
  "bg-[#EFE9D9] text-[#161616] shadow-[2px_2px_0_0_#161616] dark:bg-[#1C1E1A] dark:text-[#E8FFD0] dark:shadow-[2px_2px_0_0_#2E312A]",
  "cursor-pointer transition-all hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_#161616] dark:hover:shadow-[3px_3px_0_0_#2E312A]",
  "disabled:cursor-not-allowed disabled:opacity-40",
);

export const WireToolbar = ({
  color,
  activeSource,
  wireCount,
  onColorChange,
  onClear,
  onCancel,
}: WireToolbarProps) => {
  const activeOption = WIRE_PALETTE.find((option) => option.color === color);
  const countLabel = String(wireCount).padStart(2, "0");

  return (
    <div
      className={cn(
        "aw-wire-toolbar flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5 border-b px-3 py-2",
        CRT_INK,
        CRT_SURFACE,
      )}
    >
      <span
        className={cn(
          "aw-toolbar-label uppercase tracking-[0.08em]",
          CRT_PIXEL,
          CRT_INK_TEXT,
        )}
      >
        WIRE
      </span>

      <div className="flex items-center gap-1.5" role="group" aria-label="Wire color">
        {WIRE_PALETTE.map((option) => {
          const selected = option.color === color;
          return (
            <button
              key={option.id}
              type="button"
              aria-label={`${option.label} wire color`}
              aria-pressed={selected}
              title={`${option.label} wire`}
              onClick={() => onColorChange(option.color)}
              className={cn(
                "h-6 w-6 shrink-0 cursor-pointer rounded-none border-[3px] p-0 transition-all",
                CRT_INK,
                selected
                  ? "-translate-x-[1px] -translate-y-[1px] shadow-[3px_3px_0_0_#FFE600]"
                  : "shadow-[2px_2px_0_0_#161616] dark:shadow-[2px_2px_0_0_#2E312A]",
                option.id === "gnd" &&
                  "outline outline-1 outline-offset-[-4px] outline-[#8C9186]",
              )}
              style={{ backgroundColor: option.color }}
            />
          );
        })}
      </div>

      <span
        className={cn(
          "text-[8px] uppercase tracking-[0.1em]",
          CRT_MONO,
          CRT_MUTED,
        )}
      >
        {activeOption?.label ?? "SIG"}
      </span>

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[8px] uppercase tracking-[0.1em]",
          CRT_MONO,
          CRT_MUTED,
        )}
        aria-live="polite"
      >
        {activeSource
          ? `SRC ${activeSource.label} // CLICK TARGET`
          : "CLICK A PIN OR TIE POINT"}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <span
          className={cn(
            "text-[8px] uppercase tracking-[0.1em]",
            CRT_MONO,
            CRT_MUTED,
          )}
        >
          WIRES {countLabel}
        </span>
        {activeSource && (
          <button type="button" onClick={onCancel} className={toolbarButton}>
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          disabled={wireCount === 0}
          className={toolbarButton}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
