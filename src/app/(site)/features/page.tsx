import type { Metadata } from "next";
import { Card, Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Instant 2D→3D conversion, drawing directly in the 3D viewport, PBR materials, lighting, gizmo modeling, offline PWA support and GLB/OBJ/STL export.",
};

const GROUPS = [
  {
    eyebrow: "Conversion engine",
    title: "Two deterministic ways to reach 3D",
    items: [
      { icon: "🪄", title: "Silhouette extrude", body: "Traces the outline of line-art or a logo, resolves interior holes, then extrudes and bevels a watertight solid." },
      { icon: "🏔️", title: "Heightmap relief", body: "Maps photo luminance to elevation, producing textured bas-relief surfaces and terrain from any picture." },
      { icon: "🎚️", title: "Live parameter tuning", body: "Threshold, resolution, smoothing, invert, depth, simplify and bevel all recompute in real time as you drag." },
      { icon: "🧮", title: "Explainable math", body: "Marching squares, Douglas-Peucker, shoelace winding and ray-casting — no black-box model, fully repeatable output." },
    ],
  },
  {
    eyebrow: "Creation tools",
    title: "A real modeling workspace",
    items: [
      { icon: "✏️", title: "Draw in the 3D viewport", body: "Sketch directly on the scene with adjustable brush size, per-stroke undo and instant conversion — never leave 3D." },
      { icon: "🧊", title: "Eight primitives", body: "Cube, sphere, cylinder, cone, torus, plane, icosahedron and capsule to block out ideas fast." },
      { icon: "✥", title: "Transform gizmos", body: "Move, rotate and scale handles with numeric transform fields and degree-based rotation input." },
      { icon: "🗂️", title: "Outliner", body: "Select, rename, hide, lock, duplicate and delete every object in a familiar scene tree." },
    ],
  },
  {
    eyebrow: "Look development",
    title: "Colour, material and light",
    items: [
      { icon: "🎨", title: "Material presets", body: "Chrome, gold, plastic, clay, matte black, neon blue, neon pink and glass in one click." },
      { icon: "🌈", title: "Full colour control", body: "Quick swatches, hex input and a native colour picker for base colour and emissive glow." },
      { icon: "💡", title: "Light rig", body: "Ambient, directional and point lights with per-light colour, intensity and positioning." },
      { icon: "🌍", title: "World settings", body: "Studio, sunset and night environments, background and grid colours, plus volumetric fog." },
    ],
  },
  {
    eyebrow: "Pipeline",
    title: "Persistence, export and platform",
    items: [
      { icon: "📦", title: "GLB / OBJ / STL", body: "Export to the formats Blender, Unity, Unreal, Godot and every 3D printer slicer already understand." },
      { icon: "🗄️", title: "PostgreSQL projects", body: "Scenes are stored as compact JSON scene graphs, so saving and loading is near-instant." },
      { icon: "🧳", title: "Automatic local backup", body: "If the server is unreachable your scene is written to browser storage and can be restored later." },
      { icon: "📱", title: "Phone and tablet ready", body: "Responsive editor with collapsible panels, bottom navigation and full touch support." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Every tool you need between sketch and shipped mesh"
        subtitle="Sketch3D combines a deterministic conversion engine with a genuine 3D editor, so the model you generate is the model you refine, light and export."
      >
        <div className="flex flex-wrap gap-3">
          <CtaButton href="/studio">Try it now</CtaButton>
          <CtaButton href="/pricing" variant="ghost">
            See pricing
          </CtaButton>
        </div>
      </PageHero>

      {GROUPS.map((group, gi) => (
        <section key={group.title} className={`border-b border-white/10 py-16 ${gi % 2 ? "bg-white/[0.015]" : ""}`}>
          <Container>
            <SectionHeading align="left" eyebrow={group.eyebrow} title={group.title} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {group.items.map((item) => (
                <Card key={item.title}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="py-20">
        <Container>
          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Open the studio and try every feature free</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/studio">Launch studio</CtaButton>
              <CtaButton href="/docs" variant="ghost">
                Read the docs
              </CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
