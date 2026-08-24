"use client";

import { useStudioStore } from "@/lib/studio/store";
import type { SceneObject } from "@/lib/studio/types";

function iconFor(obj: SceneObject) {
  if (obj.kind === "light") {
    return obj.type === "ambient" ? "🌗" : obj.type === "directional" ? "☀️" : "💡";
  }
  if (obj.kind === "image3d") return "🖼️";
  switch (obj.type) {
    case "box":
      return "⬛";
    case "sphere":
      return "⚪";
    case "cylinder":
      return "🥫";
    case "cone":
      return "🔺";
    case "torus":
      return "🍩";
    case "plane":
      return "▭";
    case "icosahedron":
      return "💎";
    case "capsule":
      return "💊";
    default:
      return "◆";
  }
}

export function OutlinerPanel() {
  const objects = useStudioStore((s) => s.objects);
  const selectedId = useStudioStore((s) => s.selectedId);
  const select = useStudioStore((s) => s.select);
  const toggleVisible = useStudioStore((s) => s.toggleVisible);
  const toggleLocked = useStudioStore((s) => s.toggleLocked);
  const removeObject = useStudioStore((s) => s.removeObject);
  const duplicateObject = useStudioStore((s) => s.duplicateObject);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
        Outliner · {objects.length} objects
      </div>
      <div className="flex-1 overflow-y-auto">
        {objects.map((obj) => {
          const isSelected = obj.id === selectedId;
          return (
            <div
              key={obj.id}
              onClick={() => select(obj.id)}
              className={`group flex cursor-pointer items-center gap-2 border-b border-white/5 px-3 py-1.5 text-xs ${
                isSelected ? "bg-indigo-500/20 text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="text-sm leading-none">{iconFor(obj)}</span>
              <span className="flex-1 truncate">{obj.name}</span>
              <button
                title={obj.visible ? "Hide" : "Show"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisible(obj.id);
                }}
                className="w-4 shrink-0 text-slate-500 hover:text-slate-100"
              >
                {obj.visible ? "👁" : "🚫"}
              </button>
              <button
                title={obj.locked ? "Unlock" : "Lock"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLocked(obj.id);
                }}
                className="w-4 shrink-0 text-slate-500 hover:text-slate-100"
              >
                {obj.locked ? "🔒" : "🔓"}
              </button>
              <button
                title="Duplicate"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateObject(obj.id);
                }}
                className="hidden w-4 shrink-0 text-slate-500 hover:text-slate-100 group-hover:inline"
              >
                ⧉
              </button>
              <button
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  removeObject(obj.id);
                }}
                className="hidden w-4 shrink-0 text-slate-500 hover:text-rose-300 group-hover:inline"
              >
                ✕
              </button>
            </div>
          );
        })}
        {objects.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-slate-500">Scene is empty. Add a primitive or import an image.</p>
        )}
      </div>
    </div>
  );
}
