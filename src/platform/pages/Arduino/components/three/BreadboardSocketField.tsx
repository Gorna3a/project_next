'use client';

import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import {
  BREADBOARD_POSITION,
  BREADBOARD_TOP,
  nearestBreadboardAnchor,
  type WireAnchor,
} from "./layout";

export interface BreadboardSocketFieldProps {
  onHover: (anchor: WireAnchor | null) => void;
  onSelect: (anchor: WireAnchor) => void;
}

const CLICK_DELTA = 6;
const SURFACE_WIDTH = 1.55;
const SURFACE_DEPTH = 0.62;

const resolveAnchor = (event: ThreeEvent<PointerEvent>): WireAnchor =>
  nearestBreadboardAnchor([event.point.x, event.point.y, event.point.z]);

export const BreadboardSocketField = ({
  onHover,
  onSelect,
}: BreadboardSocketFieldProps) => {
  const hoveredIdRef = useRef<string | null>(null);

  return (
    <mesh
      position={[
        BREADBOARD_POSITION[0],
        BREADBOARD_TOP + 0.012,
        BREADBOARD_POSITION[2],
      ]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(event) => {
        event.stopPropagation();
        const anchor = resolveAnchor(event);
        if (anchor.id === hoveredIdRef.current) return;
        hoveredIdRef.current = anchor.id;
        onHover(anchor);
      }}
      onPointerOut={() => {
        hoveredIdRef.current = null;
        onHover(null);
      }}
      onPointerUp={(event) => {
        if (
          event.nativeEvent.button !== 0 ||
          event.nativeEvent.shiftKey
        ) {
          return;
        }
        event.stopPropagation();
        if (event.delta > CLICK_DELTA) return;
        onSelect(resolveAnchor(event));
      }}
    >
      <planeGeometry args={[SURFACE_WIDTH, SURFACE_DEPTH]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
};
