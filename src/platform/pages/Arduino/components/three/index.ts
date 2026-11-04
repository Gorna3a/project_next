export { ArduinoBoard } from "./ArduinoBoard";
export { Breadboard, type BreadboardProps } from "./Breadboard";
export {
  CameraFocusRig,
  type CameraFocusRequest,
} from "./CameraFocusRig";
export {
  BreadboardSocketField,
  type BreadboardSocketFieldProps,
} from "./BreadboardSocketField";
export { CircuitWire, type CircuitWireProps } from "./CircuitWire";
export { D13Led } from "./D13Led";
export { ExternalLed, type ExternalLedProps } from "./ExternalLed";
export {
  PlacementGhost,
  type PlacementGhostProps,
} from "./PlacementGhost";
export { PinSocket, type PinSocketProps } from "./PinSocket";
export { PushButton, type PushButtonProps } from "./PushButton";
export { Resistor, type ResistorProps } from "./Resistor";
export {
  SelectablePart,
  type SelectablePartProps,
} from "./SelectablePart";
export {
  BENCH_BOUNDS,
  BENCH_PART_ORDER,
  BENCH_PART_SPECS,
  BREADBOARD_SURFACE_BOUNDS,
  benchSurfaceY,
  createSeedBenchComponents,
  isOnBreadboard,
  snapBenchPosition,
  type BenchAura,
  type BenchComponent,
  type BenchComponentKind,
  type BenchPartSpec,
  type BenchTool,
} from "./bench";
export {
  ARDUINO_DESCRIPTOR,
  BREADBOARD_DESCRIPTOR,
  describeBenchComponent,
  isPartSelected,
  resolveSceneSelection,
  type SceneAura,
  type SceneDescriptor,
  type SceneSelection,
} from "./focus";
export {
  BOARD_ANCHORS,
  BOARD_ANCHOR_BY_ID,
  BOARD_PINS,
  BOARD_POSITION,
  BOARD_YAW,
  BREADBOARD_POSITION,
  BREADBOARD_SIZE,
  BREADBOARD_TOP,
  DEFAULT_WIRE_TARGET,
  DESK_Y,
  D13_ANCHOR,
  HOLE_COLUMNS,
  HOLE_COUNT,
  HOLE_LOCAL_Y,
  HOLE_PITCH,
  HOLE_ROWS,
  HOLE_SIZE,
  PIN_13_LOCAL,
  PIN_13_WORLD,
  PUSHBUTTON_POSITION,
  RESISTOR_POSITION,
  WIRE_TARGET,
  breadboardAnchor,
  breadboardHole,
  nearestBreadboardAnchor,
  rotateYPoint,
  toBoardWorld,
  type BoardPin,
  type Vec3,
  type WireAnchor,
} from "./layout";
