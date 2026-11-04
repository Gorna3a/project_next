'use client';

import type { SessionState } from "@core/simulator";

export interface DigitalPins {
  d13: boolean;
  simTimeNs: number;
  isRunning: boolean;
  isPaused: boolean;
}

export const useDigitalPins = (state: SessionState): DigitalPins => {
  const { runtime, status } = state;
  const d13 = status.d13;

  return {
    d13,
    simTimeNs: status.simTimeNs,
    isRunning: runtime === "running",
    isPaused: runtime === "paused",
  };
};
