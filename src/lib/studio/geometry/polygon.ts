export type Pt = [number, number];

/** Ramer-Douglas-Peucker polyline simplification. */
export function simplifyPath(points: Pt[], tolerance: number): Pt[] {
  if (points.length <= 2 || tolerance <= 0) return points;

  const sqTolerance = tolerance * tolerance;

  function getSqSegDist(p: Pt, p1: Pt, p2: Pt): number {
    let x = p1[0];
    let y = p1[1];
    let dx = p2[0] - x;
    let dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = p2[0];
        y = p2[1];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
  }

  function simplifyDP(pts: Pt[]): Pt[] {
    const len = pts.length;
    const markers = new Uint8Array(len);
    markers[0] = 1;
    markers[len - 1] = 1;
    const stack: [number, number][] = [[0, len - 1]];

    while (stack.length) {
      const [first, last] = stack.pop()!;
      let maxDist = 0;
      let index = -1;
      for (let i = first + 1; i < last; i++) {
        const dist = getSqSegDist(pts[i], pts[first], pts[last]);
        if (dist > maxDist) {
          index = i;
          maxDist = dist;
        }
      }
      if (maxDist > sqTolerance && index !== -1) {
        markers[index] = 1;
        stack.push([first, index]);
        stack.push([index, last]);
      }
    }

    const result: Pt[] = [];
    for (let i = 0; i < len; i++) {
      if (markers[i]) result.push(pts[i]);
    }
    return result;
  }

  return simplifyDP(points);
}

/** Signed area (shoelace). Positive = counter-clockwise winding. */
export function signedArea(points: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

/** Standard ray-casting point-in-polygon test. */
export function pointInPolygon(point: Pt, polygon: Pt[]): boolean {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
