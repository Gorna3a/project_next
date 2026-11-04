'use client';

import { useMemo } from "react";
import { AdditiveBlending, QuadraticBezierCurve3, Vector3 } from "three";

export interface CircuitWireProps {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  lift?: number;
  radius?: number;
  opacity?: number;
  glowOpacity?: number;
  glowColor?: string;
  caps?: boolean;
}

const CURVE_SEGMENTS = 48;
const RADIAL_SEGMENTS = 10;
const GROUND_GLOW = "#71808a";

export const CircuitWire = ({
  from,
  to,
  color = "#E0B64D",
  lift = 0.28,
  radius = 0.009,
  opacity = 1,
  glowOpacity = 0.07,
  glowColor,
  caps = true,
}: CircuitWireProps) => {
  const curve = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const control = new Vector3(
      (start.x + end.x) / 2,
      Math.max(start.y, end.y) + lift,
      (start.z + end.z) / 2,
    );
    return new QuadraticBezierCurve3(start, control, end);
  }, [from, to, lift]);

  const glow = glowColor ?? (color === "#20252C" ? GROUND_GLOW : color);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, CURVE_SEGMENTS, radius, RADIAL_SEGMENTS, false]} />
        <meshStandardMaterial
          color={color}
          roughness={0.32}
          metalness={0.02}
          transparent={opacity < 1}
          opacity={opacity}
          depthWrite={opacity >= 1}
        />
      </mesh>

      <mesh>
        <tubeGeometry
          args={[curve, CURVE_SEGMENTS, radius * 1.55, RADIAL_SEGMENTS, false]}
        />
        <meshBasicMaterial
          color={glow}
          toneMapped={false}
          transparent
          opacity={glowOpacity}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {caps &&
        [from, to].map((point) => (
          <mesh key={point.join(",")} position={point}>
            <sphereGeometry args={[radius * 1.7, 8, 8]} />
            <meshBasicMaterial color={glow} toneMapped={false} />
          </mesh>
        ))}
    </group>
  );
};
