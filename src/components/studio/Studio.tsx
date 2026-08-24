"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/lib/studio/store";
import { Toolbar } from "./Toolbar";
import { OutlinerPanel } from "./OutlinerPanel";
import { InspectorPanel } from "./InspectorPanel";
import { Viewport } from "./Viewport";
import { ImportModal } from "./ImportModal";
import { ProjectsModal } from "./ProjectsModal";
import { SceneSettingsPanel } from "./SceneSettingsPanel";

type ModalKind = "import" | "projects" | null;
const OFFLINE_BACKUP_KEY = "sketch3d-offline-backup-v1";

export function Studio() {
  const [modal, setModal] = useState<ModalKind>(null);
  const [mobilePanel, setMobilePanel] = useState<"outliner" | "inspector" | null>(null);
  const [viewportSketchMode, setViewportSketchMode] = useState(false);
  const [sketchBrushSize, setSketchBrushSize] = useState(8);
  const exportGroupRef = useRef<THREE.Group>(null);

  const objects = useStudioStore((s) => s.objects);
  const settings = useStudioStore((s) => s.settings);
  const projectId = useStudioStore((s) => s.projectId);
  const projectName = useStudioStore((s) => s.projectName);
  const setProjectMeta = useStudioStore((s) => s.setProjectMeta);
  const setSaving = useStudioStore((s) => s.setSaving);
  const markSaved = useStudioStore((s) => s.markSaved);
  const setStatus = useStudioStore((s) => s.setStatus);
  const statusMessage = useStudioStore((s) => s.statusMessage);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const removeObject = useStudioStore((s) => s.removeObject);
  const duplicateObject = useStudioStore((s) => s.duplicateObject);
  const selectedId = useStudioStore((s) => s.selectedId);
  const setTransformMode = useStudioStore((s) => s.setTransformMode);

  const saveOfflineBackup = useCallback(() => {
    const backup = {
      projectName,
      sceneData: { objects, settings },
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(OFFLINE_BACKUP_KEY, JSON.stringify(backup));
    setStatus("Saved offline browser backup");
  }, [objects, settings, projectName, setStatus]);

  const openOfflineBackup = useCallback(() => {
    const raw = localStorage.getItem(OFFLINE_BACKUP_KEY);
    if (!raw) {
      setStatus("No offline browser backup found");
      return;
    }
    try {
      const backup = JSON.parse(raw) as { projectName?: string; sceneData?: { objects: typeof objects; settings: typeof settings } };
      if (!backup.sceneData) throw new Error("Invalid backup");
      useStudioStore.getState().loadDocument(backup.sceneData, "offline-browser-backup", backup.projectName ?? "Offline Backup");
    } catch {
      setStatus("Offline backup is invalid");
    }
  }, [setStatus]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const sceneData = { objects, settings };
      localStorage.setItem(
        OFFLINE_BACKUP_KEY,
        JSON.stringify({ projectName, sceneData, savedAt: new Date().toISOString() }),
      );
      if (projectId && projectId !== "offline-browser-backup") {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: projectName, sceneData }),
        });
        const json = await res.json();
        if (json.ok) {
          markSaved();
          setStatus(`Saved "${json.project.name}"`);
        } else {
          setStatus("Save failed");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: projectName, sceneData }),
        });
        const json = await res.json();
        if (json.ok) {
          setProjectMeta(json.project.id, json.project.name);
          markSaved();
          setStatus(`Saved "${json.project.name}"`);
        } else {
          setStatus("Save failed");
        }
      }
    } catch {
      saveOfflineBackup();
      setStatus("Server unavailable — saved offline backup instead");
    } finally {
      setSaving(false);
    }
  }, [objects, settings, projectId, projectName, setSaving, markSaved, setStatus, setProjectMeta, saveOfflineBackup]);

  useEffect(() => {
    if (!statusMessage) return;
    const t = setTimeout(() => setStatus(null), 3200);
    return () => clearTimeout(t);
  }, [statusMessage, setStatus]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (selectedId) {
          e.preventDefault();
          duplicateObject(selectedId);
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId) {
          e.preventDefault();
          removeObject(selectedId);
        }
        return;
      }
      if (e.key === "1") setTransformMode("translate");
      if (e.key === "2") setTransformMode("rotate");
      if (e.key === "3") setTransformMode("scale");
      if (e.key === "Escape") {
        if (viewportSketchMode) setViewportSketchMode(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, handleSave, selectedId, removeObject, duplicateObject, setTransformMode, viewportSketchMode]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#12141b] text-slate-100">
      <Toolbar
        exportGroupRef={exportGroupRef}
        onImport={() => setModal("import")}
        onProjects={() => setModal("projects")}
        onSave={handleSave}
        onOpenOfflineBackup={openOfflineBackup}
        viewportSketchMode={viewportSketchMode}
        onToggleViewportSketch={() => setViewportSketchMode((v) => !v)}
        sketchBrushSize={sketchBrushSize}
        onChangeSketchBrush={setSketchBrushSize}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/10 bg-[#14161f] transition-transform md:relative md:z-auto md:w-56 md:translate-x-0 ${
            mobilePanel === "outliner" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            <OutlinerPanel />
          </div>
          <SceneSettingsPanel />
        </aside>

        <main className="relative flex-1">
          <Viewport
            exportGroupRef={exportGroupRef}
            sketchMode={viewportSketchMode}
            sketchBrushSize={sketchBrushSize}
            onSketchFinish={() => setViewportSketchMode(false)}
          />
          <div className="pointer-events-none absolute left-3 top-3 hidden rounded-md bg-black/40 px-2.5 py-1.5 text-[10px] text-slate-300 backdrop-blur lg:block">
            {viewportSketchMode ? (
              <>Draw freely — the mesh appears automatically · <b>Esc</b> to exit</>
            ) : (
              <>Move <b>1</b> · Rotate <b>2</b> · Scale <b>3</b> · Delete <b>Del</b> · Duplicate <b>Ctrl+D</b> · Undo <b>Ctrl+Z</b></>
            )}
          </div>
          {statusMessage && (
            <div className="pointer-events-none absolute bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs text-white shadow-lg md:bottom-3">
              {statusMessage}
            </div>
          )}
          {mobilePanel && (
            <button
              aria-label="Close panel"
              onClick={() => setMobilePanel(null)}
              className="absolute inset-0 z-20 bg-black/50 md:hidden"
            />
          )}
        </main>

        <aside
          className={`absolute inset-y-0 right-0 z-30 w-72 border-l border-white/10 bg-[#14161f] transition-transform md:relative md:z-auto md:translate-x-0 ${
            mobilePanel === "inspector" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <InspectorPanel />
        </aside>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="grid shrink-0 grid-cols-4 border-t border-white/10 bg-[#181b24] md:hidden">
        {[
          { key: "outliner" as const, icon: "🗂️", label: "Scene" },
          { key: "sketch" as const, icon: "✏️", label: "Sketch" },
          { key: "import" as const, icon: "🖼️", label: "Import" },
          { key: "inspector" as const, icon: "🎨", label: "Edit" },
        ].map((tab) => {
          const active =
            (tab.key === "outliner" && mobilePanel === "outliner") ||
            (tab.key === "inspector" && mobilePanel === "inspector") ||
            (tab.key === "sketch" && viewportSketchMode);
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === "sketch") {
                  // Drawing happens directly on the viewport, so hide any
                  // overlapping panels first.
                  setMobilePanel(null);
                  setViewportSketchMode((v) => !v);
                } else if (tab.key === "import") {
                  setMobilePanel(null);
                  setViewportSketchMode(false);
                  setModal("import");
                } else {
                  setViewportSketchMode(false);
                  setMobilePanel(mobilePanel === tab.key ? null : tab.key);
                }
              }}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] transition ${
                active ? "bg-indigo-500/20 text-white" : "text-slate-400"
              }`}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>

      {modal === "import" && <ImportModal onClose={() => setModal(null)} />}
      {modal === "projects" && <ProjectsModal onClose={() => setModal(null)} />}
    </div>
  );
}
