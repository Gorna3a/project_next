'use client';

import { Edges } from "@react-three/drei";

export interface ResistorProps {
  position?: [number, number, number];
  rotationY?: number;
}

const CERAMIC = "#D6CFBC";
const LEAD_METAL = "#8C9186";
const STRIPES: { x: number; color: string }[] = [
  { x: -0.08, color: "#FF6B1A" },
  { x: -0.01, color: "#A6E000" },
  { x: 0.06, color: "#FFE600" },
];

export const Resistor = ({
  position = [0, 0, 0],
  rotationY = 0,
}: ResistorProps) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.34, 28, 1]} />
        <meshStandardMaterial color={CERAMIC} roughness={0.72} metalness={0.04}  />
        <Edges color="#7AA800" />
      </mesh>

      {[-0.2, 0.2].map((x) => (
        <mesh key={`lead-${x}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.06, 12, 1]} />
          <meshStandardMaterial color={LEAD_METAL} roughness={0.32} metalness={0.65}  />
        </mesh>
      ))}

      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, -0.055, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.11, 12]} />
          <meshStandardMaterial color={LEAD_METAL} roughness={0.32} metalness={0.68} />
        </mesh>
      ))}

      {STRIPES.map(({ x, color }) => (
        <mesh key={color} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.037, 0.008, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.22}
            roughness={0.48}
            metalness={0.08}
            
          />
        </mesh>
      ))}
    </group>
  );
};
