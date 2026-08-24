import Link from "next/link";
import { Accordion } from "@/components/site/Accordion";
import { Badge, Card, Container, CtaButton, FeatureCard, SectionHeading, Stat } from "@/components/site/ui";

const FEATURES = [
  { icon: "⚡", title: "Zero-wait conversion", body: "Sketches become meshes in under 16ms — the whole pipeline runs on your CPU, not a render farm." },
  { icon: "✏️", title: "Draw straight in the viewport", body: "Sketch directly onto the 3D scene with your mouse, stylus or finger — strokes become a mesh the moment you finish." },
  { icon: "🎨", title: "Full PBR materials", body: "Chrome, gold, glass, neon and clay presets plus metalness, roughness, emissive and opacity control." },
  { icon: "🧊", title: "Real modeling tools", body: "Eight primitives, move/rotate/scale gizmos, outliner, lock & visibility, duplicate and undo history." },
  { icon: "💡", title: "Scene lighting & world", body: "Ambient, directional and point lights with studio, sunset and night environments plus fog." },
  { icon: "📦", title: "Industry-standard export", body: "Download GLB, OBJ or STL and open straight in Blender, Unity, Unreal or your slicer." },
  { icon: "📴", title: "Offline-first PWA", body: "Install it once and the entire engine keeps working with the network completely disconnected." },
  { icon: "🔒", title: "Private by design", body: "Your artwork never leaves the device during conversion — no uploads, no third-party inference." },
  { icon: "🗄️", title: "Cloud + local saves", body: "PostgreSQL-backed projects with automatic browser backups when the server is unreachable." },
];

const STEPS = [
  { n: "01", title: "Bring in your 2D art", body: "Drop a photo, import a PNG/JPG sketch, or draw straight onto the 3D viewport with Draw in 3D." },
  { n: "02", title: "Contours are traced", body: "A marching-squares solver extracts outlines, then Douglas-Peucker simplification cleans the curve." },
  { n: "03", title: "Solids are generated", body: "Holes are resolved with ray-casting and the shape is extruded and beveled into a watertight mesh." },
  { n: "04", title: "Edit, light and export", body: "Adjust materials and lights, then export GLB, OBJ or STL for any downstream pipeline." },
];

const COMPARISON = [
  ["Conversion time", "Instant (< 16 ms)", "2–5 minutes queued"],
  ["Runs offline", "Yes, fully", "No — cloud GPU required"],
  ["Uploads your artwork", "Never", "Always"],
  ["Editable after generation", "Full scene editor", "Static mesh download"],
  ["Live parameter tuning", "Real-time sliders", "Re-run the whole job"],
  ["Cost per model", "$0", "Credits per generation"],
];

const TESTIMONIALS = [
  { quote: "We prototype packaging silhouettes in the browser during client calls now. Nobody waits for a render queue anymore.", name: "Marta Vieira", role: "Design Lead, Pixel Forge" },
  { quote: "The offline mode sold it. Our workshop has terrible wifi and Sketch3D just keeps working on the shop floor tablet.", name: "Dan Okoye", role: "Product Engineer, Makerworks" },
  { quote: "Students draw a shape, hit convert, and immediately understand extrusion and topology. It's the best teaching tool I've used.", name: "Prof. Aiko Tanaka", role: "Industrial Design, KTU" },
];

