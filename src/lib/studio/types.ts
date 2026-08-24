export type Vec3 = [number, number, number];

export type TransformState = {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
};

export type MaterialState = {
  color: string;
  metalness: number;
  roughness: number;
  wireframe: boolean;
  opacity: number;
  flatShading: boolean;
  emissive: string;
  emissiveIntensity: number;
  doubleSide: boolean;
};

export const DEFAULT_MATERIAL: MaterialState = {
  color: "#7c9cff",
  metalness: 0.15,
  roughness: 0.55,
  wireframe: false,
  opacity: 1,
  flatShading: false,
  emissive: "#000000",
  emissiveIntensity: 0,
  doubleSide: false,
};

export const DEFAULT_TRANSFORM: TransformState = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

export type PrimitiveKind =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "plane"
  | "icosahedron"
  | "capsule";

export type ConversionMode = "heightmap" | "silhouette";

export type ConversionParams = {
  mode: ConversionMode;
  resolution: number;
  heightScale: number;
  invert: boolean;
  smooth: number;
  threshold: number;
  depth: number;
  bevelEnabled: boolean;
  bevelSize: number;
  simplify: number;
};

export const DEFAULT_CONVERSION_PARAMS: ConversionParams = {
  mode: "silhouette",
  resolution: 160,
  heightScale: 0.45,
  invert: false,
  smooth: 1,
  threshold: 128,
  depth: 0.28,
  bevelEnabled: true,
  bevelSize: 0.015,
  simplify: 1.1,
};

export type LightKind = "ambient" | "directional" | "point";

export type BaseObject = {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
};

export type PrimitiveObject = BaseObject & {
  kind: "primitive";
  type: PrimitiveKind;
  transform: TransformState;
  material: MaterialState;
};

export type Image3DObject = BaseObject & {
  kind: "image3d";
  transform: TransformState;
  material: MaterialState;
  sourceImage: string;
  sourceName: string;
  conversion: ConversionParams;
};

export type LightObject = BaseObject & {
  kind: "light";
  type: LightKind;
  transform: TransformState;
  color: string;
  intensity: number;
};

export type SceneObject = PrimitiveObject | Image3DObject | LightObject;

export type SceneSettings = {
  background: string;
  showGrid: boolean;
  gridColor: string;
  environment: "studio" | "sunset" | "night" | "none";
  fog: boolean;
};

export const DEFAULT_SCENE_SETTINGS: SceneSettings = {
  background: "#1b1e27",
  showGrid: true,
  gridColor: "#3a3f52",
  environment: "studio",
  fog: false,
};

export type SceneDocument = {
  objects: SceneObject[];
  settings: SceneSettings;
};

export type TransformMode = "translate" | "rotate" | "scale";

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
