"use client";

import { useStudioStore } from "@/lib/studio/store";
import { QUICK_COLORS } from "@/lib/studio/colorPalettes";
import { Checkbox, ColorField, Row, Section } from "./ui";

export function SceneSettingsPanel() {
  const settings = useStudioStore((s) => s.settings);
  const setSceneSettings = useStudioStore((s) => s.setSceneSettings);

  return (
    <div className="border-t border-white/10">
      <Section title="World Colors" defaultOpen={false}>
        <Row label="Background">
          <ColorField value={settings.background} onChange={(v) => setSceneSettings({ background: v })} />
        </Row>
        <div className="grid grid-cols-9 gap-1">
          {QUICK_COLORS.map((color) => (
            <button
              key={color}
              title={color}
              onClick={() => setSceneSettings({ background: color })}
              className={`h-5 rounded border ${settings.background.toLowerCase() === color ? "border-white" : "border-white/10"}`}
              style={{ background: color }}
            />
          ))}
        </div>
        <Row label="Grid color">
          <ColorField value={settings.gridColor} onChange={(v) => setSceneSettings({ gridColor: v })} />
        </Row>
        <Checkbox label="Show grid" checked={settings.showGrid} onChange={(v) => setSceneSettings({ showGrid: v })} />
        <Checkbox label="Volumetric fog" checked={settings.fog} onChange={(v) => setSceneSettings({ fog: v })} />
        <Row label="Lighting">
          <select
            value={settings.environment}
            onChange={(e) => setSceneSettings({ environment: e.target.value as typeof settings.environment })}
            className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-400"
          >
            <option value="studio">Studio</option>
            <option value="sunset">Sunset</option>
            <option value="night">Night</option>
            <option value="none">None</option>
          </select>
        </Row>
      </Section>
    </div>
  );
}
