"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Grid, OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/lib/studio/store";
import { PrimitiveMesh, Image3DMesh } from "./SceneObjectMesh";
import { LightNode } from "./LightNode";
import { ViewportSketch } from "./ViewportSketch";
import { OrbitControlsProvider, useOrbitControlsRef } from "./viewport-context";

function SceneContents({ exportGroupRef }: { exportGroupRef: React.RefObject<THREE.Group | null> }) {
  const objects = useStudioStore((s) => s.objects);

  return (
    <>
      <group ref={exportGroupRef}>
        {objects.map((obj) => {
          if (obj.kind === "primitive") return <PrimitiveMesh key={obj.id} object={obj} />;
          if (obj.kind === "image3d") return <Image3DMesh key={obj.id} object={obj} />;
          return null;
        })}
      </group>
      {objects.map((obj) => (obj.kind === "light" ? <LightNode key={obj.id} object={obj} /> : null))}
    </>
  );
}

function Controls({ disabled }: { disabled?: boolean }) {
  const orbitRef = useOrbitControlsRef();
  return (
    <OrbitControls
      ref={orbitRef as never}
      makeDefault
      enableDamping={!disabled}
      dampingFactor={0.08}
      minDistance={0.3}
      maxDistance={40}
      enabled={!disabled}
    />
  );
}

function EnvironmentSetup() {
  const settings = useStudioStore((s) => s.settings);
  if (settings.environment === "none") return null;
  return <Environment preset={settings.environment} background={false} />;
}

export function Viewport({
  exportGroupRef,
  sketchMode,
  sketchBrushSize,
  onSketchFinish,
}: {
  exportGroupRef: React.RefObject<THREE.Group | null>;
  sketchMode: boolean;
  sketchBrushSize: number;
  onSketchFinish: () => void;
}) {
  const settings = useStudioStore((s) => s.settings);
  const select = useStudioStore((s) => s.select);

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [2.6, 2.1, 3.2], fov: 45 }}
        onPointerMissed={() => select(null)}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ pointerEvents: sketchMode ? "none" : "auto" }}
      >
        <color attach="background" args={[settings.background]} />
        {settings.fog && <fog attach="fog" args={[settings.background, 6, 22]} />}
        <OrbitControlsProvider>
          <Suspense fallback={null}>
            <EnvironmentSetup />
            <SceneContents exportGroupRef={exportGroupRef} />
          </Suspense>
          {settings.showGrid && (
            <Grid
              infiniteGrid
              cellSize={0.25}
              sectionSize={1}
              cellColor={settings.gridColor}
              sectionColor={settings.gridColor}
              fadeDistance={25}
              fadeStrength={1.5}
              position={[0, -0.001, 0]}
            />
          )}
          <Controls disabled={sketchMode} />
        </OrbitControlsProvider>
        <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
          <GizmoViewport axisColors={["#f87171", "#4ade80", "#60a5fa"]} labelColor="black" />
        </GizmoHelper>
      </Canvas>
      <ViewportSketch
        active={sketchMode}
        brushSize={sketchBrushSize}
        onFinish={onSketchFinish}
      />
    </div>
  );
}
