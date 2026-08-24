// Small, dependency-free helpers for turning an <img>/dataURL into pixel data
// that can be processed synchronously in the browser. Everything here runs in
// a handful of milliseconds for the resolutions we use, which is what makes
// the "2D sketch -> 3D model" conversion feel instant with zero server trip.

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/** Draw an image "contain" style (letterboxed, no cropping) into a square
 * canvas of `size`x`size` pixels, filled with `background` first. */
export function rasterizeToSquare(
  img: HTMLImageElement,
  size: number,
  background = "#ffffff",
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  const scale = Math.min(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(img, x, y, w, h);
  return canvas;
}

/** Downscale an arbitrary image dataURL so we never store/transfer huge
 * base64 blobs in the database or scene JSON. */
export async function downscaleDataUrl(dataUrl: string, maxDim = 640): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

/** Returns a 2D grid (rows x cols) of luminance values 0..255 sampled from a
 * canvas, plus a box-blur smoothing pass count applied in place. */
export function grayscaleGrid(canvas: HTMLCanvasElement, smoothPasses = 0): number[][] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = new Array(width);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3] / 255;
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) * a + 255 * (1 - a);
      row[x] = lum;
    }
    grid.push(row);
  }
  for (let p = 0; p < smoothPasses; p++) {
    grid = boxBlur(grid);
  }
  return grid;
}

function boxBlur(grid: number[][]): number[][] {
  const h = grid.length;
  const w = grid[0].length;
  const out: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row = new Array(w);
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < h && nx >= 0 && nx < w) {
            sum += grid[ny][nx];
            count++;
          }
        }
      }
      row[x] = sum / count;
    }
    out.push(row);
  }
  return out;
}
