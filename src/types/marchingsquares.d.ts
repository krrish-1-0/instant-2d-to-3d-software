declare module "marchingsquares" {
  export interface IsoLinesOptions {
    successCallback?: (path: number[][], threshold: number) => void;
    verbose?: boolean;
    polygons?: boolean;
    linearRing?: boolean;
    noQuadTree?: boolean;
    noFrame?: boolean;
  }

  export function isoLines(
    data: number[][],
    threshold: number,
    options?: IsoLinesOptions,
  ): number[][][];
}
