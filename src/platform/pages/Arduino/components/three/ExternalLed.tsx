'use client';

import { AdditiveBlending } from "three";
import { Edges } from "@react-three/drei";

export interface ExternalLedProps {
  position?: [number, number, number];
  rotationY?: number;
  color?: string;
}

const LEAD_METAL = "#8C9186";

export const ExternalLed = ({
  position = [0, 0, 0],
  rotationY = 0,
  color = "#e44d43",
}: ExternalLedProps) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.05, 0.05].map((x) => (
        <mesh key={`leg-${x}`} position={[x, -0.03, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.085, 12]} />
          <meshStandardMaterial
            color={LEAD_METAL}
            roughness={0.32}
            metalness={0.68}
            
          />
        </mesh>
      ))}

      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.075, 24, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.32}
          roughness={0.36}
          metalness={0.04}
          transparent
          opacity={0.86}
          
        />
        <Edges color="#7AA800" />
      </mesh>

      <mesh position={[0, 0.08, 0]} scale={[1, 0.86, 1]}>
        <sphereGeometry args={[0.045, 24, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.42}
          roughness={0.3}
          metalness={0.03}
          transparent
          opacity={0.9}
          
        />
      </mesh>

      <mesh position={[0, 0.078, 0]} scale={1.35} raycast={() => undefined}>
        <sphereGeometry args={[0.045, 24, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
