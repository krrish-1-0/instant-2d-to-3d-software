"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/lib/studio/store";
import type { LightKind, PrimitiveKind, TransformMode } from "@/lib/studio/types";
import { exportSceneAsGLTF, exportSceneAsOBJ, exportSceneAsSTL } from "@/lib/studio/exporters";
import { Button } from "./ui";

const PRIMITIVES: { type: PrimitiveKind; label: string; icon: string }[] = [
  { type: "box", label: "Cube", icon: "⬛" },
  { type: "sphere", label: "Sphere", icon: "⚪" },
  { type: "cylinder", label: "Cylinder", icon: "🥫" },
  { type: "cone", label: "Cone", icon: "🔺" },
  { type: "torus", label: "Torus", icon: "🍩" },
  { type: "plane", label: "Plane", icon: "▭" },
  { type: "icosahedron", label: "Icosahedron", icon: "💎" },
  { type: "capsule", label: "Capsule", icon: "💊" },
];

const LIGHTS: { type: LightKind; label: string; icon: string }[] = [
  { type: "ambient", label: "Ambient", icon: "🌗" },
  { type: "directional", label: "Directional", icon: "☀️" },
  { type: "point", label: "Point", icon: "💡" },
];

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10"
      >
        {label} <span className="text-[9px] text-slate-500">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-md border border-white/10 bg-[#1c202b] p-1 shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-slate-200 hover:bg-indigo-500/20"
    >
      {children}
    </button>
  );
}

export function Toolbar({
  exportGroupRef,
  onImport,
  onProjects,
  onSave,
  onOpenOfflineBackup,
  viewportSketchMode,
  onToggleViewportSketch,
  sketchBrushSize,
  onChangeSketchBrush,
}: {
  exportGroupRef: React.RefObject<THREE.Group | null>;
  onImport: () => void;
  onProjects: () => void;
  onSave: () => void;
  onOpenOfflineBackup: () => void;
  viewportSketchMode: boolean;
  onToggleViewportSketch: () => void;
  sketchBrushSize: number;
  onChangeSketchBrush: (v: number) => void;
}) {
  const addPrimitive = useStudioStore((s) => s.addPrimitive);
  const addLight = useStudioStore((s) => s.addLight);
  const newScene = useStudioStore((s) => s.newScene);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const transformMode = useStudioStore((s) => s.transformMode);
  const setTransformMode = useStudioStore((s) => s.setTransformMode);
  const projectName = useStudioStore((s) => s.projectName);
  const isDirty = useStudioStore((s) => s.isDirty);
  const isSaving = useStudioStore((s) => s.isSaving);
  const nameRef = useRef<HTMLInputElement>(null);
  const setProjectMeta = useStudioStore((s) => s.setProjectMeta);
  const projectId = useStudioStore((s) => s.projectId);

  const modeBtn = (mode: TransformMode, icon: string, label: string) => (
    <button
      title={label}
      onClick={() => setTransformMode(mode)}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
        transformMode === mode ? "bg-indigo-500 text-white" : "text-slate-200 hover:bg-white/10"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#181b24] px-2 sm:px-3">
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
        <Link href="/" className="mr-1 flex shrink-0 items-center gap-1.5 pr-1 text-sm font-bold text-white sm:pr-2">
          <span>🧊</span>
          <span className="hidden lg:inline">Sketch3D Studio</span>
        </Link>

        <Dropdown label="File">
          <DropdownItem onClick={newScene}>🆕 New Scene</DropdownItem>
          <DropdownItem onClick={onSave}>💾 Save Project</DropdownItem>
          <DropdownItem onClick={onProjects}>📂 Open Projects…</DropdownItem>
          <DropdownItem onClick={onOpenOfflineBackup}>🧳 Open Offline Backup</DropdownItem>
        </Dropdown>

        <Dropdown label="Add">
          {PRIMITIVES.map((p) => (
            <DropdownItem key={p.type} onClick={() => addPrimitive(p.type)}>
              <span>{p.icon}</span> {p.label}
            </DropdownItem>
          ))}
          <div className="my-1 h-px bg-white/10" />
          {LIGHTS.map((l) => (
            <DropdownItem key={l.type} onClick={() => addLight(l.type)}>
              <span>{l.icon}</span> {l.label} Light
            </DropdownItem>
          ))}
        </Dropdown>

        <button
          onClick={onImport}
          title="Convert an image or photo into 3D"
          className="hidden shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 md:block"
        >
          🖼️ Import
        </button>

        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

        {/* Primary creative action: draw straight onto the 3D viewport. */}
        <button
          onClick={onToggleViewportSketch}
          aria-pressed={viewportSketchMode}
          title="Draw directly in the 3D viewport (auto-converts to a mesh)"
          className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
            viewportSketchMode
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25"
              : "border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20"
          }`}
        >
          ✏️ Draw in 3D
        </button>

        {viewportSketchMode && (
          <div className="hidden shrink-0 items-center gap-1.5 pl-1 sm:flex">
            <span className="text-[10px] text-slate-400">Brush</span>
            <input
              type="range"
              min={2}
              max={30}
              value={sketchBrushSize}
              onChange={(e) => onChangeSketchBrush(parseInt(e.target.value, 10))}
              title={`Brush size: ${sketchBrushSize}px`}
              className="w-16 accent-indigo-400"
            />
            <span className="w-5 text-[10px] tabular-nums text-slate-400">{sketchBrushSize}</span>
          </div>
        )}

        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

        <Dropdown label="Export">
          <DropdownItem onClick={() => exportGroupRef.current && exportSceneAsGLTF(exportGroupRef.current, "scene.glb")}>
            ⬇ Export GLB
          </DropdownItem>
          <DropdownItem onClick={() => exportGroupRef.current && exportSceneAsOBJ(exportGroupRef.current, "scene.obj")}>
            ⬇ Export OBJ
          </DropdownItem>
          <DropdownItem onClick={() => exportGroupRef.current && exportSceneAsSTL(exportGroupRef.current, "scene.stl")}>
            ⬇ Export STL
          </DropdownItem>
        </Dropdown>

        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
        <Button variant="ghost" title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={undo} className="shrink-0">
          ↶
        </Button>
        <Button variant="ghost" title="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={redo} className="shrink-0">
          ↷
        </Button>
        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />
        {modeBtn("translate", "✥", "Move (1)")}
        {modeBtn("rotate", "⟳", "Rotate (2)")}
        {modeBtn("scale", "⤢", "Scale (3)")}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <input
          ref={nameRef}
          value={projectName}
          onChange={(e) => setProjectMeta(projectId, e.target.value)}
          className="hidden w-40 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-400 lg:block lg:w-56"
        />
        <span className={`hidden h-1.5 w-1.5 rounded-full sm:block ${isDirty ? "bg-amber-400" : "bg-emerald-400"}`} title={isDirty ? "Unsaved changes" : "Saved"} />
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
