'use client';

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { SessionState } from "@core/simulator";
import { useDigitalPins } from "../hooks/useDigitalPins";
import { useWireRouting } from "../hooks/useWireRouting";
import type { BenchController } from "../hooks/useBenchComponents";
import type {
  BenchComponentKind,
  BenchTool,
} from "./three/bench";
import type { SceneSelection } from "./three/focus";
import type { Vec3 } from "./three/layout";
import { ComponentToolbar } from "./ComponentToolbar";
import { WireToolbar } from "./WireToolbar";
import {
  cn,
  CRT_PIXEL,
  CRT_MONO,
  CRT_INK,
  CRT_SHADOW,
  CRT_BEZEL,
  CRT_SURFACE,
  CRT_PHOSPHOR,
  CRT_INK_TEXT,
  CRT_MUTED,
} from "../utils/ui";

const BoardScene = dynamic(() => import("./three/BoardScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <p className={cn("text-[10px] uppercase tracking-[0.14em]", CRT_MONO, CRT_MUTED)}>
        {"> BOOTING 3D SCENE..."}
      </p>
    </div>
  ),
});

interface LocalSimulatorPaneProps {
  state: SessionState;
  bench: BenchController;
  selected: SceneSelection | null;
  focusNonce: number;
  onSelect: (selection: SceneSelection, focus: boolean) => void;
  onMove: (id: string, position: Vec3) => void;
}

const PixelGrid = () => <div className="aw-pixel-grid pointer-events-none absolute inset-0" />;

const CornerTicks = () => (
  <>
    <span className="aw-corner-tick absolute left-2 top-2 h-2.5 w-2.5 border-l-[2px] border-t-[2px]" />
    <span className="aw-corner-tick absolute right-2 top-2 h-2.5 w-2.5 border-r-[2px] border-t-[2px]" />
    <span className="aw-corner-tick absolute bottom-2 left-2 h-2.5 w-2.5 border-b-[2px] border-l-[2px]" />
    <span className="aw-corner-tick absolute bottom-2 right-2 h-2.5 w-2.5 border-b-[2px] border-r-[2px]" />
  </>
);

const statusCopy = (runtime: SessionState["runtime"]): string => {
  if (runtime === "running") return "SCENE LOOP ACTIVE";
  if (runtime === "paused") return "SCENE FROZEN";
  if (runtime === "starting") return "BOOTING SCENE...";
  if (runtime === "ready") return "SCENE READY // RUN TO BOOT";
  return "AWAITING FIRST RUN";
};

const toolHint = (tool: BenchTool): string => {
  if (tool === "wire") return "CLICK A PIN OR TIE POINT · ESC CANCEL";
  if (tool === "place") return "CLICK TO PLACE · ESC CANCEL";
  return "LMB ORBIT · SHIFT+DRAG PAN · WHEEL ZOOM";
};

