"use client";

import { useEffect, useState } from "react";
import { useStudioStore } from "@/lib/studio/store";
import { Button } from "./ui";

type ProjectSummary = { id: string; name: string; updatedAt: string };

export function ProjectsModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadDocument = useStudioStore((s) => s.loadDocument);
  const setStatus = useStudioStore((s) => s.setStatus);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.ok) setProjects(json.projects);
      else setError("Failed to load projects");
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.ok) {
        loadDocument(json.project.sceneData, json.project.id, json.project.name);
        onClose();
      } else {
        setError("Could not open that project");
      }
    } catch {
      setError("Could not open that project");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setStatus("Project deleted");
      refresh();
    } catch {
      setError("Could not delete project");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#181b24] p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Saved Projects</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {loading && <p className="text-xs text-slate-400">Loading…</p>}
        {error && <p className="text-xs text-rose-300">{error}</p>}
        {!loading && projects.length === 0 && (
          <p className="text-xs text-slate-500">No saved projects yet. Use “Save” in the toolbar first.</p>
        )}

        <div className="max-h-72 space-y-1 overflow-y-auto">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2 text-xs text-slate-200 hover:bg-white/5"
            >
              <button className="flex-1 truncate text-left" onClick={() => openProject(p.id)}>
                <div className="font-medium">{p.name}</div>
                <div className="text-[10px] text-slate-500">{new Date(p.updatedAt).toLocaleString()}</div>
              </button>
              <button onClick={() => deleteProject(p.id)} className="ml-2 text-slate-500 hover:text-rose-300">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