const FAQS = [
  { q: "Is this really instant, with no waiting?", a: "Yes. Conversion uses deterministic geometry algorithms (marching squares, Douglas-Peucker simplification, extrusion) that execute in milliseconds on your own device. There is no queue, no credit system and no GPU server in the loop." },
  { q: "Does it work on a phone or tablet?", a: "Fully. The studio has a mobile layout with collapsible panels, touch-friendly gizmos and finger-drawing straight on the 3D viewport. Install it to your home screen for a native-feeling app." },
  { q: "Can I use the models commercially?", a: "Yes. You own everything you create. Exported GLB, OBJ and STL files carry no restrictions from us." },
  { q: "What happens to my sketches?", a: "Conversion happens entirely in your browser, so artwork is never uploaded during generation. Files only reach our database if you explicitly save a project to the cloud." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_20%,rgba(217,70,239,0.16),transparent_70%)]" />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="emerald">⚡ No render queue · No GPU server · Works offline</Badge>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Turn 2D sketches into{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                editable 3D models
              </span>{" "}
              instantly
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
              Sketch3D Studio is a complete browser-native 3D suite. Draw or drop an image, get a real mesh in
              milliseconds, then model, texture, light and export it — all without uploading a single pixel.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/studio">Launch the studio free →</CtaButton>
              <CtaButton href="/how-it-works" variant="ghost">
                See how it works
              </CtaButton>
            </div>
            <p className="mt-4 text-xs text-slate-500">No account required · Works on phone, tablet and desktop</p>
          </div>

          {/* Visual mock */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12141b] shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#181b24] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-[11px] text-slate-500">Sketch3D Studio — untitled scene</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr_150px]">
                <div className="hidden flex-col gap-2 border-r border-white/10 p-3 sm:flex">
                  {["🖼️ Horse sketch", "⬛ Cube", "☀️ Key Light", "🌗 Ambient"].map((l, i) => (
                    <div key={l} className={`rounded px-2 py-1.5 text-[10px] ${i === 0 ? "bg-indigo-500/20 text-white" : "text-slate-400"}`}>
                      {l}
                    </div>
                  ))}
                </div>
                <div className="relative grid h-56 place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.18),transparent_65%)] sm:h-72">
                  <div className="relative">
                    <div className="h-28 w-28 rotate-12 rounded-2xl border border-indigo-300/40 bg-gradient-to-br from-indigo-400/40 to-fuchsia-500/30 shadow-2xl sm:h-36 sm:w-36" />
                    <div className="absolute -bottom-4 -right-6 h-20 w-20 -rotate-6 rounded-xl border border-white/20 bg-gradient-to-br from-amber-300/30 to-rose-400/20 sm:h-24 sm:w-24" />
                  </div>
                  <div className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-[9px] text-slate-300">
                    Move 1 · Rotate 2 · Scale 3
                  </div>
                </div>
                <div className="hidden flex-col gap-2 border-l border-white/10 p-3 sm:flex">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">Material</div>
                  {["Chrome", "Gold", "Neon"].map((m) => (
                    <div key={m} className="rounded border border-white/10 px-2 py-1 text-[10px] text-slate-300">{m}</div>
                  ))}
                  <div className="mt-2 text-[9px] uppercase tracking-wider text-slate-500">Depth</div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value="<16ms" label="Conversion time" />
            <Stat value="100%" label="Client-side" />
            <Stat value="3" label="Export formats" />
            <Stat value="0" label="Cloud credits" />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-20">
        <Container>
          <SectionHeading
            eyebrow="Everything included"
            title="A full 3D suite, not a one-shot generator"
            subtitle="Most tools hand you a static mesh and walk away. Sketch3D gives you the whole workshop: conversion, modeling, materials, lighting, persistence and export."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title}>
                {f.body}
              </FeatureCard>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CtaButton href="/features" variant="ghost">
              Explore all features →
            </CtaButton>
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <section className="border-t border-white/10 bg-white/[0.015] py-20">
        <Container>
          <SectionHeading eyebrow="The pipeline" title="Four steps from pencil to polygon" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <Card key={s.n}>
                <div className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-2xl font-bold text-transparent">
                  {s.n}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparison */}
      <section className="border-t border-white/10 py-20">
        <Container>
          <SectionHeading
            eyebrow="Why it's different"
            title="Deterministic geometry beats cloud AI queues"
            subtitle="AI generators guess a mesh on a rented GPU and make you wait. We solve the geometry mathematically on your device — repeatable, private and free."
          />
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-3 bg-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span />
              <span className="text-center text-indigo-200">Sketch3D</span>
              <span className="text-center">Cloud AI tools</span>
            </div>
            {COMPARISON.map(([label, ours, theirs], i) => (
              <div
                key={label}
                className={`grid grid-cols-3 items-center gap-2 px-4 py-3 text-sm ${i % 2 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-slate-400">{label}</span>
                <span className="text-center font-medium text-emerald-300">{ours}</span>
                <span className="text-center text-slate-500">{theirs}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/10 bg-white/[0.015] py-20">
        <Container>
          <SectionHeading eyebrow="Loved by makers" title="Built for people who ship" />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <div className="text-amber-300">★★★★★</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-slate-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 py-20">
        <Container>
          <SectionHeading eyebrow="Questions" title="Frequently asked" />
          <div className="mx-auto mt-10 max-w-3xl">
            <Accordion items={FAQS} />
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm text-indigo-300 hover:text-indigo-200">
                Read the full FAQ →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 via-fuchsia-600/10 to-transparent p-10 text-center sm:p-16">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your next 3D model is one sketch away
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              Open the studio, draw a shape, and watch it become a real mesh before you lift your finger.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/studio">Launch studio — it&apos;s free</CtaButton>
              <CtaButton href="/download" variant="ghost">
                Install for offline
              </CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
