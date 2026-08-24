import type { Metadata } from "next";
import { Card, Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The five-stage geometry pipeline behind instant 2D to 3D conversion: rasterization, marching squares, Douglas-Peucker simplification, hole resolution and extrusion.",
};

const STAGES = [
  {
    n: "Stage 1",
    title: "Rasterization & normalization",
    body: "Your image or sketch is drawn into an offscreen canvas at a fixed square resolution using letterbox scaling, so aspect ratio is preserved. Large photos are downscaled to a 640px working copy first, which keeps every later stage inside a single animation frame. The average colour of the artwork is sampled at the same time to seed a sensible starting material.",
    detail: ["Letterbox fit, no cropping", "Automatic downscale for big photos", "Average colour sampling"],
  },
  {
    n: "Stage 2",
    title: "Contour tracing with marching squares",
    body: "Pixels are converted to a grayscale scalar field. The marching-squares algorithm walks every 2×2 cell, compares each corner against your threshold, and emits line segments from a 16-case lookup table. The result is a set of closed vector contours that follow the boundary of your subject exactly.",
    detail: ["Threshold slider controls the isoline", "Optional invert for dark backgrounds", "Box-blur smoothing passes"],
  },
  {
    n: "Stage 3",
    title: "Polyline simplification",
    body: "Raw pixel contours contain thousands of stair-step points. The Ramer-Douglas-Peucker algorithm recursively discards points that sit closer to a chord than your simplify tolerance, collapsing noise into clean curves while preserving silhouette character. This is what keeps the mesh light enough to edit at 60fps.",
    detail: ["Recursive perpendicular-distance test", "Tolerance exposed as a slider", "Massive triangle-count reduction"],
  },
  {
    n: "Stage 4",
    title: "Hole and nesting resolution",
    body: "A donut needs a hole; a horse needs gaps between its legs. Each contour's signed area is computed with the shoelace formula to determine winding, and ray-casting point-in-polygon tests establish which loops sit inside which. Nested loops become subtractive holes on their parent shape automatically.",
    detail: ["Shoelace signed area", "Ray-casting containment test", "Automatic hole subtraction"],
  },
  {
    n: "Stage 5",
    title: "Extrusion, bevel and normals",
    body: "The resolved shapes are swept along the Z axis into a solid. Optional bevelling chamfers the front and back edges so highlights read properly, vertex normals are recomputed for smooth shading, and the mesh is centred and normalized to unit scale for predictable placement in the scene.",
    detail: ["Depth and bevel sliders", "Recomputed vertex normals", "Auto-centring and unit scaling"],
  },
];

const HEIGHTMAP = [
  "Luminance of every pixel is sampled into a 2D grid.",
  "A subdivided plane is displaced along Y by that luminance value.",
  "The original image is bound as a colour texture via CanvasTexture.",
  "Normals are recomputed so lighting reacts to the new relief.",
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="No AI guesswork — just solved geometry"
        subtitle="Every conversion is a deterministic sequence of well-understood computational geometry algorithms running on your own device. Same input, same output, every single time."
      >
        <CtaButton href="/studio">Watch it happen live</CtaButton>
      </PageHero>

      <section className="py-16">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-5">
              {["2D input", "Raster grid", "Contours", "Clean paths", "3D mesh"].map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-transparent px-3 py-4 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Step {i + 1}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{label}</div>
                  </div>
                  {i < 4 && <span className="hidden text-slate-600 sm:block">→</span>}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.015] py-16">
        <Container>
          <SectionHeading align="left" eyebrow="Silhouette mode" title="The five-stage solid pipeline" />
          <div className="mt-10 space-y-5">
            {STAGES.map((stage) => (
              <Card key={stage.n}>
                <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">{stage.n}</div>
                    <h3 className="mt-1 text-base font-semibold text-white">{stage.title}</h3>
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed text-slate-400">{stage.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stage.detail.map((d) => (
                        <span key={d} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionHeading align="left" eyebrow="Heightmap mode" title="Photos become relief surfaces" />
              <ul className="mt-6 space-y-3">
                {HEIGHTMAP.map((h, i) => (
                  <li key={h} className="flex gap-3 text-sm text-slate-300">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-200">
                      {i + 1}
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <SectionHeading align="left" eyebrow="Performance" title="Why it stays under one frame" />
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3"><span className="text-emerald-400">✓</span> Working resolution is capped so pixel loops stay small.</li>
                <li className="flex gap-3"><span className="text-emerald-400">✓</span> Simplification runs before mesh construction, not after.</li>
                <li className="flex gap-3"><span className="text-emerald-400">✓</span> Geometry is rebuilt only when a parameter actually changes.</li>
                <li className="flex gap-3"><span className="text-emerald-400">✓</span> Buffers are disposed on every rebuild to prevent GPU leaks.</li>
                <li className="flex gap-3"><span className="text-emerald-400">✓</span> Decoded source images are cached between parameter tweaks.</li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-20">
        <Container>
          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">See the whole pipeline run in milliseconds</h2>
            <div className="mt-7">
              <CtaButton href="/studio">Open the studio</CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
