import * as THREE from "three";
import { isoLines } from "marchingsquares";
import type { ConversionParams } from "../types";
import { grayscaleGrid } from "./imageUtils";
import { pointInPolygon, signedArea, simplifyPath, type Pt } from "./polygon";

/**
 * Traces the outline(s) of a sketch/photo silhouette (marching squares),
 * simplifies them, resolves outer-shape/hole nesting, then extrudes the
 * result into a solid 3D mesh. Pure client-side + synchronous => instant.
 */
export function buildSilhouetteGeometry(
  canvas: HTMLCanvasElement,
  params: ConversionParams,
): THREE.BufferGeometry {
  const size = Math.max(32, Math.min(240, Math.round(params.resolution)));
  const working = document.createElement("canvas");
  working.width = size;
  working.height = size;
  const ctx = working.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, size, size);

  const grid = grayscaleGrid(working, params.smooth);
  const rows = grid.length;
  const cols = grid[0].length;

  const field: number[][] = new Array(rows);
  for (let y = 0; y < rows; y++) {
    const row = new Array(cols);
    for (let x = 0; x < cols; x++) {
      const v = grid[y][x];
      row[x] = params.invert ? 255 - v : v;
    }
    field[y] = row;
  }

  // We want the silhouette of the DARK subject on a light background by
  // default, so trace the boundary where the (possibly inverted) field
  // drops below the threshold i.e. isoline of (255 - field) at (255 - t).
  const rawPaths = isoLines(field, 255 - params.threshold, { noFrame: true });

  const tolerance = Math.max(0, params.simplify);
  const candidates: { pts: Pt[]; area: number }[] = [];

  for (const raw of rawPaths) {
    let pts = raw.map((p) => [p[0], p[1]] as Pt);
    if (pts.length > 3) pts = simplifyPath(pts, tolerance);
    if (pts.length < 3) continue;
    const area = Math.abs(signedArea(pts));
    if (area < 1.5) continue;
    candidates.push({ pts, area });
  }

  if (candidates.length === 0) {
    throw new Error(
      "No shape could be traced from this image. Try lowering the threshold or enabling invert.",
    );
  }

  candidates.sort((a, b) => b.area - a.area);

  const normalize = (pt: Pt): Pt => [pt[0] / (cols - 1) - 0.5, 0.5 - pt[1] / (rows - 1)];

  const outers: { pts: Pt[]; holes: Pt[][] }[] = [];
  for (const item of candidates) {
    let parent: { pts: Pt[]; holes: Pt[][] } | null = null;
    for (const outer of outers) {
      if (pointInPolygon(item.pts[0], outer.pts)) {
        parent = outer;
        break;
      }
    }
    if (parent) parent.holes.push(item.pts);
    else outers.push({ pts: item.pts, holes: [] });
  }

  const shapes: THREE.Shape[] = outers.map((outer) => {
    const normPts = outer.pts.map(normalize);
    const shape = new THREE.Shape();
    shape.moveTo(normPts[0][0], normPts[0][1]);
    for (let i = 1; i < normPts.length; i++) shape.lineTo(normPts[i][0], normPts[i][1]);
    shape.closePath();

    shape.holes = outer.holes.map((hole) => {
      const normHole = hole.map(normalize);
      const path = new THREE.Path();
      path.moveTo(normHole[0][0], normHole[0][1]);
      for (let i = 1; i < normHole.length; i++) path.lineTo(normHole[i][0], normHole[i][1]);
      path.closePath();
      return path;
    });
    return shape;
  });

  const depth = Math.max(0.01, params.depth);
  const bevelSize = params.bevelEnabled ? Math.min(params.bevelSize, depth / 2 - 0.001) : 0;

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: params.bevelEnabled && bevelSize > 0.0005,
    bevelSize,
    bevelThickness: bevelSize,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 6,
  });

  geometry.center();
  geometry.computeVertexNormals();

  // Normalize overall footprint to roughly unit scale on the largest axis so
  // freshly generated models feel consistent regardless of source pixels.
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  const width = bbox.max.x - bbox.min.x || 1;
  const height = bbox.max.y - bbox.min.y || 1;
  const largest = Math.max(width, height);
  const scale = largest > 0 ? 1 / largest : 1;
  geometry.scale(scale, scale, 1);

  return geometry;
}

/** Average RGB colour of a canvas, used to seed a sensible default material. */
export function sampleAverageColor(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4 * 7) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }
  if (n === 0) return "#7c9cff";
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
