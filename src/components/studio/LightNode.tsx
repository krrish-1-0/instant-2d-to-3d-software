"use client";

import { useRef } from "react";
import * as THREE from "three";
import { TransformControls } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useStudioStore } from "@/lib/studio/store";
import type { LightObject } from "@/lib/studio/types";
import { useOrbitControlsRef } from "./viewport-context";

export function LightNode({ object }: { object: LightObject }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedId = useStudioStore((s) => s.selectedId);
  const transformMode = useStudioStore((s) => s.transformMode);
  const select = useStudioStore((s) => s.select);
  const updateTransform = useStudioStore((s) => s.updateTransform);
  const commitHistory = useStudioStore((s) => s.commitHistory);
  const orbitRef = useOrbitControlsRef();
  const isSelected = selectedId === object.id;
  const canMove = object.type !== "ambient";

  if (!object.visible) return null;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!object.locked) select(object.id);
  };

  const helper = (
    <group ref={groupRef} position={object.transform.position} onClick={handleClick}>
      <mesh visible={isSelected || canMove}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={object.color} wireframe={!isSelected} />
      </mesh>
      {object.type === "ambient" && <ambientLight color={object.color} intensity={object.intensity} />}
      {object.type === "directional" && (
        <directionalLight color={object.color} intensity={object.intensity} castShadow position={[0, 0, 0]} />
      )}
      {object.type === "point" && (
        <pointLight color={object.color} intensity={object.intensity} distance={0} decay={2} />
      )}
    </group>
  );

  if (isSelected && !object.locked && canMove) {
    return (
      <>
        {helper}
        <TransformControls
          object={groupRef as never}
          mode={transformMode === "scale" ? "translate" : transformMode}
          onMouseDown={() => {
            if (orbitRef.current) orbitRef.current.enabled = false;
          }}
          onMouseUp={() => {
            if (orbitRef.current) orbitRef.current.enabled = true;
            commitHistory();
            const g = groupRef.current;
            if (g) {
              updateTransform(object.id, {
                position: [g.position.x, g.position.y, g.position.z],
                rotation: [g.rotation.x, g.rotation.y, g.rotation.z],
                scale: [g.scale.x, g.scale.y, g.scale.z],
              });
            }
          }}
        />
      </>
    );
  }

  return helper;
}
