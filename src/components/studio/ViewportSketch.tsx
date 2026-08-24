"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStudioStore } from "@/lib/studio/store";
import { DEFAULT_CONVERSION_PARAMS } from "@/lib/studio/types";
import { loadImage, rasterizeToSquare } from "@/lib/studio/geometry/imageUtils";
import { sampleAverageColor } from "@/lib/studio/geometry/silhouette";

/**
 * Freehand drawing overlay that sits directly on top of the 3D viewport.
 *
 * Strokes are captured in CSS-pixel space on a transparent canvas layered over
 * the WebGL canvas, then rasterized into a square bitmap and pushed through the
 * same marching-squares -> simplify -> extrude pipeline used by image import.
 * The finished mesh is inserted straight into the scene, so the user never
 * leaves the 3D workspace.
 */

const STROKE_COLOR = "#111111";
const OFFSCREEN_SIZE = 512;
const TRACE_RESOLUTION = 128;
const MIN_POINTS = 4;

type Pt = [number, number];

interface Props {
  active: boolean;
  brushSize?: number;
  onFinish?: () => void;
}

export function ViewportSketch({ active, brushSize = 8, onFinish }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Pt[][]>([]);
  const drawingRef = useRef(false);
  const brushRef = useRef(brushSize);

  const [strokeCount, setStrokeCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const addImage3D = useStudioStore((s) => s.addImage3D);
  const select = useStudioStore((s) => s.select);
  const setTransformMode = useStudioStore((s) => s.setTransformMode);

  useEffect(() => {
    brushRef.current = brushSize;
  }, [brushSize]);

  /** Paint every stored stroke onto a 2D context, in CSS pixel space. */
  const paintStrokes = useCallback((ctx: CanvasRenderingContext2D, scale = 1) => {
    ctx.strokeStyle = STROKE_COLOR;
    ctx.fillStyle = STROKE_COLOR;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue;
      ctx.lineWidth = brushRef.current * scale;

      if (stroke.length === 1) {
        ctx.beginPath();
        ctx.arc(stroke[0][0] * scale, stroke[0][1] * scale, (brushRef.current * scale) / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(stroke[0][0] * scale, stroke[0][1] * scale);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i][0] * scale, stroke[i][1] * scale);
      }
      ctx.stroke();
    }
  }, []);

  /** Clear the visible canvas and replay all stored strokes. */
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    paintStrokes(ctx, 1);
  }, [paintStrokes]);

  /**
   * Keep the canvas backing store matched to its displayed size and to the
   * device pixel ratio, otherwise strokes render blurry and land offset from
   * the pointer.
   */
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [active, redraw]);

  /** Rasterize strokes and hand them to the conversion pipeline. */
  const convertStrokes = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const totalPoints = strokesRef.current.reduce((sum, s) => sum + s.length, 0);
    if (totalPoints < MIN_POINTS) return;

    setBusy(true);
    try {
      const rect = container.getBoundingClientRect();
      // Fit the drawn area into a square bitmap without distorting the artwork.
      const longest = Math.max(rect.width, rect.height) || 1;
      const scale = OFFSCREEN_SIZE / longest;
      const offsetX = (OFFSCREEN_SIZE - rect.width * scale) / 2;
      const offsetY = (OFFSCREEN_SIZE - rect.height * scale) / 2;

      const work = document.createElement("canvas");
      work.width = OFFSCREEN_SIZE;
      work.height = OFFSCREEN_SIZE;
      const wCtx = work.getContext("2d");
      if (!wCtx) return;

      wCtx.fillStyle = "#ffffff";
      wCtx.fillRect(0, 0, OFFSCREEN_SIZE, OFFSCREEN_SIZE);
      wCtx.translate(offsetX, offsetY);
      paintStrokes(wCtx, scale);

      const dataUrl = work.toDataURL("image/png");
      const img = await loadImage(dataUrl);
      const square = rasterizeToSquare(img, TRACE_RESOLUTION, "#ffffff");
      const color = sampleAverageColor(square);

      const id = addImage3D({
        sourceImage: dataUrl,
        sourceName: "3D Sketch",
        conversion: {
          ...DEFAULT_CONVERSION_PARAMS,
          mode: "silhouette",
          invert: true,
          threshold: 200,
          smooth: 1,
          resolution: 120,
          simplify: 1.2,
          bevelEnabled: true,
          depth: 0.25,
        },
        color,
      });

      select(id);
      setTransformMode("translate");
      strokesRef.current = [];
      setStrokeCount(0);
      redraw();
    } finally {
      setBusy(false);
    }
  }, [addImage3D, paintStrokes, redraw, select, setTransformMode]);

  /**
   * Auto-convert when the user leaves sketch mode so no work is ever lost.
   * Tracked with a ref so we only fire on a true active -> inactive edge.
   */
  const wasActive = useRef(false);
  useEffect(() => {
    if (wasActive.current && !active && strokesRef.current.length > 0) {
      void convertStrokes();
    }
    wasActive.current = active;
  }, [active, convertStrokes]);

  const getPos = useCallback((e: React.PointerEvent): Pt => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return [0, 0];
    return [e.clientX - rect.left, e.clientY - rect.top];
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!active || busy) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      drawingRef.current = true;
      strokesRef.current.push([getPos(e)]);
      setStrokeCount(strokesRef.current.length);
      redraw();
    },
    [active, busy, getPos, redraw],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawingRef.current) return;
      const stroke = strokesRef.current[strokesRef.current.length - 1];
      if (!stroke) return;
      stroke.push(getPos(e));
      redraw();
    },
    [getPos, redraw],
  );

  const endStroke = useCallback(() => {
    drawingRef.current = false;
  }, []);

  const undoStroke = useCallback(() => {
    strokesRef.current.pop();
    setStrokeCount(strokesRef.current.length);
    redraw();
  }, [redraw]);

  const clearStrokes = useCallback(() => {
    strokesRef.current = [];
    setStrokeCount(0);
    redraw();
  }, [redraw]);

  if (!active) return null;

  const stopDrawing = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-40 cursor-crosshair touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endStroke}
      onPointerLeave={endStroke}
      onPointerCancel={endStroke}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />

      {/* Status pill */}
      <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-600/25 px-4 py-2 backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-300" />
        <span className="text-xs font-medium text-indigo-50">
          {busy ? "Building mesh…" : "Draw anywhere on the viewport"}
        </span>
        <span className="hidden text-[10px] text-indigo-200/80 sm:inline">
          {strokeCount > 0 ? `${strokeCount} stroke${strokeCount > 1 ? "s" : ""}` : "Esc to exit"}
        </span>
      </div>

      {/* Sketch controls */}
      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-xl border border-white/10 bg-[#181b24]/95 p-1.5 shadow-2xl backdrop-blur"
        onPointerDown={stopDrawing}
        onPointerMove={stopDrawing}
      >
        <button
          onClick={undoStroke}
          disabled={strokeCount === 0 || busy}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-30"
        >
          ↶ Undo
        </button>
        <button
          onClick={clearStrokes}
          disabled={strokeCount === 0 || busy}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-30"
        >
          Clear
        </button>
        <div className="mx-0.5 h-5 w-px bg-white/10" />
        <button
          onClick={() => void convertStrokes()}
          disabled={strokeCount === 0 || busy}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-40"
        >
          {busy ? "Converting…" : "Convert to 3D →"}
        </button>
        <button
          onClick={() => onFinish?.()}
          disabled={busy}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
        >
          Done
        </button>
      </div>
    </div>
  );
}
