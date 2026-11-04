'use client';

import { Edges, RoundedBox } from "@react-three/drei";
import { Path, Shape } from "three";
import { D13Led } from "./D13Led";

interface ArduinoBoardProps {
  d13: boolean;
  paused: boolean;
  running: boolean;
  isDark: boolean;
}

const BOARD_INK = "#0876A8";
const CHIP_INK = "#0F100E";
const USB_METAL = "#c3cbc9";
const PIN_BEIGE = "#c6a766";
const RESET_ORANGE = "#ed583e";
const MOUNT_HOLES: [number, number][] = [
  [-1.2, -0.72],
  [-1.2, 0.72],
  [1.2, -0.72],
  [1.2, 0.72],
];
const BOARD_SHAPE = new Shape();
BOARD_SHAPE.moveTo(-1.27, -0.9);
BOARD_SHAPE.lineTo(1.27, -0.9);
BOARD_SHAPE.lineTo(1.35, -0.82);
BOARD_SHAPE.lineTo(1.35, 0.82);
BOARD_SHAPE.lineTo(1.27, 0.9);
BOARD_SHAPE.lineTo(-1.27, 0.9);
BOARD_SHAPE.lineTo(-1.35, 0.82);
BOARD_SHAPE.lineTo(-1.35, -0.82);
BOARD_SHAPE.closePath();
MOUNT_HOLES.forEach(([x, z]) => {
  const hole = new Path();
  hole.absarc(x, z, 0.06, 0, Math.PI * 2, true);
  BOARD_SHAPE.holes.push(hole);
});

const DIGITAL_PINS = Array.from({ length: 14 }, (_, index) => index);
const ANALOG_PINS = Array.from({ length: 6 }, (_, index) => index);

const PIXEL_FONT: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
};

interface PrintedMarkProps {
  text: string;
  position: [number, number, number];
  cell?: number;
  pitch?: number;
}

