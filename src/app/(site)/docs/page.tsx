import type { Metadata } from "next";
import { Card, Container, CtaButton, PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Getting started, conversion parameters, keyboard shortcuts, export formats, offline installation and the REST API reference.",
};

const TOC = [
  { id: "getting-started", label: "Getting started" },
  { id: "conversion", label: "Conversion parameters" },
  { id: "draw-in-3d", label: "Drawing in the viewport" },
  { id: "modeling", label: "Modeling & materials" },
  { id: "shortcuts", label: "Keyboard shortcuts" },
  { id: "export", label: "Export formats" },
  { id: "offline", label: "Offline & self-hosting" },
  { id: "api", label: "REST API" },
];

const SHORTCUTS = [
  ["1", "Move (translate) gizmo"],
  ["2", "Rotate gizmo"],
  ["3", "Scale gizmo"],
  ["Esc", "Exit Draw in 3D and convert strokes"],
  ["Del / Backspace", "Delete selected object"],
  ["Ctrl / ⌘ + D", "Duplicate selected object"],
  ["Ctrl / ⌘ + Z", "Undo"],
  ["Ctrl / ⌘ + Shift + Z", "Redo"],
  ["Ctrl / ⌘ + S", "Save project"],
];

const PARAMS = [
  ["Mode", "Silhouette extrude for line art and logos, heightmap relief for photographs."],
  ["Resolution", "Size of the scalar field used for tracing. Higher captures more detail, lower is faster and smoother."],
  ["Threshold", "Brightness cut-off (1–254) that decides what counts as part of the shape."],
  ["Smoothing", "Number of box-blur passes applied before tracing. Removes speckle and jagged pixel noise."],
  ["Invert", "Flip which side of the threshold is treated as solid. Use for white-on-black artwork."],
  ["Extrude depth", "Thickness of the generated solid along the Z axis."],
  ["Simplify", "Douglas-Peucker tolerance. Higher values mean fewer vertices and cleaner curves."],
  ["Bevel", "Chamfers front and back edges so lighting catches the silhouette."],
  ["Height scale", "Heightmap mode only — how far luminance displaces the surface."],
];

const ENDPOINTS = [
  ["GET", "/api/health", "Liveness probe with a database round-trip."],
  ["GET", "/api/projects", "List saved projects, newest first."],
  ["POST", "/api/projects", "Create a project from a scene graph JSON payload."],
  ["GET", "/api/projects/:id", "Fetch one project including its full scene data."],
  ["PUT", "/api/projects/:id", "Update a project's name, scene data or thumbnail."],
  ["DELETE", "/api/projects/:id", "Permanently delete a project."],
  ["GET", "/api/gallery", "List publicly published projects."],
  ["GET", "/api/stats", "Aggregate counts for projects, objects and subscribers."],
  ["POST", "/api/contact", "Submit a contact enquiry."],
  ["POST", "/api/subscribe", "Add an email to the update list."],
];

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold text-white">
      {children}
    </h2>
  );
}

