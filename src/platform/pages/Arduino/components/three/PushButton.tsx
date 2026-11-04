'use client';

import { useRef, useState } from "react";
import { Edges } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group, MeshStandardMaterial } from "three";

export interface PushButtonProps {
  position?: [number, number, number];
  rotationY?: number;
  interactive?: boolean;
}

const BASE_INK = "#161616";
const LEG_METAL = "#8C9186";
const PLUNGER_ORANGE = "#FF6B1A";
const UP_Y = 0.062;
const DOWN_Y = 0.044;
const LEG_POSITIONS: [number, number][] = [
  [-0.1, -0.09],
  [-0.1, 0.09],
  [0.1, -0.09],
  [0.1, 0.09],
];

export const PushButton = ({
  position = [0, 0, 0],
  rotationY = 0,
  interactive = true,
}: PushButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const plungerRef = useRef<Group | null>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  const visualHovered = interactive && hovered;
  const visualPressed = interactive && pressed;

  useFrame((_, delta) => {
    const plunger = plungerRef.current;
    if (plunger) {
      plunger.position.y = MathUtils.damp(
        plunger.position.y,
        visualPressed ? DOWN_Y : UP_Y,
        18,
        delta,
      );
    }

    const material = materialRef.current;
    if (material) {
      const target = visualPressed ? 0.8 : visualHovered ? 0.35 : 0.15;
      material.emissiveIntensity = MathUtils.damp(
        material.emissiveIntensity,
        target,
        14,
        delta,
      );
    }
  });

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={
        interactive
          ? () => {
              setHovered(true);
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? () => {
              setHovered(false);
              setPressed(false);
            }
          : undefined
      }
      onPointerDown={
        interactive
          ? (event) => {
              if (event.nativeEvent.button !== 0) return;
              setPressed(true);
            }
          : undefined
      }
      onPointerUp={
        interactive
          ? (event) => {
              if (event.nativeEvent.button !== 0) return;
              setPressed(false);
            }
          : undefined
      }
    >
      <mesh>
        <boxGeometry args={[0.24, 0.07, 0.24]} />
        <meshStandardMaterial
          color={BASE_INK}
          roughness={0.82}
          metalness={0.12}
          
        />
        <Edges color="#7AA800" />
      </mesh>

      {LEG_POSITIONS.map(([x, z]) => (
        <mesh key={`leg-${x}-${z}`} position={[x, -0.048, z]}>
          <boxGeometry args={[0.03, 0.032, 0.03]} />
          <meshStandardMaterial
            color={LEG_METAL}
            roughness={0.35}
            metalness={0.6}
            
          />
        </mesh>
      ))}

      <group ref={plungerRef} position={[0, UP_Y, 0]}>
        <mesh>
          <boxGeometry args={[0.14, 0.05, 0.14]} />
          <meshStandardMaterial
            ref={materialRef}
            color={PLUNGER_ORANGE}
            emissive={PLUNGER_ORANGE}
            emissiveIntensity={0.15}
            roughness={0.5}
            metalness={0.06}
            
          />
        </mesh>
      </group>
    </group>
  );
};
