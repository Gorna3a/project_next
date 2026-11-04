'use client';

import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useCursor } from "@react-three/drei";
import { MOUSE, TOUCH } from "three";
import { useTheme } from "@core/context/ThemeContext";
import type { WireRoutingController } from "../../hooks/useWireRouting";
import {
  type BenchComponent,
  type BenchComponentKind,
  type BenchTool,
} from "./bench";
import {
  ARDUINO_DESCRIPTOR,
  BREADBOARD_DESCRIPTOR,
  describeBenchComponent,
  isPartSelected,
  resolveSceneSelection,
  type SceneSelection,
} from "./focus";
import { ArduinoBoard } from "./ArduinoBoard";
import { Breadboard } from "./Breadboard";
import { BreadboardSocketField } from "./BreadboardSocketField";
import {
  CameraFocusRig,
  type CameraFocusRequest,
} from "./CameraFocusRig";
import { CircuitWire } from "./CircuitWire";
import { ExternalLed } from "./ExternalLed";
import { PlacementGhost } from "./PlacementGhost";
import { PinSocket } from "./PinSocket";
import { PushButton } from "./PushButton";
import { Resistor } from "./Resistor";
import { SelectablePart } from "./SelectablePart";
import {
  BOARD_ANCHORS,
  BOARD_POSITION,
  BOARD_YAW,
  BREADBOARD_POSITION,
  DESK_Y,
  type Vec3,
  type WireAnchor,
} from "./layout";

export interface BoardSceneProps {
  d13: boolean;
  paused: boolean;
  running: boolean;
  routing: WireRoutingController;
  tool: BenchTool;
  placementKind: BenchComponentKind | null;
  components: BenchComponent[];
  selected: SceneSelection | null;
  focusNonce: number;
  onSelect: (selection: SceneSelection, focus: boolean) => void;
  onMove: (id: string, position: Vec3) => void;
  onPlace: (position: Vec3) => void;
}

const PREVIEW_LIFT = 0.5;

const touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };

const renderBenchPart = (component: BenchComponent, interactive: boolean) => {
  if (component.kind === "button") {
    return <PushButton interactive={interactive} />;
  }
  if (component.kind === "resistor") {
    return <Resistor />;
  }
  return <ExternalLed />;
};

