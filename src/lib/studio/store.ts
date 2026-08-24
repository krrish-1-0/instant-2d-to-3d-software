"use client";

import { create } from "zustand";
import {
  createId,
  DEFAULT_CONVERSION_PARAMS,
  DEFAULT_MATERIAL,
  DEFAULT_SCENE_SETTINGS,
  DEFAULT_TRANSFORM,
  type Image3DObject,
  type LightKind,
  type LightObject,
  type PrimitiveKind,
  type PrimitiveObject,
  type SceneObject,
  type SceneSettings,
  type TransformMode,
  type ConversionParams,
  type MaterialState,
  type TransformState,
} from "./types";

type Snapshot = {
  objects: SceneObject[];
  settings: SceneSettings;
};

function snapshot(state: StudioState): Snapshot {
  return {
    objects: JSON.parse(JSON.stringify(state.objects)),
    settings: JSON.parse(JSON.stringify(state.settings)),
  };
}

export interface StudioState {
  objects: SceneObject[];
  settings: SceneSettings;
  selectedId: string | null;
  transformMode: TransformMode;
  projectId: string | null;
  projectName: string;
  isDirty: boolean;
  isSaving: boolean;
  statusMessage: string | null;
  past: Snapshot[];
  future: Snapshot[];

  select: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;

  addPrimitive: (type: PrimitiveKind) => void;
  addLight: (type: LightKind) => void;
  addImage3D: (input: { sourceImage: string; sourceName: string; conversion?: Partial<ConversionParams>; color?: string }) => string;

  updateTransform: (id: string, transform: Partial<TransformState>, commit?: boolean) => void;
  updateMaterial: (id: string, material: Partial<MaterialState>) => void;
  updateConversion: (id: string, conversion: Partial<ConversionParams>) => void;
  updateLight: (id: string, patch: Partial<Pick<LightObject, "color" | "intensity">>) => void;
  renameObject: (id: string, name: string) => void;
  toggleVisible: (id: string) => void;
  toggleLocked: (id: string) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;

  setSceneSettings: (patch: Partial<SceneSettings>) => void;

  commitHistory: () => void;
  undo: () => void;
  redo: () => void;

  newScene: () => void;
  loadDocument: (doc: { objects: SceneObject[]; settings: SceneSettings }, projectId: string, projectName: string) => void;
  setProjectMeta: (id: string | null, name: string) => void;
  setSaving: (v: boolean) => void;
  markSaved: () => void;
  setStatus: (msg: string | null) => void;
}

function defaultObjects(): SceneObject[] {
  return [
    {
      id: createId("light"),
      kind: "light",
      type: "ambient",
      name: "Ambient Light",
      visible: true,
      locked: false,
      transform: { ...DEFAULT_TRANSFORM },
      color: "#ffffff",
      intensity: 0.55,
    },
    {
      id: createId("light"),
      kind: "light",
      type: "directional",
      name: "Key Light",
      visible: true,
      locked: false,
      transform: { ...DEFAULT_TRANSFORM, position: [3, 4, 2] },
      color: "#ffffff",
      intensity: 1.4,
    },
  ];
}

const PRIMITIVE_LABELS: Record<PrimitiveKind, string> = {
  box: "Cube",
  sphere: "Sphere",
  cylinder: "Cylinder",
  cone: "Cone",
  torus: "Torus",
  plane: "Plane",
  icosahedron: "Icosahedron",
  capsule: "Capsule",
};

const LIGHT_LABELS: Record<LightKind, string> = {
  ambient: "Ambient Light",
  directional: "Directional Light",
  point: "Point Light",
};

