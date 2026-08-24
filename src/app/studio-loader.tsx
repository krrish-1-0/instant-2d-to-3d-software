"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(() => import("@/components/studio/Studio").then((m) => m.Studio), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#12141b] text-slate-300">
      <div className="text-center">
        <div className="mb-3 text-3xl">🧊</div>
        <p className="text-sm">Loading Sketch3D Studio…</p>
      </div>
    </div>
  ),
});

export default function StudioLoader() {
  return <Studio />;
}
