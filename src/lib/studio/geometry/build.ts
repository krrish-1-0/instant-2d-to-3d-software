import * as THREE from "three";
import type { ConversionParams } from "../types";
import { loadImage, rasterizeToSquare } from "./imageUtils";
import { buildHeightmapGeometry } from "./heightmap";
import { buildSilhouetteGeometry } from "./silhouette";

const RASTER_SIZE = 512;
const imageCache = new Map<string, HTMLImageElement>();

async function getImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const img = await loadImage(src);
  imageCache.set(src, img);
  return img;
}

export async function buildImage3DGeometry(
  sourceImage: string,
  conversion: ConversionParams,
): Promise<{ geometry: THREE.BufferGeometry; texture: THREE.CanvasTexture | null }> {
  const img = await getImage(sourceImage);
  const canvas = rasterizeToSquare(img, RASTER_SIZE, "#ffffff");

  if (conversion.mode === "heightmap") {
    const { geometry, texture } = buildHeightmapGeometry(canvas, conversion);
    return { geometry, texture };
  }

  const geometry = buildSilhouetteGeometry(canvas, conversion);
  return { geometry, texture: null };
}

export function buildPrimitiveGeometry(type: string): THREE.BufferGeometry {
  switch (type) {
    case "box":
      return new THREE.BoxGeometry(1, 1, 1);
    case "sphere":
      return new THREE.SphereGeometry(0.6, 32, 24);
    case "cylinder":
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    case "cone":
      return new THREE.ConeGeometry(0.55, 1, 32);
    case "torus":
      return new THREE.TorusGeometry(0.45, 0.18, 20, 40);
    case "plane":
      return new THREE.PlaneGeometry(1, 1, 1, 1);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(0.6, 0);
    case "capsule":
      return new THREE.CapsuleGeometry(0.35, 0.6, 6, 16);
    default:
      return new THREE.BoxGeometry(1, 1, 1);
  }
}
