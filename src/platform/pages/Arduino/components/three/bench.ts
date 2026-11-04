import {
  BREADBOARD_POSITION,
  BREADBOARD_SIZE,
  BREADBOARD_TOP,
  DESK_Y,
  HOLE_COLUMNS,
  HOLE_PITCH,
  HOLE_ROWS,
  PUSHBUTTON_POSITION,
  RESISTOR_POSITION,
  type Vec3,
} from "./layout";

export type BenchTool = "select" | "wire" | "place";
export type BenchComponentKind = "button" | "resistor" | "led";

export interface BenchComponent {
  id: string;
  kind: BenchComponentKind;
  position: Vec3;
  rotationY: number;
}

export interface BenchAura {
  size: Vec3;
  center: Vec3;
}

export interface BenchPartSpec {
  label: string;
  shortLabel: string;
  category: string;
  description: string;
  tooltip: string;
  specs: string[];
  aura: BenchAura;
  ghostSize: Vec3;
  mountOffset: number;
  deskOffset: number;
  focusDistance: number;
  defaultRotation: number;
}

export const BENCH_PART_SPECS: Record<BenchComponentKind, BenchPartSpec> = {
  button: {
    label: "Tactile Pushbutton",
    shortLabel: "Button",
    category: "Momentary input",
    description:
      "Four-leg tactile switch centered across the breadboard channel. Presses animate on the bench; its legs are not yet mapped into the electrical netlist.",
    tooltip: "Momentary SPST",
    specs: ["4-LEG TACTILE", "MOMENTARY SPST", "ORANGE PLUNGER"],
    aura: { size: [0.3, 0.18, 0.3], center: [0, 0.045, 0] },
    ghostSize: [0.26, 0.14, 0.26],
    mountOffset: 0.035,
    deskOffset: 0.035,
    focusDistance: 1.7,
    defaultRotation: 0,
  },
  resistor: {
    label: "Carbon Resistor",
    shortLabel: "Resistor",
    category: "Passive component",
    description:
      "Axial carbon-film resistor with three decorative colour bands. Its leads align to the breadboard grid when it is placed on the board.",
    tooltip: "Carbon film / axial",
    specs: ["CARBON FILM", "3-BAND MARKING", "AXIAL LEADS"],
    aura: { size: [0.58, 0.12, 0.14], center: [0, 0, 0] },
    ghostSize: [0.56, 0.08, 0.12],
    mountOffset: 0.04,
    deskOffset: 0.035,
    focusDistance: 1.5,
    defaultRotation: 0,
  },
  led: {
    label: "Indicator LED",
    shortLabel: "LED",
    category: "Visual output",
    description:
      "Five-millimetre phosphor LED with a diffused dome and two metal legs. Visual hardware only until component-level nets are added.",
    tooltip: "5 mm phosphor LED",
    specs: ["5 MM DIFFUSED", "PHOSPHOR DOME", "2-LEG PACKAGE"],
    aura: { size: [0.16, 0.22, 0.16], center: [0, 0.07, 0] },
    ghostSize: [0.12, 0.18, 0.12],
    mountOffset: 0.055,
    deskOffset: 0.073,
    focusDistance: 1.4,
    defaultRotation: 0,
  },
};

export const BENCH_PART_ORDER: BenchComponentKind[] = [
  "button",
  "resistor",
  "led",
];

const BREADBOARD_MARGIN = 0.09;
const BREADBOARD_SNAP = HOLE_PITCH;
const DESK_SNAP = 0.1;

export const BREADBOARD_SURFACE_BOUNDS = {
  minX: BREADBOARD_POSITION[0] - BREADBOARD_SIZE.width / 2 + BREADBOARD_MARGIN,
  maxX: BREADBOARD_POSITION[0] + BREADBOARD_SIZE.width / 2 - BREADBOARD_MARGIN,
  minZ: BREADBOARD_POSITION[2] - BREADBOARD_SIZE.depth / 2 + BREADBOARD_MARGIN,
  maxZ: BREADBOARD_POSITION[2] + BREADBOARD_SIZE.depth / 2 - BREADBOARD_MARGIN,
} as const;

export const BENCH_BOUNDS = {
  minX: -2.7,
  maxX: 3.1,
  minZ: -1.25,
  maxZ: 1.45,
} as const;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const snap = (value: number, step: number): number =>
  Number((Math.round(value / step) * step).toFixed(2));

export const isOnBreadboard = (x: number, z: number): boolean =>
  x >= BREADBOARD_SURFACE_BOUNDS.minX &&
  x <= BREADBOARD_SURFACE_BOUNDS.maxX &&
  z >= BREADBOARD_SURFACE_BOUNDS.minZ &&
  z <= BREADBOARD_SURFACE_BOUNDS.maxZ;

export const benchSurfaceY = (x: number, z: number): number =>
  isOnBreadboard(x, z) ? BREADBOARD_TOP : DESK_Y;

export const snapBenchPosition = (
  [x, , z]: Vec3,
  kind: BenchComponentKind,
): Vec3 => {
  const spec = BENCH_PART_SPECS[kind];
  const onBreadboard = isOnBreadboard(x, z);

  if (onBreadboard) {
    const firstHoleX =
      BREADBOARD_POSITION[0] - ((HOLE_COLUMNS - 1) * BREADBOARD_SNAP) / 2;
    const lastHoleX = firstHoleX + (HOLE_COLUMNS - 1) * BREADBOARD_SNAP;
    const clampedX = clamp(x, firstHoleX, lastHoleX);
    const snappedX = Number(
      (firstHoleX + Math.round((clampedX - firstHoleX) / BREADBOARD_SNAP) * BREADBOARD_SNAP).toFixed(3),
    );
    const rowPositions = Array.from({ length: HOLE_ROWS }, (_, row) => {
      const offset = 0.09 + row * BREADBOARD_SNAP;
      return [
        BREADBOARD_POSITION[2] + offset,
        BREADBOARD_POSITION[2] - offset,
      ];
    }).flat();
    const snappedZ =
      kind === "button"
        ? BREADBOARD_POSITION[2]
        : rowPositions.reduce((nearest, candidate) =>
            Math.abs(candidate - z) < Math.abs(nearest - z) ? candidate : nearest,
          );
    return [
      snappedX,
      BREADBOARD_TOP + spec.mountOffset,
      Number(snappedZ.toFixed(3)),
    ];
  }

  return [
    snap(clamp(x, BENCH_BOUNDS.minX, BENCH_BOUNDS.maxX), DESK_SNAP),
    DESK_Y + spec.deskOffset,
    snap(clamp(z, BENCH_BOUNDS.minZ, BENCH_BOUNDS.maxZ), DESK_SNAP),
  ];
};

export const createSeedBenchComponents = (): BenchComponent[] => [
  {
    id: "part-seed-button",
    kind: "button",
    position: PUSHBUTTON_POSITION,
    rotationY: 0,
  },
  {
    id: "part-seed-resistor",
    kind: "resistor",
    position: RESISTOR_POSITION,
    rotationY: 0,
  },
];