export const useStudioStore = create<StudioState>((set, get) => ({
  objects: defaultObjects(),
  settings: { ...DEFAULT_SCENE_SETTINGS },
  selectedId: null,
  transformMode: "translate",
  projectId: null,
  projectName: "Untitled Scene",
  isDirty: false,
  isSaving: false,
  statusMessage: null,
  past: [],
  future: [],

  select: (id) => set({ selectedId: id }),
  setTransformMode: (mode) => set({ transformMode: mode }),

  addPrimitive: (type) => {
    get().commitHistory();
    const obj: PrimitiveObject = {
      id: createId("obj"),
      kind: "primitive",
      type,
      name: PRIMITIVE_LABELS[type],
      visible: true,
      locked: false,
      transform: { ...DEFAULT_TRANSFORM, position: [0, type === "plane" ? 0 : 0.5, 0] },
      material: { ...DEFAULT_MATERIAL },
    };
    set((s) => ({ objects: [...s.objects, obj], selectedId: obj.id, isDirty: true }));
  },

  addLight: (type) => {
    get().commitHistory();
    const obj: LightObject = {
      id: createId("light"),
      kind: "light",
      type,
      name: LIGHT_LABELS[type],
      visible: true,
      locked: false,
      transform: { ...DEFAULT_TRANSFORM, position: [2, 3, 2] },
      color: "#ffffff",
      intensity: type === "ambient" ? 0.6 : 1.2,
    };
    set((s) => ({ objects: [...s.objects, obj], selectedId: obj.id, isDirty: true }));
  },

  addImage3D: ({ sourceImage, sourceName, conversion, color }) => {
    get().commitHistory();
    const obj: Image3DObject = {
      id: createId("img3d"),
      kind: "image3d",
      name: sourceName.replace(/\.[^.]+$/, "").slice(0, 40) || "2D → 3D Model",
      visible: true,
      locked: false,
      transform: { ...DEFAULT_TRANSFORM, position: [0, 0.4, 0] },
      material: { ...DEFAULT_MATERIAL, color: color ?? DEFAULT_MATERIAL.color },
      sourceImage,
      sourceName,
      conversion: { ...DEFAULT_CONVERSION_PARAMS, ...conversion },
    };
    set((s) => ({ objects: [...s.objects, obj], selectedId: obj.id, isDirty: true }));
    return obj.id;
  },

  updateTransform: (id, transform, commit = false) => {
    if (commit) get().commitHistory();
    set((s) => ({
      objects: s.objects.map((o) =>
        o.id === id ? { ...o, transform: { ...o.transform, ...transform } } : o,
      ),
      isDirty: true,
    }));
  },

  updateMaterial: (id, material) => {
    set((s) => ({
      objects: s.objects.map((o) =>
        o.kind !== "light" && o.id === id ? { ...o, material: { ...o.material, ...material } } : o,
      ),
      isDirty: true,
    }));
  },

  updateConversion: (id, conversion) => {
    set((s) => ({
      objects: s.objects.map((o) =>
        o.kind === "image3d" && o.id === id
          ? { ...o, conversion: { ...o.conversion, ...conversion } }
          : o,
      ),
      isDirty: true,
    }));
  },

  updateLight: (id, patch) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.kind === "light" && o.id === id ? { ...o, ...patch } : o)),
      isDirty: true,
    }));
  },

  renameObject: (id, name) => {
    set((s) => ({ objects: s.objects.map((o) => (o.id === id ? { ...o, name } : o)), isDirty: true }));
  },

  toggleVisible: (id) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, visible: !o.visible } : o)),
      isDirty: true,
    }));
  },

  toggleLocked: (id) => {
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, locked: !o.locked } : o)),
      isDirty: true,
    }));
  },

  removeObject: (id) => {
    get().commitHistory();
    set((s) => ({
      objects: s.objects.filter((o) => o.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
      isDirty: true,
    }));
  },

  duplicateObject: (id) => {
    get().commitHistory();
    set((s) => {
      const src = s.objects.find((o) => o.id === id);
      if (!src) return s;
      const clone: SceneObject = {
        ...JSON.parse(JSON.stringify(src)),
        id: createId(src.kind === "light" ? "light" : "obj"),
        name: `${src.name} Copy`,
        transform: {
          ...src.transform,
          position: [
            src.transform.position[0] + 0.3,
            src.transform.position[1],
            src.transform.position[2] + 0.3,
          ],
        },
      };
      return { objects: [...s.objects, clone], selectedId: clone.id, isDirty: true };
    });
  },

  setSceneSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch }, isDirty: true }));
  },

  commitHistory: () => {
    set((s) => ({
      past: [...s.past.slice(-49), snapshot(s)],
      future: [],
    }));
  },

  undo: () => {
    const s = get();
    if (s.past.length === 0) return;
    const previous = s.past[s.past.length - 1];
    const currentSnap = snapshot(s);
    set({
      objects: previous.objects,
      settings: previous.settings,
      past: s.past.slice(0, -1),
      future: [...s.future, currentSnap],
      isDirty: true,
      selectedId: null,
    });
  },

  redo: () => {
    const s = get();
    if (s.future.length === 0) return;
    const next = s.future[s.future.length - 1];
    const currentSnap = snapshot(s);
    set({
      objects: next.objects,
      settings: next.settings,
      future: s.future.slice(0, -1),
      past: [...s.past, currentSnap],
      isDirty: true,
      selectedId: null,
    });
  },

  newScene: () => {
    set({
      objects: defaultObjects(),
      settings: { ...DEFAULT_SCENE_SETTINGS },
      selectedId: null,
      past: [],
      future: [],
      projectId: null,
      projectName: "Untitled Scene",
      isDirty: false,
      statusMessage: "New scene created",
    });
  },

  loadDocument: (doc, projectId, projectName) => {
    set({
      objects: doc.objects,
      settings: doc.settings,
      selectedId: null,
      past: [],
      future: [],
      projectId,
      projectName,
      isDirty: false,
      statusMessage: `Loaded "${projectName}"`,
    });
  },

  setProjectMeta: (id, name) => set({ projectId: id, projectName: name }),
  setSaving: (v) => set({ isSaving: v }),
  markSaved: () => set({ isDirty: false }),
  setStatus: (msg) => set({ statusMessage: msg }),
}));
