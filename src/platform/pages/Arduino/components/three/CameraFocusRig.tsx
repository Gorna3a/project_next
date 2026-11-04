'use client';

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { setControlsEnabled } from "./controls";
import type { Vec3 } from "./layout";

export interface CameraFocusRequest {
  target: Vec3;
  distance: number;
  nonce: number;
}

interface OrbitControlsLike {
  enabled: boolean;
  target: Vector3;
  update: () => void;
}

interface FocusTween {
  startPosition: Vector3;
  endPosition: Vector3;
  startTarget: Vector3;
  endTarget: Vector3;
  elapsed: number;
}

const TWEEN_SECONDS = 0.55;

const easeOutCubic = (value: number): number => 1 - Math.pow(1 - value, 3);

export const CameraFocusRig = ({
  request,
}: {
  request: CameraFocusRequest | null;
}) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree(
    (state) => state.controls,
  ) as unknown as OrbitControlsLike | null;
  const tweenRef = useRef<FocusTween | null>(null);
  const appliedNonceRef = useRef(0);

  useEffect(() => {
    if (
      !request ||
      request.nonce === 0 ||
      request.nonce === appliedNonceRef.current ||
      !controls
    ) {
      return;
    }

    appliedNonceRef.current = request.nonce;

    const endTarget = new Vector3(...request.target);
    const direction = camera.position.clone().sub(controls.target);

    if (direction.lengthSq() < 0.000001) {
      direction.set(1, 0.9, 1);
    }

    direction.normalize();

    tweenRef.current = {
      startPosition: camera.position.clone(),
      endPosition: endTarget.clone().add(direction.multiplyScalar(request.distance)),
      startTarget: controls.target.clone(),
      endTarget,
      elapsed: 0,
    };
    setControlsEnabled(controls, false);
  }, [camera, controls, request]);

  useFrame((_, delta) => {
    const tween = tweenRef.current;
    if (!tween || !controls) return;

    tween.elapsed += delta;
    const progress = Math.min(tween.elapsed / TWEEN_SECONDS, 1);
    const eased = easeOutCubic(progress);

    camera.position.lerpVectors(
      tween.startPosition,
      tween.endPosition,
      eased,
    );
    controls.target.lerpVectors(tween.startTarget, tween.endTarget, eased);
    controls.update();

    if (progress >= 1) {
      tweenRef.current = null;
      setControlsEnabled(controls, true);
    }
  });

  useEffect(
    () => () => {
      if (tweenRef.current) {
        setControlsEnabled(controls, true);
        tweenRef.current = null;
      }
    },
    [controls],
  );

  return null;
};