export const LocalSimulatorPane = ({
  state,
  bench,
  selected,
  focusNonce,
  onSelect,
  onMove,
}: LocalSimulatorPaneProps) => {
  const { runtime } = state;
  const { d13, isPaused, isRunning } = useDigitalPins(state);
  const routing = useWireRouting();
  const { cancel: cancelRouting } = routing;
  const [tool, setTool] = useState<BenchTool>("select");
  const [placementKind, setPlacementKind] =
    useState<BenchComponentKind | null>(null);
  const showCallouts = tool === "select" && selected === null;

  useEffect(() => {
    if (tool !== "wire") cancelRouting();
  }, [cancelRouting, tool]);

  useEffect(() => {
    if (tool !== "place") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setTool("select");
      setPlacementKind(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tool]);

  const handleToolChange = (next: "select" | "wire") => {
    setTool(next);
    setPlacementKind(null);
    if (next !== "wire") cancelRouting();
  };

  const handleStartPlacement = (kind: BenchComponentKind) => {
    cancelRouting();
    setPlacementKind(kind);
    setTool("place");
  };

  const handleCancelPlacement = () => {
    setPlacementKind(null);
    setTool("select");
  };

  const handlePlace = (position: Vec3) => {
    if (!placementKind) return;
    const part = bench.spawn(placementKind, position);
    setPlacementKind(null);
    setTool("select");
    onSelect({ kind: "part", id: part.id }, true);
  };

  const ledClass =
    runtime === "running" || runtime === "starting"
      ? cn("animate-pulse", CRT_PHOSPHOR)
      : runtime === "paused"
        ? "text-[#FF6B1A]"
        : runtime === "ready"
          ? CRT_PHOSPHOR
          : CRT_MUTED;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className={cn("relative min-h-0 flex-1 p-3", CRT_SURFACE)}>
        <PixelGrid />
        <div
          className={cn(
            "aw-local-frame relative flex h-full w-full flex-col overflow-hidden border-[3px]",
            CRT_INK,
            CRT_BEZEL,
            CRT_SHADOW,
          )}
        >
          <div
            className={cn(
              "aw-local-header flex shrink-0 items-center justify-between gap-2 border-b-[3px] px-3 py-1.5",
              CRT_INK,
              CRT_SURFACE,
            )}
          >
            <span
              className={cn(
                "aw-local-heading truncate uppercase tracking-[0.08em]",
                CRT_PIXEL,
                CRT_INK_TEXT,
              )}
            >
              INTERACTIVE BENCH // UNO R3
            </span>
            <span
              className={cn(
                "aw-local-scene shrink-0 uppercase tracking-[0.12em]",
                CRT_MONO,
                CRT_MUTED,
              )}
            >
              ATMEGA328P · 16 MHz
            </span>
          </div>

          <ComponentToolbar
            tool={tool}
            placementKind={placementKind}
            partCount={bench.components.length}
            onToolChange={handleToolChange}
            onStartPlacement={handleStartPlacement}
            onCancelPlacement={handleCancelPlacement}
          />

          {tool === "wire" && (
            <WireToolbar
              color={routing.color}
              activeSource={routing.activeSource}
              wireCount={routing.wires.length}
              onColorChange={routing.setColor}
              onClear={routing.clearWires}
              onCancel={cancelRouting}
            />
          )}

          <div className="aw-local-canvas relative min-h-0 flex-1">
            <PixelGrid />
            <div className="absolute inset-0">
              <BoardScene
                d13={d13}
                paused={isPaused}
                running={isRunning}
                routing={routing}
                tool={tool}
                placementKind={placementKind}
                components={bench.components}
                selected={selected}
                focusNonce={focusNonce}
                onSelect={onSelect}
                onMove={onMove}
                onPlace={handlePlace}
              />
            </div>
            <CornerTicks />
            {showCallouts && (
              <div className="aw-callouts" aria-label="Arduino board highlights">
                <div className="aw-callout aw-callout-usb">
                  <span className="aw-callout-number">01</span>
                  <span><strong>USB-B PORT</strong><small>PROGRAM + POWER</small></span>
                </div>
                <div className="aw-callout aw-callout-mcu">
                  <span className="aw-callout-number">02</span>
                  <span><strong>ATmega328P</strong><small>THE BOARD’S BRAIN</small></span>
                </div>
                <div className="aw-callout aw-callout-d13">
                  <span className="aw-callout-number">03</span>
                  <span><strong>BUILT-IN LED</strong><small>D13 · {d13 ? "HIGH" : "LOW"}</small></span>
                </div>
              </div>
            )}
            <div
              className={cn(
                "aw-canvas-hint pointer-events-none absolute bottom-3 right-3 z-10 border px-2 py-1 uppercase tracking-[0.1em]",
                CRT_INK,
                CRT_SURFACE,
                CRT_SHADOW,
                CRT_MONO,
                CRT_MUTED,
              )}
            >
              {toolHint(tool)}
            </div>
          </div>

          <div
            className={cn(
              "aw-local-footer flex shrink-0 items-center gap-2 border-t px-3 py-2",
              CRT_INK,
              CRT_SURFACE,
            )}
          >
            <span className={cn("text-[10px]", ledClass)}>●</span>
            <span
              className={cn(
                "truncate text-[10px] uppercase tracking-[0.1em]",
                CRT_MONO,
                runtime === "paused" ? "text-[#FF6B1A]" : CRT_MUTED,
              )}
            >
              LOCAL MODE // {statusCopy(runtime)}
            </span>
            <span
              className={cn(
                "ml-auto flex shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.1em]",
                CRT_MONO,
                CRT_MUTED,
              )}
            >
              <span>WIRES {String(routing.wires.length).padStart(2, "0")}</span>
              <span className={cn(d13 ? "text-[#7AA800] dark:text-[#BFFF00]" : "text-[#8A867F]")}>
                D13 {d13 ? "HI" : "LO"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
