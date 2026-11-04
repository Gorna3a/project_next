'use client';

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial, PointLight } from "three";

interface D13LedProps {
  d13: boolean;
  paused: boolean;
  running: boolean;
  onColor: string;
  pausedColor: string;
  baseColor: string;
  position?: [number, number, number];
}

export const D13Led = ({
  d13,
  paused,
  running,
  onColor,
  pausedColor,
  baseColor,
  position = [0.9, 0.105, 0.42],
}: D13LedProps) => {
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const lightRef = useRef<PointLight | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;

    if (paused && d13) {
      material.color.set(pausedColor);
      material.emissive.set(pausedColor);
      material.emissiveIntensity = 0.9;
      if (lightRef.current) lightRef.current.intensity = 1.2;
      return;
    }

    if (d13 && running) {
      const wave = 1.5 + Math.sin(clock.elapsedTime * 6) * 0.6;
      material.color.set(onColor);
      material.emissive.set(onColor);
      material.emissiveIntensity = wave;
      if (lightRef.current) lightRef.current.intensity = wave + 1.2;
      return;
    }

    material.color.set(baseColor);
    material.emissive.set(onColor);
    material.emissiveIntensity = 0.06;
    if (lightRef.current) lightRef.current.intensity = 0;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.13, 0.025, 0.11]} />
        <meshStandardMaterial color="#242a29" roughness={0.7} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.043, 0]}>
        <boxGeometry args={[0.075, 0.04, 0.062]} />
        <meshStandardMaterial
          ref={materialRef}
          color={baseColor}
          emissive={onColor}
          emissiveIntensity={0.06}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        position={[0, 0.22, 0]}
        color={onColor}
        intensity={0}
        distance={1.8}
        decay={2}
      />

    </group>
  );
};
