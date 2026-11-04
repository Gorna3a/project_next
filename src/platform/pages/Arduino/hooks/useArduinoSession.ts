'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionState, SimulatorSessionApi } from "@core/simulator";
import { createArduinoSimulatorSession } from "../engines/createArduinoSimulatorSession";
import { STARTER_SKETCH, STARTER_SKETCH_FILENAME } from "../project/starterSketch";
import {
  canPause as canPauseGuard,
  canReset as canResetGuard,
  canResume as canResumeGuard,
  canRun as canRunGuard,
  getBusy,
  hasBuildError,
  isDirty,
} from "../utils/ui";

const SKETCH_FLUSH_DELAY_MS = 300;

export const useArduinoSession = () => {
  const [session] = useState<SimulatorSessionApi>(() =>
    createArduinoSimulatorSession({
      initialSketch: { path: STARTER_SKETCH_FILENAME, content: STARTER_SKETCH },
    }),
  );
  const [state, setState] = useState<SessionState>(() => session.getState());
  const [sketch, setSketchDraft] = useState(STARTER_SKETCH);

  const sketchRef = useRef(STARTER_SKETCH);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = session.subscribe(setState);
    return () => {
      unsubscribe();
      if (flushTimer.current !== null) clearTimeout(flushTimer.current);
      session.dispose();
    };
  }, [session]);

  const setSketch = useCallback(
    (content: string) => {
      setSketchDraft(content);
      sketchRef.current = content;
      if (flushTimer.current !== null) clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(() => {
        session.setSketch(STARTER_SKETCH_FILENAME, content);
      }, SKETCH_FLUSH_DELAY_MS);
    },
    [session],
  );

  const run = useCallback(() => {
    const path = STARTER_SKETCH_FILENAME;
    const content = sketchRef.current;
    if (flushTimer.current !== null) clearTimeout(flushTimer.current);
    flushTimer.current = null;
    session.setSketch(path, content);
    void session.run({ sketchPath: path, sketchContent: content });
  }, [session]);

  const pause = useCallback(() => {
    void session.pause();
  }, [session]);

  const resume = useCallback(() => {
    void session.resume();
  }, [session]);

  const reset = useCallback(() => {
    void session.reset();
  }, [session]);

  const clearSerial = useCallback(() => {
    session.clearSerial();
  }, [session]);

  const clearDiagnostics = useCallback(() => {
    session.clearDiagnostics();
  }, [session]);

  return {
    session,
    state,
    sketch,
    setSketch,
    run,
    pause,
    resume,
    reset,
    clearSerial,
    clearDiagnostics,
    busy: getBusy(state),
    dirty: isDirty(state),
    buildFailed: hasBuildError(state),
    canRun: canRunGuard(state),
    canPause: canPauseGuard(state),
    canResume: canResumeGuard(state),
    canReset: canResetGuard(state),
  };
};
