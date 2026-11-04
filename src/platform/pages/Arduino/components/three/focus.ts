import {
  BENCH_PART_SPECS,
  type BenchComponent,
  type BenchComponentKind,
} from "./bench";
import {
  BOARD_POSITION,
  BOARD_YAW,
  BREADBOARD_POSITION,
  type Vec3,
} from "./layout";

export type SceneSelection =
  | { kind: "arduino" }
  | { kind: "breadboard" }
  | { kind: "part"; id: string };

export interface SceneAura {
  size: Vec3;
  center: Vec3;
  rotationY: number;
}

export interface SceneDescriptor {
  id: string;
  kind: SceneSelection["kind"];
  partKind?: BenchComponentKind;
  selection: SceneSelection;
  label: string;
  category: string;
  description: string;
  tooltip: string;
  specs: string[];
  position: Vec3;
  focusDistance: number;
  removable: boolean;
  rotationY: number;
  aura: SceneAura;
}

export const ARDUINO_DESCRIPTOR: SceneDescriptor = {
  id: "arduino",
  kind: "arduino",
  selection: { kind: "arduino" },
  label: "Arduino UNO R3",
  category: "Microcontroller",
  description:
    "ATmega328P development board with a live D13 LED. Switch to WIRE mode to route patch leads from the digital and analog headers.",
  tooltip: "ATmega328P / D13 live",
  specs: ["ATmega328P / 16 MHZ", "14 DIGITAL / 6 ANALOG", "D13 LED LIVE"],
  position: BOARD_POSITION,
  focusDistance: 3.6,
  removable: false,
  rotationY: 0,
  aura: {
    size: [2.84, 0.32, 1.94],
    center: [0, 0.06, 0],
    rotationY: BOARD_YAW,
  },
};

export const BREADBOARD_DESCRIPTOR: SceneDescriptor = {
  id: "breadboard",
  kind: "breadboard",
  selection: { kind: "breadboard" },
  label: "Solderless Breadboard",
  category: "Prototyping",
  description:
    "Thirty-column breadboard with two terminal banks and power rails. In WIRE mode every tie point becomes a routing target; in SELECT mode the surface focuses this component.",
  tooltip: "30 x 10 tie points",
  specs: ["30 x 10 TIE POINTS", "2 POWER RAILS", "FIXED BASE"],
  position: BREADBOARD_POSITION,
  focusDistance: 2.9,
  removable: false,
  rotationY: 0,
  aura: {
    size: [1.9, 0.22, 1.4],
    center: [0, 0.01, 0],
    rotationY: 0,
  },
};

export const describeBenchComponent = (
  component: BenchComponent,
): SceneDescriptor => {
  const spec = BENCH_PART_SPECS[component.kind];

  return {
    id: component.id,
    kind: "part",
    partKind: component.kind,
    selection: { kind: "part", id: component.id },
    label: spec.label,
    category: spec.category,
    description: spec.description,
    tooltip: spec.tooltip,
    specs: spec.specs,
    position: component.position,
    focusDistance: spec.focusDistance,
    removable: true,
    rotationY: component.rotationY,
    aura: {
      ...spec.aura,
      rotationY: 0,
    },
  };
};

export const resolveSceneSelection = (
  selection: SceneSelection | null,
  components: BenchComponent[],
): SceneDescriptor | null => {
  if (!selection) return null;
  if (selection.kind === "arduino") return ARDUINO_DESCRIPTOR;
  if (selection.kind === "breadboard") return BREADBOARD_DESCRIPTOR;

  const component = components.find((item) => item.id === selection.id);
  return component ? describeBenchComponent(component) : null;
};

export const isPartSelected = (
  selection: SceneSelection | null,
  id: string,
): boolean => selection?.kind === "part" && selection.id === id;
