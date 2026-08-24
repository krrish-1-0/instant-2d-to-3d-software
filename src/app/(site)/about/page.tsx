import type { Metadata } from "next";
import { Card, Container, CtaButton, PageHero, SectionHeading, Stat } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built a deterministic, offline-first alternative to cloud AI 3D generators.",
};

const VALUES = [
  { icon: "⚡", title: "Instant or it doesn't count", body: "If a creative tool makes you wait, it interrupts thinking. Every feature we ship must respond inside one frame." },
  { icon: "🔍", title: "Explainable over magical", body: "You should be able to understand and predict what a tool does. Our pipeline is published algorithms, not a black box." },
  { icon: "🔒", title: "Your work stays yours", body: "Artwork is processed locally by default. Privacy is an architecture decision, not a policy paragraph." },
  { icon: "📴", title: "Works where you are", body: "Workshops, classrooms and job sites have bad wifi. Offline capability is a core requirement, not a bonus." },
];

const TIMELINE = [
  { year: "Phase 1", title: "The tracing prototype", body: "A weekend experiment proving marching squares could turn a pencil sketch into a mesh faster than a cloud API could respond." },
  { year: "Phase 2", title: "A real editor", body: "Outliner, gizmos, materials and lighting turned the converter into a workspace people could actually finish work in." },
  { year: "Phase 3", title: "Offline first", body: "PWA install, cached app shell and local backups made the studio usable with no connection at all." },
  { year: "Phase 4", title: "Pipeline ready", body: "GLB, OBJ and STL export plus a REST API connected Sketch3D to Blender, game engines and 3D printers." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We think 3D creation should feel like drawing"
        subtitle="Sketch3D exists because the fastest path from an idea to a mesh should not involve a queue, a credit balance or an upload dialog."
      />

      <section className="py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading align="left" eyebrow="Our story" title="Built out of frustration with waiting" />
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-400">
                <p>
                  Cloud 3D generators are impressive demos and frustrating tools. You upload artwork, join a queue, wait
                  minutes, spend a credit, and receive a mesh you cannot meaningfully edit. Iterating means starting over.
                </p>
                <p>
                  We took the opposite approach. Instead of guessing geometry with a neural network on a rented GPU, we
                  solve it mathematically on the device already in your hands. Contour tracing, curve simplification and
                  extrusion are decades-old, extremely fast, and completely predictable.
                </p>
                <p>
                  The result is a studio where the slider you drag updates the mesh in real time, where your sketches never
                  leave your laptop, and where losing internet connection changes nothing about your workflow.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 self-start">
              <Stat value="<16ms" label="Conversion" />
              <Stat value="0" label="Uploads required" />
              <Stat value="100%" label="Offline capable" />
              <Stat value="3" label="Export formats" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.015] py-16">
        <Container>
          <SectionHeading eyebrow="Principles" title="What we optimise for" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <Card key={v.title}>
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 text-lg">
                    {v.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{v.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Journey" title="How the studio came together" />
          <div className="mt-10 space-y-4">
            {TIMELINE.map((t) => (
              <Card key={t.year}>
                <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">{t.year}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-20">
        <Container>
          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Try the philosophy for yourself</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/studio">Launch studio</CtaButton>
              <CtaButton href="/contact" variant="ghost">
                Get in touch
              </CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
