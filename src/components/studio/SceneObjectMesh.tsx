"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { TransformControls } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useStudioStore } from "@/lib/studio/store";
import type { Image3DObject, PrimitiveObject, TransformMode } from "@/lib/studio/types";
import { buildPrimitiveGeometry, buildImage3DGeometry } from "@/lib/studio/geometry/build";
import { useOrbitControlsRef } from "./viewport-context";

function useMaterial(material: PrimitiveObject["material"], hasTexture: boolean) {
  return useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: material.color,
      metalness: material.metalness,
      roughness: material.roughness,
      wireframe: material.wireframe,
      transparent: material.opacity < 1,
      opacity: material.opacity,
      flatShading: material.flatShading,
      emissive: new THREE.Color(material.emissive),
      emissiveIntensity: material.emissiveIntensity,
      side: material.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
      vertexColors: false,
    });
    return mat;
  }, [
    material.color,
    material.metalness,
    material.roughness,
    material.wireframe,
    material.opacity,
    material.flatShading,
    material.emissive,
    material.emissiveIntensity,
    material.doubleSide,
  ]);
}

function ObjectGizmo({
  mode,
  targetRef,
  onCommit,
}: {
  mode: TransformMode;
  targetRef: React.RefObject<THREE.Object3D | null>;
  onCommit: () => void;
}) {
  const orbitRef = useOrbitControlsRef();

  return (
    <TransformControls
      object={targetRef as never}
      mode={mode}
      onMouseDown={() => {
        if (orbitRef.current) orbitRef.current.enabled = false;
      }}
      onMouseUp={() => {
        if (orbitRef.current) orbitRef.current.enabled = true;
        onCommit();
      }}
    />
  );
}

export function PrimitiveMesh({ object }: { object: PrimitiveObject }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedId = useStudioStore((s) => s.selectedId);
  const transformMode = useStudioStore((s) => s.transformMode);
  const select = useStudioStore((s) => s.select);
  const updateTransform = useStudioStore((s) => s.updateTransform);
  const commitHistory = useStudioStore((s) => s.commitHistory);
  const isSelected = selectedId === object.id;

  const geometry = useMemo(() => buildPrimitiveGeometry(object.type), [object.type]);
  const material = useMaterial(object.material, false);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const syncFromObject3D = () => {
    const g = groupRef.current;
    if (!g) return;
    updateTransform(object.id, {
      position: [g.position.x, g.position.y, g.position.z],
      rotation: [g.rotation.x, g.rotation.y, g.rotation.z],
      scale: [g.scale.x, g.scale.y, g.scale.z],
    });
  };

  if (!object.visible) return null;

  const mesh = (
    <group
      ref={groupRef}
      position={object.transform.position}
      rotation={object.transform.rotation}
      scale={object.transform.scale}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!object.locked) select(object.id);
      }}
    >
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );

  if (isSelected && !object.locked) {
    return (
      <>
        {mesh}
        <ObjectGizmo
          mode={transformMode}
          targetRef={groupRef}
          onCommit={() => {
            commitHistory();
            syncFromObject3D();
          }}
        />
      </>
    );
  }

  return mesh;
}

export function Image3DMesh({ object }: { object: Image3DObject }) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedId = useStudioStore((s) => s.selectedId);
  const transformMode = useStudioStore((s) => s.transformMode);
  const select = useStudioStore((s) => s.select);
  const updateTransform = useStudioStore((s) => s.updateTransform);
  const commitHistory = useStudioStore((s) => s.commitHistory);
  const isSelected = selectedId === object.id;

  const [built, setBuilt] = useState<{ geometry: THREE.BufferGeometry; texture: THREE.CanvasTexture | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    buildImage3DGeometry(object.sourceImage, object.conversion)
      .then((result) => {
        if (!cancelled) {
          setBuilt((prev) => {
            prev?.geometry.dispose();
            prev?.texture?.dispose();
            return result;
          });
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to generate 3D model");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.sourceImage, JSON.stringify(object.conversion)]);

  useEffect(
    () => () => {
      built?.geometry.dispose();
      built?.texture?.dispose();
    },
    [built],
  );

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: object.conversion.mode === "heightmap" ? "#ffffff" : object.material.color,
      metalness: object.material.metalness,
      roughness: object.material.roughness,
      wireframe: object.material.wireframe,
      transparent: object.material.opacity < 1,
      opacity: object.material.opacity,
      flatShading: object.material.flatShading,
      emissive: new THREE.Color(object.material.emissive),
      emissiveIntensity: object.material.emissiveIntensity,
      side: object.material.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
      map: object.conversion.mode === "heightmap" ? built?.texture ?? null : null,
    });
    return mat;
  }, [object.material, object.conversion.mode, built?.texture]);

  useEffect(() => () => material.dispose(), [material]);

  const syncFromObject3D = () => {
    const g = groupRef.current;
    if (!g) return;
    updateTransform(object.id, {
      position: [g.position.x, g.position.y, g.position.z],
      rotation: [g.rotation.x, g.rotation.y, g.rotation.z],
      scale: [g.scale.x, g.scale.y, g.scale.z],
    });
  };

  if (!object.visible) return null;

  const mesh = (
    <group
      ref={groupRef}
      position={object.transform.position}
      rotation={object.transform.rotation}
      scale={object.transform.scale}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!object.locked) select(object.id);
      }}
    >
      {built && <mesh geometry={built.geometry} material={material} castShadow receiveShadow />}
      {!built && !error && (
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#666" wireframe />
        </mesh>
      )}
    </group>
  );

  if (isSelected && !object.locked) {
    return (
      <>
        {mesh}
        <ObjectGizmo
          mode={transformMode}
          targetRef={groupRef}
          onCommit={() => {
            commitHistory();
            syncFromObject3D();
          }}
        />
      </>
    );
  }

  return mesh;
}
