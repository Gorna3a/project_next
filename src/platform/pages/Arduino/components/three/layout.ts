export type Vec3 = [number, number, number];

export const DESK_Y = -0.076;

export const BOARD_POSITION: Vec3 = [-1.05, 0, 0];
export const BOARD_YAW = -0.32;

export const BREADBOARD_SIZE = {
  width: 1.8,
  height: 0.14,
  depth: 0.78,
} as const;

export const BREADBOARD_POSITION: Vec3 = [1.35, 0, 0.05];
export const BREADBOARD_TOP = BREADBOARD_POSITION[1] + BREADBOARD_SIZE.height / 2;

export const HOLE_COLUMNS = 30;
export const HOLE_ROWS = 5;
export const HOLE_PITCH = 0.05;
export const HOLE_SIZE = 0.026;
export const HOLE_LOCAL_Y = BREADBOARD_SIZE.height / 2 - 0.002;
export const HOLE_COUNT = HOLE_COLUMNS * HOLE_ROWS * 2;

export const BOARD_DIGITAL_Z = 0.62;
export const BOARD_ANALOG_Z = -0.62;
export const BOARD_PIN_ANCHOR_LOCAL_Y = 0.095 + 0.075 / 2 + 0.014;
export const DIGITAL_PIN_COUNT = 14;
export const ANALOG_PIN_COUNT = 6;

export const DIGITAL_PIN_LOCAL_X = (index: number): number =>
  -0.88 + index * 0.137;
export const ANALOG_PIN_LOCAL_X = (index: number): number =>
  0.14 + index * 0.138;

export const PIN_13_LOCAL: Vec3 = [
  DIGITAL_PIN_LOCAL_X(13),
  BOARD_PIN_ANCHOR_LOCAL_Y,
  BOARD_DIGITAL_Z,
];

export const PUSHBUTTON_POSITION: Vec3 = [0.925, BREADBOARD_TOP + 0.035, BREADBOARD_POSITION[2]];
export const RESISTOR_POSITION: Vec3 = [1.525, BREADBOARD_TOP + 0.04, -0.14];

export const rotateYPoint = ([x, y, z]: Vec3, angle: number): Vec3 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
};

export const toBoardWorld = (local: Vec3): Vec3 => {
  const [x, y, z] = rotateYPoint(local, BOARD_YAW);
  return [x + BOARD_POSITION[0], y + BOARD_POSITION[1], z + BOARD_POSITION[2]];
};

export const PIN_13_WORLD = toBoardWorld(PIN_13_LOCAL);

export interface WireAnchor {
  id: string;
  label: string;
  kind: "board" | "breadboard";
  position: Vec3;
}

export interface BoardPin {
  id: string;
  label: string;
  group: "digital" | "analog";
  local: Vec3;
  position: Vec3;
}

const buildPin = (
  id: string,
  label: string,
  group: "digital" | "analog",
  local: Vec3,
): BoardPin => ({
  id,
  label,
  group,
  local,
  position: toBoardWorld(local),
});

export const BOARD_PINS: BoardPin[] = [
  ...Array.from({ length: DIGITAL_PIN_COUNT }, (_, index) =>
    buildPin(`board:d${index}`, `D${index}`, "digital", [
      DIGITAL_PIN_LOCAL_X(index),
      BOARD_PIN_ANCHOR_LOCAL_Y,
      BOARD_DIGITAL_Z,
    ]),
  ),
  ...Array.from({ length: ANALOG_PIN_COUNT }, (_, index) =>
    buildPin(`board:a${index}`, `A${index}`, "analog", [
      ANALOG_PIN_LOCAL_X(index),
      BOARD_PIN_ANCHOR_LOCAL_Y,
      BOARD_ANALOG_Z,
    ]),
  ),
];

export const BOARD_ANCHORS: WireAnchor[] = BOARD_PINS.map((pin) => ({
  id: pin.id,
  label: pin.label,
  kind: "board",
  position: pin.position,
}));

export const BOARD_ANCHOR_BY_ID = new Map(
  BOARD_ANCHORS.map((anchor) => [anchor.id, anchor]),
);

export const D13_ANCHOR =
  BOARD_ANCHOR_BY_ID.get("board:d13") ?? BOARD_ANCHORS[BOARD_ANCHORS.length - 1];

export const breadboardHole = (
  column: number,
  row: number,
  bank: "A" | "B",
): Vec3 => {
  const x =
    BREADBOARD_POSITION[0] -
    ((HOLE_COLUMNS - 1) * HOLE_PITCH) / 2 +
    column * HOLE_PITCH;
  const rowOffset = 0.09 + row * HOLE_PITCH;
  const z =
    BREADBOARD_POSITION[2] + (bank === "A" ? rowOffset : -rowOffset);
  return [x, BREADBOARD_TOP + 0.005, z];
};

export const breadboardAnchor = (
  column: number,
  row: number,
  bank: "A" | "B",
): WireAnchor => ({
  id: `bb:${bank}:${column}:${row}`,
  label: `${bank}${column + 1}`,
  kind: "breadboard",
  position: breadboardHole(column, row, bank),
});

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const nearestBreadboardAnchor = (point: Vec3): WireAnchor => {
  const localX = point[0] - BREADBOARD_POSITION[0];
  const localZ = point[2] - BREADBOARD_POSITION[2];
  const halfSpan = ((HOLE_COLUMNS - 1) * HOLE_PITCH) / 2;
  const column = clamp(
    Math.round((localX + halfSpan) / HOLE_PITCH),
    0,
    HOLE_COLUMNS - 1,
  );
  const row = clamp(
    Math.round((Math.abs(localZ) - 0.09) / HOLE_PITCH),
    0,
    HOLE_ROWS - 1,
  );
  const bank: "A" | "B" = localZ >= 0 ? "A" : "B";
  return breadboardAnchor(column, row, bank);
};

export const WIRE_TARGET = breadboardHole(1, 0, "A");
export const DEFAULT_WIRE_TARGET = breadboardAnchor(1, 0, "A");
