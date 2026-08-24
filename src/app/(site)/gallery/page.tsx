import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Models created with Sketch3D Studio — from line-art silhouettes to photo-derived relief surfaces.",
};

export const dynamic = "force-dynamic";

const SAMPLES = [
  { name: "Galloping Horse", mode: "Silhouette extrude", note: "Ink sketch traced, legs resolved as separate hulls, 22mm bevel.", gradient: "from-amber-400/30 to-rose-500/20" },
  { name: "Mountain Ridge", mode: "Heightmap relief", note: "Landscape photo displaced along Y with texture projection.", gradient: "from-emerald-400/30 to-cyan-500/20" },
  { name: "Brand Monogram", mode: "Silhouette extrude", note: "Vector-clean logo with interior counters kept as holes.", gradient: "from-indigo-400/30 to-fuchsia-500/20" },
  { name: "Leaf Study", mode: "Silhouette extrude", note: "Botanical outline, high simplify tolerance for soft curves.", gradient: "from-lime-400/30 to-emerald-500/20" },
  { name: "Portrait Relief", mode: "Heightmap relief", note: "Coin-style bas-relief from a black and white photograph.", gradient: "from-orange-400/30 to-amber-500/20" },
  { name: "Mechanical Bracket", mode: "Silhouette extrude", note: "Technical drawing converted and exported straight to STL.", gradient: "from-sky-400/30 to-indigo-500/20" },
];

export default async function GalleryPage() {
  let community: { id: string; name: string; description: string | null; objectCount: number }[] = [];
  try {
    community = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        objectCount: projects.objectCount,
      })
      .from(projects)
      .where(eq(projects.isPublic, true))
      .orderBy(desc(projects.updatedAt))
      .limit(12);
  } catch {
    community = [];
  }

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Made from flat art in a single click"
        subtitle="Every model below started as a 2D sketch, logo or photograph and was converted, refined and exported entirely inside the browser."
      >
        <CtaButton href="/studio">Make your own →</CtaButton>
      </PageHero>

      <section className="py-16">
        <Container>
          <SectionHeading align="left" eyebrow="Showcase" title="Reference conversions" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLES.map((s) => (
              <Card key={s.name} className="overflow-hidden p-0">
                <div className={`relative grid h-44 place-items-center bg-gradient-to-br ${s.gradient}`}>
                  <div className="h-20 w-20 rotate-12 rounded-2xl border border-white/30 bg-white/10 backdrop-blur" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-slate-200">
                    {s.mode}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{s.note}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-white/[0.015] py-16">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Community"
            title="Published community scenes"
            subtitle="Projects that creators chose to publish publicly from their studio workspace."
          />
          {community.length === 0 ? (
            <Card className="mt-10 text-center">
              <p className="text-sm text-slate-400">
                No community scenes published yet. Save a project in the studio and mark it public to appear here first.
              </p>
              <div className="mt-5">
                <CtaButton href="/studio" variant="ghost">
                  Publish the first one
                </CtaButton>
              </div>
            </Card>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {community.map((p) => (
                <Card key={p.id}>
                  <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-400">{p.description ?? "A scene built in Sketch3D Studio."}</p>
                  <p className="mt-3 text-[11px] text-slate-500">{p.objectCount} objects</p>
                  <Link href="/studio" className="mt-4 inline-block text-xs text-indigo-300 hover:text-indigo-200">
                    Open in studio →
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
