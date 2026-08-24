"use client";

import { useStudioStore } from "@/lib/studio/store";
import { MATERIAL_PRESETS, QUICK_COLORS } from "@/lib/studio/colorPalettes";
import { Section, Row, Vector3Field, SliderField, ColorField, Checkbox } from "./ui";
import { RAD2DEG, DEG2RAD } from "./mathConst";

export function InspectorPanel() {
  const objects = useStudioStore((s) => s.objects);
  const selectedId = useStudioStore((s) => s.selectedId);
  const renameObject = useStudioStore((s) => s.renameObject);
  const updateTransform = useStudioStore((s) => s.updateTransform);
  const updateMaterial = useStudioStore((s) => s.updateMaterial);
  const updateConversion = useStudioStore((s) => s.updateConversion);
  const updateLight = useStudioStore((s) => s.updateLight);
  const commitHistory = useStudioStore((s) => s.commitHistory);

  const object = objects.find((o) => o.id === selectedId);

  if (!object) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-xs text-slate-500">
        Select an object to see its properties, or import a sketch to generate a new 3D model instantly.
      </div>
    );
  }

  const rotationDeg: [number, number, number] = [
    object.transform.rotation[0] * RAD2DEG,
    object.transform.rotation[1] * RAD2DEG,
    object.transform.rotation[2] * RAD2DEG,
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-white/10 p-3">
        <input
          value={object.name}
          onChange={(e) => renameObject(object.id, e.target.value)}
          className="w-full rounded border border-white/10 bg-black/30 px-2 py-1.5 text-sm font-medium text-white outline-none focus:border-indigo-400"
        />
        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
          {object.kind === "image3d" ? "2D → 3D generated model" : object.kind}
        </p>
      </div>

      <Section title="Transform">
        <Row label="Position">
          <Vector3Field
            value={object.transform.position}
            onChange={(v) => updateTransform(object.id, { position: v }, true)}
          />
        </Row>
        <Row label="Rotation °">
          <Vector3Field
            value={rotationDeg}
            step={1}
            onChange={(v) =>
              updateTransform(
                object.id,
                { rotation: [v[0] * DEG2RAD, v[1] * DEG2RAD, v[2] * DEG2RAD] },
                true,
              )
            }
          />
        </Row>
        {object.kind !== "light" && (
          <Row label="Scale">
            <Vector3Field value={object.transform.scale} onChange={(v) => updateTransform(object.id, { scale: v }, true)} />
          </Row>
        )}
      </Section>

      {object.kind === "light" && (
        <Section title="Light">
          <Row label="Color">
            <ColorField value={object.color} onChange={(v) => updateLight(object.id, { color: v })} />
          </Row>
          <SliderField
            label="Intensity"
            value={object.intensity}
            min={0}
            max={5}
            step={0.05}
            onChange={(v) => updateLight(object.id, { intensity: v })}
          />
        </Section>
      )}

      {(object.kind === "primitive" || object.kind === "image3d") && (
        <Section title="Material">
          <div>
            <div className="mb-1 text-[11px] text-slate-400">Material presets</div>
            <div className="grid grid-cols-2 gap-1">
              {MATERIAL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateMaterial(object.id, preset)}
                  className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1 text-left text-[11px] text-slate-200 hover:border-indigo-400/60 hover:bg-indigo-500/10"
                >
                  <span className="h-3 w-3 rounded-full border border-white/20" style={{ background: preset.color }} />
                  <span className="truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          <Row label="Color">
            <ColorField value={object.material.color} onChange={(v) => updateMaterial(object.id, { color: v })} />
          </Row>
          <div className="grid grid-cols-9 gap-1">
            {QUICK_COLORS.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => updateMaterial(object.id, { color })}
                className={`h-5 rounded border ${object.material.color.toLowerCase() === color ? "border-white" : "border-white/10"}`}
                style={{ background: color }}
              />
            ))}
          </div>
          <SliderField
            label="Metalness"
            value={object.material.metalness}
            min={0}
            max={1}
            onChange={(v) => updateMaterial(object.id, { metalness: v })}
          />
          <SliderField
            label="Roughness"
            value={object.material.roughness}
            min={0}
            max={1}
            onChange={(v) => updateMaterial(object.id, { roughness: v })}
          />
          <SliderField
            label="Opacity"
            value={object.material.opacity}
            min={0}
            max={1}
            onChange={(v) => updateMaterial(object.id, { opacity: v })}
          />
          <Row label="Emissive">
            <ColorField value={object.material.emissive} onChange={(v) => updateMaterial(object.id, { emissive: v })} />
          </Row>
          <SliderField
            label="Emissive Str."
            value={object.material.emissiveIntensity}
            min={0}
            max={3}
            onChange={(v) => updateMaterial(object.id, { emissiveIntensity: v })}
          />
          <Checkbox
            label="Wireframe"
            checked={object.material.wireframe}
            onChange={(v) => updateMaterial(object.id, { wireframe: v })}
          />
          <Checkbox
            label="Flat shading"
            checked={object.material.flatShading}
            onChange={(v) => updateMaterial(object.id, { flatShading: v })}
          />
          <Checkbox
            label="Double sided"
            checked={object.material.doubleSide}
            onChange={(v) => updateMaterial(object.id, { doubleSide: v })}
          />
        </Section>
      )}

      {object.kind === "image3d" && (
        <Section title="2D → 3D Conversion">
          <div className="mb-2 overflow-hidden rounded border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={object.sourceImage} alt={object.sourceName} className="max-h-28 w-full object-contain bg-white/5" />
          </div>
          <Row label="Mode">
            <select
              value={object.conversion.mode}
              onChange={(e) => {
                commitHistory();
                updateConversion(object.id, { mode: e.target.value as "heightmap" | "silhouette" });
              }}
              className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-400"
            >
              <option value="silhouette">Silhouette Extrude (sketch → solid)</option>
              <option value="heightmap">Heightmap Relief (photo → terrain)</option>
            </select>
          </Row>

          <SliderField
            label="Resolution"
            value={object.conversion.resolution}
            min={32}
            max={220}
            step={4}
            onChange={(v) => updateConversion(object.id, { resolution: v })}
          />
          <SliderField
            label="Threshold"
            value={object.conversion.threshold}
            min={1}
            max={254}
            step={1}
            onChange={(v) => updateConversion(object.id, { threshold: v })}
          />
          <SliderField
            label="Smoothing"
            value={object.conversion.smooth}
            min={0}
            max={6}
            step={1}
            onChange={(v) => updateConversion(object.id, { smooth: v })}
          />
          <Checkbox
            label="Invert"
            checked={object.conversion.invert}
            onChange={(v) => updateConversion(object.id, { invert: v })}
          />

          {object.conversion.mode === "heightmap" ? (
            <SliderField
              label="Height scale"
              value={object.conversion.heightScale}
              min={0.02}
              max={1.5}
              onChange={(v) => updateConversion(object.id, { heightScale: v })}
            />
          ) : (
            <>
              <SliderField
                label="Extrude depth"
                value={object.conversion.depth}
                min={0.02}
                max={1}
                onChange={(v) => updateConversion(object.id, { depth: v })}
              />
              <SliderField
                label="Simplify"
                value={object.conversion.simplify}
                min={0}
                max={4}
                onChange={(v) => updateConversion(object.id, { simplify: v })}
              />
              <Checkbox
                label="Bevel edges"
                checked={object.conversion.bevelEnabled}
                onChange={(v) => updateConversion(object.id, { bevelEnabled: v })}
              />
              {object.conversion.bevelEnabled && (
                <SliderField
                  label="Bevel size"
                  value={object.conversion.bevelSize}
                  min={0.001}
                  max={0.05}
                  step={0.001}
                  onChange={(v) => updateConversion(object.id, { bevelSize: v })}
                />
              )}
            </>
          )}
        </Section>
      )}
    </div>
  );
}
