'use client';

import { useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import {
  BENCH_PART_SPECS,
  benchSurfaceY,
  snapBenchPosition,
  type BenchComponentKind,
} from "./bench";
import type { Vec3 } from "./layout";

export interface PlacementGhostProps {
  kind: BenchComponentKind;
  onPlace: (position: Vec3) => void;
}

const PLACEMENT_PLANE_Y = 0.35;

export const PlacementGhost = ({ kind, onPlace }: PlacementGhostProps) => {
  const [position, setPosition] = useState<Vec3 | null>(null);
  const spec = BENCH_PART_SPECS[kind];

  const resolvePosition = (
    event: ThreeEvent<PointerEvent>,
  ): Vec3 =>
    snapBenchPosition([event.point.x, event.point.y, event.point.z], kind);

  return (
    <>
      <mesh
        position={[0.2, PLACEMENT_PLANE_Y, 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={(event) => {
          event.stopPropagation();
          setPosition(resolvePosition(event));
        }}
        onPointerDown={(event) => {
          if (
            event.nativeEvent.button !== 0 ||
            event.nativeEvent.shiftKey
          ) {
            return;
          }
          event.stopPropagation();
          setPosition(resolvePosition(event));
        }}
        onPointerOut={() => setPosition(null)}
        onPointerUp={(event) => {
          event.stopPropagation();
          if (
            event.nativeEvent.button !== 0 ||
            event.nativeEvent.shiftKey ||
            event.delta > 6
          ) {
            return;
          }
          onPlace(resolvePosition(event));
        }}
      >
        <planeGeometry args={[12, 9]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {position && (
        <group
          position={[
            position[0],
            benchSurfaceY(position[0], position[2]),
            position[2],
          ]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => undefined}>
            <ringGeometry args={[0.12, 0.155, 28]} />
            <meshBasicMaterial
              color="#d95540"
              transparent
              opacity={0.8}
              side={DoubleSide}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>

          <mesh
            position={[0, spec.ghostSize[1] / 2 + 0.01, 0]}
            raycast={() => undefined}
          >
            <boxGeometry args={spec.ghostSize} />
            <meshBasicMaterial
              color="#d95540"
              transparent
              opacity={0.18}
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </mesh>

        </group>
      )}
    </>
  );
};
