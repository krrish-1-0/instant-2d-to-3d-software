import type { Metadata } from "next";
import { Badge, Card, Container, PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every release of Sketch3D Studio, newest first.",
};

const RELEASES = [
  {
    version: "v1.4",
    tag: "Latest",
    title: "Draw directly in the 3D viewport",
    items: [
      "New Draw in 3D mode — sketch straight onto the 3D scene instead of a separate 2D canvas",
      "Strokes convert to an editable mesh automatically when you finish drawing",
      "Per-stroke undo, clear and an explicit Convert to 3D action in the viewport",
      "Adjustable brush size with high-DPI correct stroke rendering",
      "Orbit controls suspend while drawing; Esc exits and converts",
      "Retired the standalone 2D sketch board in favour of the unified in-viewport flow",
    ],
  },
  {
    version: "v1.3",
    title: "Professional website, mobile studio and PWA offline",
    items: [
      "Full marketing site: features, pipeline, gallery, pricing, docs, FAQ, about, contact and offline guide",
      "Responsive studio layout with collapsible panels and a mobile bottom tab bar",
      "Progressive Web App install with cached app shell for true offline use",
      "New public gallery, contact and newsletter APIs backed by PostgreSQL",
      "SEO metadata, sitemap, robots and web manifest",
    ],
  },
  {
    version: "v1.2",
    title: "Advanced colour and material controls",
    items: [
      "Eight material presets: chrome, gold, plastic, clay, matte black, neon blue, neon pink and glass",
      "Quick colour swatches and emissive glow controls in the inspector",
      "Freehand drawing tools with brush, eraser and fill",
      "World Colors panel for background, grid, fog and environment lighting",
      "Automatic local browser backup when the server is unreachable",
    ],
  },
  {
    version: "v1.1",
    title: "Editor depth",
    items: [
      "Undo and redo history with snapshot diffing",
      "Outliner lock, visibility, duplicate and rename actions",
      "Keyboard shortcuts for gizmo modes, delete, duplicate and save",
      "GLB, OBJ and STL exporters",
      "PostgreSQL project persistence via Drizzle ORM",
    ],
  },
  {
    version: "v1.0",
    title: "Instant 2D to 3D",
    items: [
      "Marching-squares silhouette tracing with hole resolution",
      "Douglas-Peucker simplification and extrusion with bevelling",
      "Heightmap relief mode with texture projection",
      "Real-time parameter sliders and transform gizmos",
      "Ambient, directional and point lighting",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="What shipped, and when"
        subtitle="We release small and often. Every entry below is live in the studio right now."
      />

      <section className="py-16">
        <Container>
          <div className="space-y-5">
            {RELEASES.map((r) => (
              <Card key={r.version}>
                <div className="grid gap-5 lg:grid-cols-[170px_1fr]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-white">{r.version}</span>
                      {r.tag && <Badge tone="emerald">{r.tag}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{r.title}</p>
                  </div>
                  <ul className="space-y-2">
                    {r.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-slate-300">
                        <span className="text-indigo-400">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
