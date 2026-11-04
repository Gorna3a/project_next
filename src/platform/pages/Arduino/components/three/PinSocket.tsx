'use client';

import { useState } from "react";
import { Edges } from "@react-three/drei";
import type { WireAnchor } from "./layout";

export interface PinSocketProps {
  anchor: WireAnchor;
  hovered?: boolean;
  selected?: boolean;
  isDark?: boolean;
  rotationY?: number;
  size?: number;
  visualOnly?: boolean;
  onHover?: (anchor: WireAnchor | null) => void;
  onSelect?: (anchor: WireAnchor) => void;
}

const CLICK_DELTA = 6;
const HITBOX_HEIGHT = 0.05;

export const PinSocket = ({
  anchor,
  hovered = false,
  selected = false,
  isDark = false,
  rotationY = 0,
  size = 0.07,
  visualOnly = false,
  onHover,
  onSelect,
}: PinSocketProps) => {
  const [pressed, setPressed] = useState(false);
  const activeColor = isDark ? "#ee8069" : "#d95540";
  const color = selected ? activeColor : hovered || pressed ? "#f2bd55" : null;
  const disableRaycast = visualOnly ? () => undefined : undefined;

  return (
    <group
      position={anchor.position}
      rotation={[0, rotationY, 0]}
      onPointerOver={
        visualOnly
          ? undefined
          : (event) => {
              event.stopPropagation();
              onHover?.(anchor);
            }
      }
      onPointerDown={
        visualOnly
          ? undefined
          : (event) => {
              if (
                event.nativeEvent.button !== 0 ||
                event.nativeEvent.shiftKey
              ) {
                return;
              }
              event.stopPropagation();
              setPressed(true);
            }
      }
      onPointerOut={
        visualOnly
          ? undefined
          : () => {
              setPressed(false);
              onHover?.(null);
            }
      }
      onPointerUp={
        visualOnly
          ? undefined
          : (event) => {
              if (
                event.nativeEvent.button !== 0 ||
                event.nativeEvent.shiftKey
              ) {
                setPressed(false);
                return;
              }
              event.stopPropagation();
              setPressed(false);
              if (event.delta <= CLICK_DELTA) onSelect?.(anchor);
            }
      }
    >
      {!visualOnly && (
        <mesh raycast={disableRaycast}>
          <boxGeometry args={[size, HITBOX_HEIGHT, size]} />
          <meshBasicMaterial
            transparent
            opacity={0.001}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}

      {color && (
        <mesh position={[0, 0.012, 0]} raycast={disableRaycast}>
          <boxGeometry args={[size * 0.86, 0.014, size * 0.86]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 0.9 : pressed ? 0.8 : 0.45}
            transparent
            opacity={0.22}
            roughness={0.4}
            metalness={0.08}
            flatShading
          />
          <Edges color={color} />
        </mesh>
      )}
    </group>
  );
};
