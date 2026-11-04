'use client';

import { useCallback, useRef, useState } from "react";
import {
  BENCH_PART_SPECS,
  createSeedBenchComponents,
  snapBenchPosition,
  type BenchComponent,
  type BenchComponentKind,
} from "../components/three/bench";
import type { Vec3 } from "../components/three/layout";

export interface BenchController {
  components: BenchComponent[];
  spawn: (kind: BenchComponentKind, position: Vec3) => BenchComponent;
  move: (id: string, position: Vec3) => void;
  rotate: (id: string, delta: number) => void;
  remove: (id: string) => void;
}

export const useBenchComponents = (): BenchController => {
  const [components, setComponents] = useState<BenchComponent[]>(
    createSeedBenchComponents,
  );
  const partIdRef = useRef(0);

  const spawn = useCallback(
    (kind: BenchComponentKind, position: Vec3): BenchComponent => {
      partIdRef.current += 1;
      const component: BenchComponent = {
        id: `part-${kind}-${partIdRef.current}`,
        kind,
        position: snapBenchPosition(position, kind),
        rotationY: BENCH_PART_SPECS[kind].defaultRotation,
      };

      setComponents((current) => [...current, component]);
      return component;
    },
    [],
  );

  const move = useCallback((id: string, position: Vec3) => {
    setComponents((current) =>
      current.map((component) =>
        component.id === id
          ? {
              ...component,
              position: snapBenchPosition(position, component.kind),
            }
          : component,
      ),
    );
  }, []);

  const rotate = useCallback((id: string, delta: number) => {
    setComponents((current) =>
      current.map((component) =>
        component.id === id
          ? { ...component, rotationY: component.rotationY + delta }
          : component,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setComponents((current) =>
      current.filter((component) => component.id !== id),
    );
  }, []);

  return { components, spawn, move, rotate, remove };
};
