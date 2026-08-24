import * as THREE from "three";
import type { ConversionParams } from "../types";
import { grayscaleGrid } from "./imageUtils";

/**
 * Turns a rasterized image into a displaced-plane "relief" mesh: brightness
 * (or inverted brightness) becomes elevation. Runs fully client-side and
 * synchronously, so a sketch/photo becomes a real 3D surface instantly.
 */
export function buildHeightmapGeometry(
  canvas: HTMLCanvasElement,
  params: ConversionParams,
): { geometry: THREE.BufferGeometry; texture: THREE.CanvasTexture } {
  const seg = Math.max(8, Math.min(220, Math.round(params.resolution)));
  const grid = grayscaleGrid(canvas, params.smooth);
  const gridH = grid.length;
  const gridW = grid[0].length;

  const geometry = new THREE.PlaneGeometry(1, 1, seg, seg);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const cols = seg + 1;

  for (let i = 0; i < pos.count; i++) {
    const ix = i % cols;
    const iy = Math.floor(i / cols);
    const imgCol = Math.round((ix / seg) * (gridW - 1));
    const imgRow = gridH - 1 - Math.round((iy / seg) * (gridH - 1));
    let lum = grid[imgRow][imgCol] / 255;
    if (params.invert) lum = 1 - lum;
    pos.setZ(i, lum * params.heightScale);
  }
  pos.needsUpdate = true;
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return { geometry, texture };
}
