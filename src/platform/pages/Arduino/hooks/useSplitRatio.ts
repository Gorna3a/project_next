'use client';

import {
  useCallback,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  DEFAULT_SPLIT_RATIO,
  MAX_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
  STORAGE_SPLIT_RATIO,
} from "../utils/ui";

interface UseSplitRatioArgs {
  containerRef: RefObject<HTMLDivElement | null>;
  isRTL: boolean;
}

const clampRatio = (value: number): number =>
  Math.min(
    MAX_SPLIT_RATIO,
    Math.max(MIN_SPLIT_RATIO, Number.isFinite(value) ? value : DEFAULT_SPLIT_RATIO),
  );

const readPersistedRatio = (): number => {
  try {
    const stored = globalThis.localStorage.getItem(STORAGE_SPLIT_RATIO);
    if (stored !== null) return clampRatio(Number(stored));
  } catch {
    /* storage unavailable — fall back to the default ratio */
  }
  return DEFAULT_SPLIT_RATIO;
};

export const useSplitRatio = ({ containerRef, isRTL }: UseSplitRatioArgs) => {
  const [ratio, setRatioState] = useState(readPersistedRatio);
  const [dragging, setDragging] = useState(false);

  const setRatio = useCallback((value: number) => {
    setRatioState(clampRatio(value));
  }, []);

  const persist = useCallback(() => {
    setRatioState((current) => {
      try {
        globalThis.localStorage.setItem(STORAGE_SPLIT_RATIO, String(current));
      } catch {
        /* storage unavailable — ratio stays session-only */
      }
      return current;
    });
  }, []);

  const onDividerPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      setDragging(true);
      document.body.classList.add("select-none");

      const move = (moveEvent: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0) return;
        const raw = (moveEvent.clientX - rect.left) / rect.width;
        setRatioState(clampRatio(isRTL ? raw : 1 - raw));
      };

      const finish = () => {
        setDragging(false);
        document.body.classList.remove("select-none");
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", finish);
        document.removeEventListener("pointercancel", finish);
        persist();
      };

      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", finish);
      document.addEventListener("pointercancel", finish);
    },
    [containerRef, isRTL, persist],
  );

  return { ratio, setRatio, dragging, onDividerPointerDown };
};
