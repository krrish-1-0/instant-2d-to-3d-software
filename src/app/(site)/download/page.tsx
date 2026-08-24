import type { Metadata } from "next";
import { InstallPWA } from "@/components/site/InstallPWA";
import { Card, Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Offline & Install",
  description: "Install Sketch3D as an offline app or run the full stack locally with Node.js and PostgreSQL.",
};

const PLATFORMS = [
  { icon: "🖥️", title: "Desktop Chrome / Edge", steps: ["Open the studio", "Click the install icon in the address bar", "Choose Install"] },
  { icon: "🤖", title: "Android", steps: ["Open the site in Chrome", "Tap ⋮ menu", "Tap Install app / Add to Home screen"] },
  { icon: "📱", title: "iPhone / iPad", steps: ["Open the site in Safari", "Tap the Share button", "Tap Add to Home Screen"] },
];

const WORKS_OFFLINE = [
  "3D viewport and camera navigation",
  "Instant 2D→3D conversion engine",
  "Drawing directly on the 3D viewport",
  "All primitives, gizmos and the outliner",
  "Material presets and light editing",
  "Undo / redo history",
  "GLB, OBJ and STL export",
  "Local browser project backups",
];

const NEEDS_SERVER = [
  "Cloud project save and load",
  "Public gallery publishing",
  "Contact form and newsletter",
  "Aggregate usage statistics",
];

export default function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Offline"
        title="Install once, model anywhere"
        subtitle="Sketch3D is a Progressive Web App with a cached application shell, so the entire editor keeps running when the network disappears."
      >
        <CtaButton href="/studio">Open the studio first →</CtaButton>
      </PageHero>

      <section className="py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <InstallPWA />

            <Card>
              <h3 className="text-sm font-semibold text-white">Why offline works</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                The conversion pipeline is plain JavaScript geometry running on your CPU, and rendering uses your local
                GPU through WebGL. Nothing about creating a model requires a network round-trip, so once the app shell is
                cached there is nothing left to download.
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">Service worker strategy</p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
                  <li>• Static build assets: cache-first for instant loads</li>
                  <li>• Pages: network-first with cached fallback</li>
                  <li>• API traffic: never cached, always live</li>
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.015] py-16">
        <Container>
          <SectionHeading eyebrow="Install guide" title="Three taps on any device" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PLATFORMS.map((p) => (
              <Card key={p.title}>
                <div className="text-2xl">{p.icon}</div>
                <h3 className="mt-3 text-sm font-semibold text-white">{p.title}</h3>
                <ol className="mt-3 space-y-2">
                  {p.steps.map((s, i) => (
                    <li key={s} className="flex gap-2.5 text-sm text-slate-400">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/5 text-[10px] text-slate-300">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold text-emerald-300">✓ Works with no connection</h3>
              <ul className="mt-4 space-y-2">
                {WORKS_OFFLINE.map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    {w}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="text-sm font-semibold text-amber-300">⚠ Needs a running server</h3>
              <ul className="mt-4 space-y-2">
                {NEEDS_SERVER.map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-slate-300">
                    <span className="text-amber-400">•</span>
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Run the stack locally and even these work without internet — everything stays on your machine.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-16">
        <Container>
          <SectionHeading align="left" eyebrow="Self-hosted" title="Run the whole stack on your own machine" />
          <pre className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-6 text-xs leading-relaxed text-slate-300">
{`# 1. one-time setup, needs internet
npm install
npx drizzle-kit push          # creates tables in your local PostgreSQL

# 2. build the production bundle
npm run build

# 3. start it — internet no longer required
npm run start

# 4. open in any browser on your network
http://localhost:3000/studio`}
          </pre>
          <p className="mt-4 text-sm text-slate-400">
            Point <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-200">DATABASE_URL</code> in your
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-200">.env</code> at a local PostgreSQL
            instance and the entire product — including cloud saves and the gallery — runs air-gapped.
          </p>
        </Container>
      </section>
    </>
  );
}