const PrintedMark = ({
  text,
  position,
  cell = 0.022,
  pitch = 0.027,
}: PrintedMarkProps) => {
  const pixels: { key: string; x: number; z: number }[] = [];
  let cursor = 0;

  for (const [letterIndex, letter] of Array.from(text).entries()) {
    const glyph = PIXEL_FONT[letter];
    if (glyph) {
      glyph.forEach((row, rowIndex) => {
        Array.from(row).forEach((bit, columnIndex) => {
          if (bit === "1") {
            pixels.push({
              key: `${letterIndex}-${rowIndex}-${columnIndex}`,
              x: cursor + columnIndex * pitch,
              z: rowIndex * pitch,
            });
          }
        });
      });
      cursor += pitch * 5 + pitch * 0.9;
    } else {
      cursor += pitch * 2.4;
    }
  }

  return (
    <group position={position}>
      {pixels.map(({ key, x, z }) => (
        <mesh key={key} position={[x, 0, z]}>
          <boxGeometry args={[cell, 0.002, cell]} />
          <meshBasicMaterial color="#f5f5eb" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export const ArduinoBoard = ({ d13, paused, running, isDark }: ArduinoBoardProps) => {
  const edge = "#9bc8d1";
  const ledger = isDark ? "#8fe294" : "#37ad67";
  return (
    <group rotation={[0, -0.32, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[BOARD_SHAPE, { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.018, bevelThickness: 0.012 }]} />
        <meshStandardMaterial color={BOARD_INK} roughness={0.72} metalness={0.04} />
        <Edges color="#9bc8d1" />
      </mesh>
      <PrintedMark text="UNO R3" position={[-0.94, 0.075, 0.08]} />

      {[0.875, -0.875].map((z) => (
        <mesh key={`trim-x-${z}`} position={[0, 0.079, z]}>
          <boxGeometry args={[2.72, 0.018, 0.035]} />
          <meshBasicMaterial color={edge} />
        </mesh>
      ))}
      {[1.325, -1.325].map((x) => (
        <mesh key={`trim-z-${x}`} position={[x, 0.079, 0]}>
          <boxGeometry args={[0.035, 0.018, 1.82]} />
          <meshBasicMaterial color={edge} />
        </mesh>
      ))}

      {MOUNT_HOLES.map(([x, z]) => (
        <mesh key={`hole-${x}-${z}`} position={[x, 0.079, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.01, 8, 24]} />
          <meshStandardMaterial color={USB_METAL} roughness={0.32} metalness={0.68} />
        </mesh>
      ))}

      <RoundedBox args={[0.42, 0.18, 0.34]} radius={0.035} smoothness={4} position={[-1.12, 0.15, 0.5]} castShadow receiveShadow>
        <meshStandardMaterial color={USB_METAL} roughness={0.32} metalness={0.62} />
      </RoundedBox>
      <mesh position={[-1.334, 0.15, 0.5]}>
        <boxGeometry args={[0.012, 0.11, 0.22]} />
        <meshStandardMaterial color="#182126" roughness={0.4} metalness={0.32} />
      </mesh>
      <mesh position={[-1.342, 0.15, 0.5]}>
        <boxGeometry args={[0.008, 0.045, 0.14]} />
        <meshStandardMaterial color="#c6cfca" roughness={0.28} metalness={0.76} />
      </mesh>

      <RoundedBox args={[0.3, 0.25, 0.26]} radius={0.045} smoothness={6} position={[-1.12, 0.14, -0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#20272b" roughness={0.55} metalness={0.22} />
      </RoundedBox>
      <mesh position={[-1.276, 0.14, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.083, 0.083, 0.012, 32]} />
        <meshStandardMaterial color="#101619" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[-1.284, 0.14, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.067, 0.012, 10, 32]} />
        <meshStandardMaterial color={USB_METAL} roughness={0.27} metalness={0.78} />
      </mesh>
      <mesh position={[-1.287, 0.14, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.014, 20]} />
        <meshStandardMaterial color="#090d0e" roughness={0.25} metalness={0.18} />
      </mesh>

      <mesh position={[-0.95, 0.09, -0.2]}>
        <boxGeometry args={[0.12, 0.06, 0.12]} />
        <meshStandardMaterial color={RESET_ORANGE} roughness={0.45} metalness={0.1}  />
      </mesh>

      {[-1, 1].map((side) => Array.from({ length: 14 }, (_, index) => (
        <mesh
          key={`mcu-leg-${side}-${index}`}
          position={[-0.045 + index * 0.061, 0.082, -0.15 + side * 0.235]}
          castShadow
        >
          <boxGeometry args={[0.035, 0.026, 0.13]} />
          <meshStandardMaterial color={USB_METAL} roughness={0.28} metalness={0.78} />
        </mesh>
      )))}

      <RoundedBox args={[0.9, 0.14, 0.38]} radius={0.035} smoothness={6} position={[0.35, 0.135, -0.15]} castShadow receiveShadow>
        <meshStandardMaterial color={CHIP_INK} roughness={0.62} metalness={0.08} />
        <Edges color="#55616a" />
      </RoundedBox>
      <mesh position={[-0.092, 0.208, -0.15]}>
        <cylinderGeometry args={[0.037, 0.037, 0.006, 24]} />
        <meshStandardMaterial color="#384147" roughness={0.55} />
      </mesh>
      <mesh position={[0.35, 0.208, -0.15]}>
        <boxGeometry args={[0.55, 0.004, 0.018]} />
        <meshBasicMaterial color="#303b3f" />
      </mesh>
      <PrintedMark text="328P" position={[0.16, 0.211, -0.26]} cell={0.009} pitch={0.011} />
      <PrintedMark text="D13" position={[0.68, 0.075, 0.43]} cell={0.008} pitch={0.01} />
      <PrintedMark text="A0" position={[0.13, 0.075, -0.48]} cell={0.008} pitch={0.01} />

      <RoundedBox args={[0.19, 0.075, 0.11]} radius={0.018} smoothness={4} position={[0.05, 0.1, -0.42]} castShadow>
        <meshStandardMaterial color={USB_METAL} roughness={0.26} metalness={0.72} />
      </RoundedBox>

      <mesh position={[0.05, 0.1, 0.31]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.19, 20]} />
        <meshStandardMaterial color={USB_METAL} roughness={0.3} metalness={0.68} />
      </mesh>
      {[-0.62, 0.8].map((x) => (
        <mesh key={`capacitor-${x}`} position={[x, 0.12, -0.28]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.17, 20]} />
          <meshStandardMaterial color="#363a33" roughness={0.55} metalness={0.18} />
        </mesh>
      ))}
      <RoundedBox args={[0.28, 0.08, 0.22]} radius={0.02} smoothness={4} position={[0.99, 0.1, -0.43]} castShadow>
        <meshStandardMaterial color="#292e29" roughness={0.58} metalness={0.2} />
        <Edges color="#737c79" />
      </RoundedBox>

      <RoundedBox args={[2.02, 0.045, 0.115]} radius={0.018} smoothness={4} position={[0, 0.082, 0.62]}>
        <meshStandardMaterial color="#171c1e" roughness={0.82} />
      </RoundedBox>
      {DIGITAL_PINS.map((pin) => (
        <group key={`digital-${pin}`} position={[-0.88 + pin * 0.137, 0, 0.62]}>
          <mesh position={[0, 0.108, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.014, 20]} />
            <meshStandardMaterial color={PIN_BEIGE} roughness={0.27} metalness={0.82} />
          </mesh>
          <mesh position={[0, 0.116, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.003, 16]} />
            <meshStandardMaterial color="#182024" roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[0.89, 0.045, 0.115]} radius={0.018} smoothness={4} position={[0.485, 0.082, -0.62]}>
        <meshStandardMaterial color="#171c1e" roughness={0.82} />
      </RoundedBox>
      {ANALOG_PINS.map((pin) => (
        <group key={`analog-${pin}`} position={[0.14 + pin * 0.138, 0, -0.62]}>
          <mesh position={[0, 0.108, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.014, 20]} />
            <meshStandardMaterial color={PIN_BEIGE} roughness={0.27} metalness={0.82} />
          </mesh>
          <mesh position={[0, 0.116, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.003, 16]} />
            <meshStandardMaterial color="#182024" roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      ))}

      <D13Led
        d13={d13}
        paused={paused}
        running={running}
        onColor={ledger}
        pausedColor={RESET_ORANGE}
        baseColor={CHIP_INK}
      />
    </group>
  );
};
