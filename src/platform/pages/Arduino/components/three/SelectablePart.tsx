'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCursor } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  EdgesGeometry,
  Plane,
  Vector2,
  Vector3,
} from "three";
import { useTheme } from "@core/context/ThemeContext";
import { snapBenchPosition } from "./bench";
import { setControlsEnabled } from "./controls";
import type { SceneDescriptor, SceneSelection } from "./focus";
import type { Vec3 } from "./layout";

export interface SelectablePartProps {
  descriptor: SceneDescriptor;
  enabled: boolean;
  selected: boolean;
  position: Vec3;
  rotationY?: number;
  draggable?: boolean;
  onSelect: (selection: SceneSelection, focus: boolean) => void;
  onMove?: (position: Vec3) => void;
  children: ReactNode;
}

interface OrbitControlsLike {
  enabled: boolean;
}

const CLICK_DELTA = 6;

export const SelectablePart = ({
  descriptor,
  enabled,
  selected,
  position,
  rotationY = 0,
  draggable = false,
  onSelect,
  onMove,
  children,
}: SelectablePartProps) => {
  const { themeData } = useTheme();
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const raycaster = useThree((state) => state.raycaster);
  const controls = useThree(
    (state) => state.controls,
  ) as unknown as OrbitControlsLike | null;

  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState<Vec3>(position);
  const positionRef = useRef<Vec3>(position);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  const boxGeometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const edgeGeometry = useMemo(
    () => new EdgesGeometry(boxGeometry),
    [boxGeometry],
  );

  useEffect(() => {
    if (dragCleanupRef.current) return;
    setLocalPosition(position);
    positionRef.current = position;
  }, [position]);

  useEffect(() => () => dragCleanupRef.current?.(), []);

  useCursor(enabled && hovered && !dragging);

  const raycastPlane = useCallback(
    (clientX: number, clientY: number, plane: Plane) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const ndc = new Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      return raycaster.ray.intersectPlane(plane, new Vector3());
    },
    [camera, gl, raycaster],
  );

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (
      !enabled ||
      !draggable ||
      !onMove ||
      !descriptor.partKind ||
      event.nativeEvent.button !== 0 ||
      event.nativeEvent.shiftKey ||
      dragCleanupRef.current
    ) {
      return;
    }

    event.stopPropagation();
    const pointer = event.nativeEvent;
    const startPosition = positionRef.current;
    const startClientX = pointer.clientX;
    const startClientY = pointer.clientY;
    const plane = new Plane(new Vector3(0, 1, 0), -startPosition[1]);
    const startHit = raycastPlane(startClientX, startClientY, plane);
    const offsetX = startHit ? startPosition[0] - startHit.x : 0;
    const offsetZ = startHit ? startPosition[2] - startHit.z : 0;
    let moved = false;

    setControlsEnabled(controls, false);
    setDragging(true);

    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      dragCleanupRef.current = null;
      setControlsEnabled(controls, true);
      setDragging(false);
    };

    const move = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointer.pointerId) return;
      if (
        Math.hypot(
          moveEvent.clientX - startClientX,
          moveEvent.clientY - startClientY,
        ) <= CLICK_DELTA
      ) {
        return;
      }

      const hit = raycastPlane(moveEvent.clientX, moveEvent.clientY, plane);
      if (!hit) return;

      moved = true;
      const next = snapBenchPosition(
        [hit.x + offsetX, startPosition[1], hit.z + offsetZ],
        descriptor.partKind,
      );
      positionRef.current = next;
      setLocalPosition(next);
    };

    const finish = (finishEvent: PointerEvent) => {
      if (finishEvent.pointerId !== pointer.pointerId) return;
      cleanup();

      if (moved) {
        onMove(positionRef.current);
        onSelect(descriptor.selection, false);
        return;
      }

      positionRef.current = startPosition;
      setLocalPosition(startPosition);
      onSelect(descriptor.selection, true);
    };

    const cancel = () => {
      cleanup();
      positionRef.current = startPosition;
      setLocalPosition(startPosition);
    };

    dragCleanupRef.current = cleanup;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (
      !enabled ||
      draggable ||
      event.nativeEvent.button !== 0 ||
      event.nativeEvent.shiftKey ||
      event.delta > CLICK_DELTA
    ) {
      return;
    }

    event.stopPropagation();
    onSelect(descriptor.selection, true);
  };

  const auraColor = themeData.isDark ? "#ee8069" : "#d95540";
  const showAura = (enabled && hovered) || selected;
  return (
    <group
      position={localPosition}
      rotation={[0, rotationY, 0]}
      onPointerOver={
        enabled
          ? (event) => {
              event.stopPropagation();
              setHovered(true);
            }
          : undefined
      }
      onPointerOut={
        enabled
          ? () => {
              setHovered(false);
            }
          : undefined
      }
      onPointerDown={draggable ? handlePointerDown : undefined}
      onPointerUp={draggable ? undefined : handlePointerUp}
    >
      {children}

      {showAura && (
        <group
          position={descriptor.aura.center}
          rotation={[0, descriptor.aura.rotationY, 0]}
        >
          <mesh scale={descriptor.aura.size} raycast={() => undefined}>
            <primitive object={boxGeometry} attach="geometry" />
            <meshBasicMaterial
              color={auraColor}
              transparent
              opacity={selected ? 0.1 : 0.055}
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
          <lineSegments scale={descriptor.aura.size} raycast={() => undefined}>
            <primitive object={edgeGeometry} attach="geometry" />
            <lineBasicMaterial
              color={auraColor}
              transparent
              opacity={selected ? 0.95 : 0.62}
              depthWrite={false}
              toneMapped={false}
            />
          </lineSegments>
        </group>
      )}

    </group>
  );
};
