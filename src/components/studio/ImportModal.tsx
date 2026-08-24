"use client";

import { useRef, useState } from "react";
import { useStudioStore } from "@/lib/studio/store";
import { downscaleDataUrl, loadImage, rasterizeToSquare } from "@/lib/studio/geometry/imageUtils";
import { sampleAverageColor } from "@/lib/studio/geometry/silhouette";
import { DEFAULT_CONVERSION_PARAMS, type ConversionMode } from "@/lib/studio/types";
import { Button } from "./ui";

export function ImportModal({ onClose }: { onClose: () => void }) {
  const addImage3D = useStudioStore((s) => s.addImage3D);
  const select = useStudioStore((s) => s.select);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("image");
  const [mode, setMode] = useState<ConversionMode>("silhouette");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const reader = new FileReader();
      const rawDataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const downscaled = await downscaleDataUrl(rawDataUrl, 640);
      setPreview(downscaled);
      setFileName(file.name);
    } catch {
      setError("Could not read that image file.");
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = async () => {
    if (!preview) return;
    setBusy(true);
    setError(null);
    try {
      const img = await loadImage(preview);
      const square = rasterizeToSquare(img, 128, "#ffffff");
      const color = mode === "silhouette" ? sampleAverageColor(square) : "#ffffff";
      const id = addImage3D({
        sourceImage: preview,
        sourceName: fileName,
        conversion: { ...DEFAULT_CONVERSION_PARAMS, mode },
        color,
      });
      select(id);
      onClose();
    } catch {
      setError("Instant conversion failed. Try a different image, or adjust it after adding.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#181b24] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Import Image → Instant 3D Model</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-black/20 text-center text-xs text-slate-400 hover:border-indigo-400/60"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="max-h-36 object-contain" />
          ) : (
            <>
              <span className="text-2xl">🖼️</span>
              <p className="mt-2">Click or drop a photo / sketch (JPG, PNG)</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("silhouette")}
            className={`rounded-md border px-3 py-2 text-left text-xs ${
              mode === "silhouette" ? "border-indigo-400 bg-indigo-500/20 text-white" : "border-white/10 text-slate-300"
            }`}
          >
            <div className="font-semibold">Silhouette Extrude</div>
            <div className="text-[10px] text-slate-400">Best for line-art / sketches → solid cut-out model</div>
          </button>
          <button
            onClick={() => setMode("heightmap")}
            className={`rounded-md border px-3 py-2 text-left text-xs ${
              mode === "heightmap" ? "border-indigo-400 bg-indigo-500/20 text-white" : "border-white/10 text-slate-300"
            }`}
          >
            <div className="font-semibold">Heightmap Relief</div>
            <div className="text-[10px] text-slate-400">Best for photos → textured terrain / bas-relief</div>
          </button>
        </div>

        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!preview || busy} onClick={handleAdd}>
            {busy ? "Generating…" : "Generate 3D Model"}
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-500">
          Runs 100% in your browser — no server round-trip, no queue, no waiting.
        </p>
      </div>
    </div>
  );
}
