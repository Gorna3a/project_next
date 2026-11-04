'use client';

import { useEffect, useRef } from "react";
import type { SessionState, SimulatorSessionApi } from "@core/simulator";
import type { BenchController } from "../hooks/useBenchComponents";
import type { SceneSelection } from "./three/focus";
import type { Vec3 } from "./three/layout";
import {
  cn,
  CRT_PIXEL,
  CRT_SILK,
  CRT_MONO,
  CRT_INK,
  CRT_SHADOW,
  CRT_NUDGE,
  CRT_SURFACE,
  CRT_PHOSPHOR,
  CRT_MUTED,
} from "../utils/ui";
import { LocalSimulatorPane } from "./LocalSimulatorPane";

interface SimulatorPaneProps {
  state: SessionState;
  session: SimulatorSessionApi;
  bench: BenchController;
  selected: SceneSelection | null;
  focusNonce: number;
  onSelect: (selection: SceneSelection, focus: boolean) => void;
  onMove: (id: string, position: Vec3) => void;
}

const PixelGrid = () => (
  <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(22,22,22,0.10)_1px,transparent_1px)] [background-size:14px_14px] dark:[background-image:radial-gradient(circle,rgba(232,255,208,0.07)_1px,transparent_1px)] dark:[background-size:14px_14px]" />
);

export const SimulatorPane = ({
  state,
  session,
  bench,
  selected,
  focusNonce,
  onSelect,
  onMove,
}: SimulatorPaneProps) => {
  const { runtime, status } = state;
  const isWokwi = state.engine.engine === "wokwi";
  const isLocal = state.engine.engine === "local";
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isWokwi) return;
    const container = mountRef.current;
    if (!container) return;
    session.mount?.(container);
    return () => {
      session.unmount?.();
    };
  }, [isWokwi, session]);
  const ledActive = runtime === "running" && status.d13;
  const ledPaused = runtime === "paused" && status.d13;

  return (
    <div className={cn("flex h-full min-h-0 flex-col aw-stage")}>
      {isWokwi ? (
        <div
          className={cn(
            "aw-canvas relative min-h-0 flex-1 overflow-hidden",
            CRT_SURFACE,
          )}
        >
          <PixelGrid />
          <div ref={mountRef} className="absolute inset-0" />
          {state.connection.phase !== "connected" ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-[#0F100E]/90">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.14em]",
                  CRT_MONO,
                  CRT_MUTED,
                )}
              >
                {state.connection.phase === "connecting"
                  ? "> CONNECTING..."
                  : "> OFFLINE // WOKWI UNREACHABLE"}
              </span>
            </div>
          ) : null}
        </div>
      ) : isLocal ? (
        <LocalSimulatorPane
          state={state}
          bench={bench}
          selected={selected}
          focusNonce={focusNonce}
          onSelect={onSelect}
          onMove={onMove}
        />
      ) : (
        <div
          className={cn(
            "aw-canvas relative grid min-h-0 flex-1 place-items-center overflow-hidden p-4",
            CRT_SURFACE,
          )}
        >
          <PixelGrid />
          <div className="relative z-10 w-full max-w-[340px]">
            <div
              className={cn(
                "rounded-none border-[4px] bg-gradient-to-b from-[#1c837c] to-[#155e59] p-3",
                CRT_INK,
                CRT_SHADOW,
                CRT_NUDGE,
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-center gap-1 bg-black/25 px-2 py-2">
                  <span
                    className={cn(
                      "h-3 w-3 border-2 border-black/60 transition-colors",
                      ledActive && "animate-[pulse_1s_ease-in-out_infinite]",
                      ledActive || ledPaused
                        ? "bg-[#FFD23F] shadow-[0_0_8px_rgba(255,210,63,0.9)]"
                        : "bg-[#4B4B34]",
                    )}
                    title={`Onboard LED D13 — ${ledActive ? "blinking" : ledPaused ? "frozen" : "off"}`}
                  />
                  <span
                    className={cn("text-[7px] text-white/80", CRT_PIXEL)}
                  >
                    D13
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span
                    className={cn("text-[12px] text-white/90", CRT_PIXEL)}
                  >
                    UNO
                  </span>
                  <span
                    className={cn("text-[8px] uppercase text-white/60", CRT_SILK)}
                  >
                    Wokwi mock hardware
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {[0, 1, 2, 3, 5, 6, 9, 11, 12, 13, 14, 15].map((pin) => (
                  <span
                    key={pin}
                    className={cn(
                      "h-1.5 w-4 rounded-none",
                      pin === 13 && (ledActive || ledPaused)
                        ? "bg-[#FFD23F]"
                        : "bg-[#17A49C]",
                    )}
                    title={`GPIO ${pin}`}
                  />
                ))}
              </div>

              <div
                className={cn(
                  "mt-3 grid grid-cols-2 gap-2 bg-black/25 p-2 text-[8px] uppercase tracking-[0.1em] text-white/70",
                  CRT_MONO,
                )}
              >
                <span>MCU: FPGA-AVR (MOCK)</span>
                <span className="text-right">CLK: 16 MHz</span>
                <span>RUN: {status.running ? "GO" : "HALT"}</span>
                <span className="text-right">
                  PAUSE: {status.paused ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "mt-3 flex items-center gap-2 rounded-none border-[3px] px-2.5 py-1.5",
                CRT_INK,
                CRT_SURFACE,
                CRT_SHADOW,
              )}
            >
              <span className={cn("text-[10px]", CRT_PHOSPHOR)}>●</span>
              <span
                className={cn(
                  "truncate text-[9px] uppercase tracking-[0.1em]",
                  CRT_MONO,
                  CRT_MUTED,
                )}
              >
                MOCK PIXELS // SET ENGINE=LOCAL FOR CUSTOM WORKSPACE
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