export const BoardScene = ({
  d13,
  paused,
  running,
  routing,
  tool,
  placementKind,
  components,
  selected,
  focusNonce,
  onSelect,
  onMove,
  onPlace,
}: BoardSceneProps) => {
  const { themeData } = useTheme();
  const [hoveredAnchor, setHoveredAnchor] = useState<WireAnchor | null>(null);
  const [shiftDown, setShiftDown] = useState(false);

  const wireMode = tool === "wire";
  const selectMode = tool === "select";
  const focusDescriptor = resolveSceneSelection(selected, components);
  const focusRequest: CameraFocusRequest | null = focusDescriptor
    ? {
        target: focusDescriptor.position,
        distance: focusDescriptor.focusDistance,
        nonce: focusNonce,
      }
    : null;

  const { activeSource, wires, color, selectAnchor, cancel } = routing;
  const previewTarget =
    wireMode &&
    activeSource &&
    hoveredAnchor &&
    hoveredAnchor.id !== activeSource.id
      ? hoveredAnchor
      : null;

  useCursor(wireMode && Boolean(hoveredAnchor));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") setShiftDown(true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") setShiftDown(false);
    };
    const handleBlur = () => setShiftDown(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleSelect = useCallback(
    (selection: SceneSelection, focus: boolean) => {
      onSelect(selection, focus);
    },
    [onSelect],
  );

  const mouseButtons = {
    LEFT: shiftDown ? MOUSE.PAN : MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN,
  };

  return (
    <div
      className="h-full w-full"
      onContextMenu={(event) => event.preventDefault()}
    >
      <Canvas shadows
        dpr={[1, 1.75]}
        camera={{ position: [2.9, 2.1, 3.45], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "none" }}
        onPointerMissed={(event) => {
          if (wireMode && event.button === 0 && !event.shiftKey) cancel();
        }}
      >
        <hemisphereLight args={["#fff8ec", "#61717c", 1.2]} />
        <ambientLight intensity={0.52} />
        <directionalLight
          position={[3.5, 6, 4]}
          intensity={2.15}
          castShadow
          shadow-mapSize-width={1536}
          shadow-mapSize-height={1536}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.00025}
          shadow-radius={5}
        />
        <pointLight position={[-2, 3, -1]} intensity={0.65} color="#cce9ff" />
        <ContactShadows
          position={[0, DESK_Y, 0]}
          opacity={0.22}
          scale={8}
          blur={2.4}
          far={3.5}
          resolution={512}
          color="#30404a"
        />
        
        <Suspense fallback={null}>
          <SelectablePart
            descriptor={ARDUINO_DESCRIPTOR}
            enabled={selectMode}
            selected={selected?.kind === "arduino"}
            position={BOARD_POSITION}
            onSelect={handleSelect}
          >
            <ArduinoBoard
              d13={d13}
              paused={paused}
              running={running}
              isDark={themeData.isDark}
            />
          </SelectablePart>

          {BOARD_ANCHORS.map((anchor) => (
            <PinSocket
              key={anchor.id}
              anchor={anchor}
              rotationY={BOARD_YAW}
              isDark={themeData.isDark}
              hovered={wireMode && hoveredAnchor?.id === anchor.id}
              selected={wireMode && activeSource?.id === anchor.id}
              visualOnly={!wireMode}
              onHover={setHoveredAnchor}
              onSelect={selectAnchor}
            />
          ))}

          <SelectablePart
            descriptor={BREADBOARD_DESCRIPTOR}
            enabled={selectMode}
            selected={selected?.kind === "breadboard"}
            position={BREADBOARD_POSITION}
            onSelect={handleSelect}
          >
            <Breadboard isDark={themeData.isDark} />
          </SelectablePart>

          {wireMode && (
            <BreadboardSocketField
              onHover={setHoveredAnchor}
              onSelect={selectAnchor}
            />
          )}

          {wireMode && activeSource?.kind === "breadboard" && (
            <PinSocket
              anchor={activeSource}
              visualOnly
              selected
              size={0.038}
              isDark={themeData.isDark}
            />
          )}
          {wireMode &&
            hoveredAnchor?.kind === "breadboard" &&
            hoveredAnchor.id !== activeSource?.id && (
              <PinSocket
                anchor={hoveredAnchor}
                visualOnly
                hovered
                size={0.038}
                isDark={themeData.isDark}
              />
            )}

          {components.map((component) => (
            <SelectablePart
              key={component.id}
              descriptor={describeBenchComponent(component)}
              enabled={selectMode}
              selected={isPartSelected(selected, component.id)}
              position={component.position}
              rotationY={component.rotationY}
              draggable
              onSelect={handleSelect}
              onMove={(position) => onMove(component.id, position)}
            >
              {renderBenchPart(component, selectMode)}
            </SelectablePart>
          ))}

          {wires.map((wire, index) => (
            <CircuitWire
              key={wire.id}
              from={wire.from.position}
              to={wire.to.position}
              color={wire.color}
            lift={0.22 + (index % 4) * 0.04}
            />
          ))}

          {wireMode && activeSource && previewTarget && (
            <CircuitWire
              from={activeSource.position}
              to={previewTarget.position}
              color={color}
              lift={PREVIEW_LIFT}
              opacity={0.45}
              glowOpacity={0.1}
              caps={false}
            />
          )}

          <CameraFocusRig request={focusRequest} />

          {tool === "place" && placementKind && (
            <PlacementGhost kind={placementKind} onPlace={onPlace} />
          )}
        </Suspense>
        <OrbitControls
          makeDefault
          enableZoom
          enablePan
          enableDamping
          dampingFactor={0.08}
          zoomToCursor
          screenSpacePanning={false}
          maxPolarAngle={Math.PI / 2 - 0.04}
          minDistance={1.2}
          maxDistance={12}
          target={[-0.05, 0.05, 0.1]}
          mouseButtons={mouseButtons}
          touches={touches}
        />
      </Canvas>
    </div>
  );
};

export default BoardScene;
