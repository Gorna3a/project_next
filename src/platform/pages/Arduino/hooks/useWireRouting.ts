'use client';

import { useCallback, useEffect, useReducer, useRef } from "react";
import {
  D13_ANCHOR,
  DEFAULT_WIRE_TARGET,
  type WireAnchor,
} from "../components/three/layout";

export type WireColor = "#D94B3D" | "#20252C" | "#E0B64D";

export interface WireColorOption {
  id: "vcc" | "gnd" | "signal";
  label: string;
  color: WireColor;
}

export const WIRE_PALETTE: WireColorOption[] = [
  { id: "vcc", label: "VCC", color: "#D94B3D" },
  { id: "gnd", label: "GND", color: "#20252C" },
  { id: "signal", label: "SIG", color: "#E0B64D" },
];

export const DEFAULT_WIRE_COLOR: WireColor = "#E0B64D";

export interface WireConnection {
  id: string;
  from: WireAnchor;
  to: WireAnchor;
  color: WireColor;
}

interface RoutingState {
  activeSource: WireAnchor | null;
  wires: WireConnection[];
  color: WireColor;
}

type RoutingAction =
  | { type: "select"; anchor: WireAnchor; wireId: string }
  | { type: "color"; color: WireColor }
  | { type: "clear" }
  | { type: "cancel" };

export interface WireRoutingController {
  wires: WireConnection[];
  activeSource: WireAnchor | null;
  color: WireColor;
  selectAnchor: (anchor: WireAnchor) => void;
  setColor: (color: WireColor) => void;
  clearWires: () => void;
  cancel: () => void;
}

const createInitialState = (): RoutingState => ({
  activeSource: null,
  color: DEFAULT_WIRE_COLOR,
  wires: [
    {
      id: "wire-seed",
      from: D13_ANCHOR,
      to: DEFAULT_WIRE_TARGET,
      color: DEFAULT_WIRE_COLOR,
    },
  ],
});

const reducer = (state: RoutingState, action: RoutingAction): RoutingState => {
  switch (action.type) {
    case "select": {
      if (!state.activeSource) {
        return { ...state, activeSource: action.anchor };
      }

      const source = state.activeSource;
      if (source.id === action.anchor.id) {
        return { ...state, activeSource: null };
      }

      const duplicate = state.wires.some(
        (wire) =>
          (wire.from.id === source.id && wire.to.id === action.anchor.id) ||
          (wire.from.id === action.anchor.id && wire.to.id === source.id),
      );

      if (duplicate) {
        return { ...state, activeSource: null };
      }

      return {
        ...state,
        activeSource: null,
        wires: [
          ...state.wires,
          {
            id: action.wireId,
            from: source,
            to: action.anchor,
            color: state.color,
          },
        ],
      };
    }
    case "color":
      return { ...state, color: action.color };
    case "clear":
      return { ...state, wires: [], activeSource: null };
    case "cancel":
      return { ...state, activeSource: null };
  }
};

export const useWireRouting = (): WireRoutingController => {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    createInitialState,
  );
  const wireIdRef = useRef(1);

  useEffect(() => {
    if (!state.activeSource) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch({ type: "cancel" });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.activeSource]);

  const selectAnchor = useCallback((anchor: WireAnchor) => {
    wireIdRef.current += 1;
    dispatch({
      type: "select",
      anchor,
      wireId: `wire-${wireIdRef.current}`,
    });
  }, []);

  const setColor = useCallback((color: WireColor) => {
    dispatch({ type: "color", color });
  }, []);

  const clearWires = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const cancel = useCallback(() => {
    dispatch({ type: "cancel" });
  }, []);

  return {
    wires: state.wires,
    activeSource: state.activeSource,
    color: state.color,
    selectAnchor,
    setColor,
    clearWires,
    cancel,
  };
};
