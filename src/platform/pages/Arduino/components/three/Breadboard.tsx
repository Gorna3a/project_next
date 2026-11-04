'use client';

import { useLayoutEffect, useRef } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import { Object3D } from "three";
import type { InstancedMesh } from "three";
import {
  BREADBOARD_SIZE,
  HOLE_COLUMNS,
  HOLE_COUNT,
  HOLE_LOCAL_Y,
  HOLE_PITCH,
  HOLE_ROWS,
  HOLE_SIZE,
} from "./layout";

export interface BreadboardProps {
  position?: [number, number, number];
  isDark?: boolean;
}

const INK = "#202a30";
const BEIGE = "#f8f8f3";
const GREY = "#dfe4e3";
const LIGHT_GROOVE = "#d8dedc";
const DARK_GROOVE = "#66757c";

export const Breadboard = ({
  position = [0, 0, 0],
  isDark = false,
}: BreadboardProps) => {
  const holesRef = useRef<InstancedMesh | null>(null);
  const edge = isDark ? "#54636a" : "#c9d2d1";
  const accent = isDark ? "#55b8c9" : "#258ca4";
  const groove = isDark ? DARK_GROOVE : LIGHT_GROOVE;

  useLayoutEffect(() => {
    const mesh = holesRef.current;
    if (!mesh) return;

    const dummy = new Object3D();
    let index = 0;

    for (const bank of [1, -1]) {
      for (let row = 0; row < HOLE_ROWS; row += 1) {
        const z = bank * (0.09 + row * HOLE_PITCH);
        for (let column = 0; column < HOLE_COLUMNS; column += 1) {
          const x =
            -((HOLE_COLUMNS - 1) * HOLE_PITCH) / 2 + column * HOLE_PITCH;
          dummy.position.set(x, HOLE_LOCAL_Y, z);
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
          index += 1;
        }
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group position={position}>
      <RoundedBox
        args={[BREADBOARD_SIZE.width, BREADBOARD_SIZE.height, BREADBOARD_SIZE.depth]}
        radius={0.035}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={isDark ? GREY : BEIGE}
          roughness={0.8}
          metalness={0.04}
        />
        <Edges color={edge} />
      </RoundedBox>

      <mesh position={[0, BREADBOARD_SIZE.height / 2 + 0.001, 0]}>
        <boxGeometry args={[1.7, 0.006, 0.09]} />
        <meshStandardMaterial color={groove} roughness={0.9} />
      </mesh>

      {[0.32, -0.32].map((z) => (
        <group key={`rail-${z}`} position={[0, BREADBOARD_SIZE.height / 2 + 0.001, z]}>
          <mesh>
            <boxGeometry args={[1.7, 0.006, 0.05]} />
            <meshStandardMaterial color={groove} roughness={0.9} />
          </mesh>
          {[
            { color: "#d75a4d", offset: -0.012 },
            { color: "#4c77ad", offset: 0.012 },
          ].map(({ color, offset }) => (
            <mesh key={color} position={[0, 0.004, offset]}>
              <boxGeometry args={[1.62, 0.003, 0.005]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      ))}

      {[-1, 1].flatMap((bank) =>
        Array.from({ length: 6 }, (_, mark) => {
          const x = -((HOLE_COLUMNS - 1) * HOLE_PITCH) / 2 + mark * 5 * HOLE_PITCH;
          return (
            <mesh
              key={`index-${bank}-${mark}`}
              position={[x, BREADBOARD_SIZE.height / 2 + 0.004, bank * 0.19]}
            >
              <boxGeometry args={[0.012, 0.003, 0.02]} />
              <meshStandardMaterial color={isDark ? "#bec8b4" : "#6c7169"} roughness={0.7} />
            </mesh>
          );
        }),
      )}

      {[0.32, -0.32].map((z) => (
        <group key={`ticks-${z}`}>
          <mesh position={[-0.82, BREADBOARD_SIZE.height / 2 + 0.004, z]}>
            <boxGeometry args={[0.03, 0.008, 0.024]} />
            <meshStandardMaterial color="#FF6B1A" roughness={0.6} />
          </mesh>
          <mesh position={[0.82, BREADBOARD_SIZE.height / 2 + 0.004, z]}>
            <boxGeometry args={[0.03, 0.008, 0.024]} />
            <meshStandardMaterial
              color={accent}
              emissive={accent}
              emissiveIntensity={0.25}
              roughness={0.6}
    
            />
          </mesh>
        </group>
      ))}

      <instancedMesh ref={holesRef} args={[undefined, undefined, HOLE_COUNT]}>
        <cylinderGeometry args={[HOLE_SIZE * 0.46, HOLE_SIZE * 0.46, 0.006, 16]} />
        <meshStandardMaterial color={INK} roughness={0.9} metalness={0.12} />
      </instancedMesh>
    </group>
  );
};
