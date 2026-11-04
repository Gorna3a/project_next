'use client';

import { Cpu, Pause, Play, RotateCcw } from "lucide-react";
import type { SessionState } from "@core/simulator";
import { cn, formatSimTime, isDirty } from "../utils/ui";
import { StatusPill } from "./StatusPill";

interface ArduinoToolbarProps {
  state: SessionState;
  onRun: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  canRun: boolean;
  canPause: boolean;
  canResume: boolean;
  canReset: boolean;
}

export const ArduinoToolbar = ({
  state, onRun, onPause, onResume, onReset, canRun, canPause, canResume, canReset,
}: ArduinoToolbarProps) => {
  const dirty = isDirty(state);
  const running = state.runtime === "running";
  const showPauseSlot = running || state.operation.kind !== null;

  return (
    <header className="aw-toolbar">
      <div className="aw-identity">
        <span className="aw-brand-mark" aria-hidden="true"><Cpu className="h-5 w-5" /></span>
        <div className="aw-title-stack">
          <span className="aw-eyebrow">PixelCode / Hardware Lab</span>
          <span className="aw-heading">Learn Arduino</span>
          <span className="aw-tagline">Explore <i /> Understand <i /> Build</span>
        </div>
        <div className="aw-file-chip" title={dirty ? "Sketch has changes to build" : "Sketch is in sync"}>
          <span className={cn("aw-dirty", dirty && "is-dirty")} aria-label={dirty ? "Unsaved build changes" : "In sync"} />
          <span>{state.sketchPath}</span>
        </div>
      </div>

      <div className="aw-actions" aria-label="Simulator controls">
        <button onClick={onRun} disabled={!canRun} className="aw-action aw-action-run" title="Build and start simulation (Ctrl/Cmd+S)">
          <Play className="h-4 w-4 fill-current" /><span>Run sketch</span>
        </button>
        {showPauseSlot ? (
          <button onClick={onPause} disabled={!canPause} className="aw-action aw-action-alt" title="Pause simulation">
            <Pause className="h-4 w-4 fill-current" /><span className="hidden sm:inline">Pause</span>
          </button>
        ) : (
          <button onClick={onResume} disabled={!canResume} className="aw-action aw-action-alt" title="Resume simulation">
            <Play className="h-4 w-4 fill-current" /><span className="hidden sm:inline">Resume</span>
          </button>
        )}
        <button onClick={onReset} disabled={!canReset} className="aw-action aw-action-reset" title="Restart loaded firmware">
          <RotateCcw className="h-4 w-4" /><span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      <div className="aw-readouts">
        <span className="aw-clock">{formatSimTime(state.status.simTimeNs)}</span>
        <StatusPill state={state} className="aw-status" />
      </div>
    </header>
  );
};
