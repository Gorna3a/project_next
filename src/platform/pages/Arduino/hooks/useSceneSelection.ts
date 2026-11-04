'use client';

import { useCallback, useState } from "react";
import type { SceneSelection } from "../components/three/focus";

export interface SceneSelectionController {
  selection: SceneSelection | null;
  focusNonce: number;
  select: (selection: SceneSelection, focus?: boolean) => void;
  clear: () => void;
}

export const useSceneSelection = (): SceneSelectionController => {
  const [selection, setSelection] = useState<SceneSelection | null>(null);
  const [focusNonce, setFocusNonce] = useState(0);

  const select = useCallback((next: SceneSelection, focus = true) => {
    setSelection(next);
    if (focus) setFocusNonce((current) => current + 1);
  }, []);

  const clear = useCallback(() => {
    setSelection(null);
  }, []);

  return { selection, focusNonce, select, clear };
};