export default function DocsPage() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Everything you need to master the studio"
        subtitle="From your first conversion to self-hosted deployment and API automation."
      />

      <Container className="grid gap-10 py-16 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">On this page</p>
            <nav className="space-y-1">
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                  {t.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-12">
          <section className="space-y-4">
            <Heading id="getting-started">Getting started</Heading>
            <p className="text-sm leading-relaxed text-slate-400">
              Open the studio, then choose how your 2D artwork enters the scene. Everything runs locally, so no account
              or upload is required to start modeling.
            </p>
            <ol className="space-y-3">
              {[
                "Click Import to bring in a PNG or JPG, or click Draw in 3D to sketch straight onto the viewport.",
                "Pick a conversion mode: silhouette extrude for outlines, heightmap relief for photos.",
                "Press Generate — the mesh appears immediately in the viewport.",
                "Tune threshold, depth, simplify and bevel in the Inspector until it looks right.",
                "Apply a material preset, position lights, then export or save the project.",
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-slate-300">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-200">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <Heading id="conversion">Conversion parameters</Heading>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {PARAMS.map(([name, desc], i) => (
                <div key={name} className={`grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr] ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className="text-sm text-slate-400">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <Heading id="draw-in-3d">Drawing in the 3D viewport</Heading>
            <p className="text-sm leading-relaxed text-slate-400">
              <b className="text-slate-200">Draw in 3D</b> lets you sketch directly on the 3D scene rather than in a
              separate 2D canvas. While the mode is active, camera orbiting is suspended so every pointer movement is
              treated as a brush stroke.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="text-sm font-semibold text-white">Controls</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
                  <li>• <b className="text-slate-300">Undo</b> removes the last stroke</li>
                  <li>• <b className="text-slate-300">Clear</b> wipes the whole sketch</li>
                  <li>• <b className="text-slate-300">Convert to 3D</b> builds the mesh immediately</li>
                  <li>• <b className="text-slate-300">Done</b> / <b className="text-slate-300">Esc</b> exits and auto-converts</li>
                </ul>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold text-white">Tips for clean results</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
                  <li>• Draw closed outlines — gaps let the shape leak</li>
                  <li>• Increase brush size for bolder, easier-to-trace edges</li>
                  <li>• Enclosed inner loops automatically become holes</li>
                  <li>• Tune depth, bevel and simplify afterwards in the Inspector</li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <Heading id="modeling">Modeling & materials</Heading>
            <p className="text-sm leading-relaxed text-slate-400">
              Add primitives from the Add menu, then use the gizmos or the numeric transform fields in the Inspector.
              Material presets set metalness, roughness and emissive together; individual sliders let you refine from there.
              Lights are scene objects too — select them in the outliner to change colour, intensity and position.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <h3 className="text-sm font-semibold text-white">Outliner actions</h3>
                <p className="mt-2 text-sm text-slate-400">Select, rename, hide, lock, duplicate and delete any object in the scene tree.</p>
              </Card>
              <Card>
                <h3 className="text-sm font-semibold text-white">World colours</h3>
                <p className="mt-2 text-sm text-slate-400">Background, grid colour, fog and environment lighting live in the World Colors panel.</p>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <Heading id="shortcuts">Keyboard shortcuts</Heading>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {SHORTCUTS.map(([key, action], i) => (
                <div key={key} className={`flex items-center justify-between gap-4 px-5 py-3 ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                  <kbd className="rounded-md border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-xs text-slate-200">{key}</kbd>
                  <span className="text-sm text-slate-400">{action}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <Heading id="export">Export formats</Heading>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { f: "GLB", d: "Binary glTF with materials. Best for Unity, Unreal, Godot and web viewers." },
                { f: "OBJ", d: "Universal text mesh format. Ideal for Blender, Maya and Cinema 4D." },
                { f: "STL", d: "Binary triangle soup. The standard for 3D printing slicers." },
              ].map((e) => (
                <Card key={e.f}>
                  <div className="text-lg font-bold text-white">{e.f}</div>
                  <p className="mt-2 text-sm text-slate-400">{e.d}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <Heading id="offline">Offline & self-hosting</Heading>
            <p className="text-sm leading-relaxed text-slate-400">
              Install the app from your browser to cache the whole editor for offline use, or run the full stack on your
              own machine. Local runs need Node.js and PostgreSQL installed once while online.
            </p>
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-relaxed text-slate-300">
{`# one-time setup (requires internet)
npm install
npx drizzle-kit push

# build and run locally — no internet needed afterwards
npm run build
npm run start

# open the studio
http://localhost:3000/studio`}
            </pre>
            <p className="text-sm text-slate-400">
              If the database is unreachable, the studio automatically writes a browser backup. Restore it from
              <span className="text-slate-200"> File → Open Offline Backup</span>.
            </p>
          </section>

          <section className="space-y-4">
            <Heading id="api">REST API</Heading>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {ENDPOINTS.map(([method, path, desc], i) => (
                <div key={path + method} className={`grid gap-2 px-5 py-3 sm:grid-cols-[70px_220px_1fr] ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                  <span className={`font-mono text-[11px] font-bold ${method === "GET" ? "text-emerald-300" : method === "DELETE" ? "text-rose-300" : "text-amber-300"}`}>
                    {method}
                  </span>
                  <code className="font-mono text-xs text-slate-200">{path}</code>
                  <span className="text-sm text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-xs leading-relaxed text-slate-300">
{`curl -X POST http://localhost:3000/api/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Horse","sceneData":{"objects":[],"settings":{}}}'`}
            </pre>
          </section>

          <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-8 text-center">
            <h3 className="text-lg font-semibold text-white">Ready to build something?</h3>
            <div className="mt-5">
              <CtaButton href="/studio">Open the studio</CtaButton>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
