import type { Metadata } from "next";
import { Accordion } from "@/components/site/Accordion";
import { PricingTable } from "@/components/site/PricingTable";
import { Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free forever for solo creators. Pro and Studio plans add unlimited cloud projects, API access and self-hosted offline deployment.",
};

const FAQS = [
  { q: "Is the conversion engine limited on the Free plan?", a: "No. Conversion runs on your own device, so it is unmetered on every plan. Paid tiers add cloud storage, collaboration, API access and higher tracing resolution, not faster generation." },
  { q: "Do you charge per generated model?", a: "Never. There are no credits, tokens or per-model fees, because we do not rent GPUs to produce your meshes." },
  { q: "Can I self-host it inside my network?", a: "Yes, on the Studio plan. You get a deployment bundle that runs the Next.js app and PostgreSQL entirely inside your own infrastructure, fully air-gapped if needed." },
  { q: "What happens to my projects if I downgrade?", a: "Nothing is deleted. Projects beyond your plan's limit become read-only, and you can always export them to GLB, OBJ or STL." },
  { q: "Do you offer education or non-profit discounts?", a: "Yes — classrooms, students and registered non-profits get the Pro plan free. Contact us with proof of status." },
];

const INCLUDED = [
  "Unlimited instant conversions",
  "Silhouette + heightmap modes",
  "Draw directly in the 3D viewport",
  "All eight primitives",
  "Material preset library",
  "Ambient / directional / point lights",
  "GLB, OBJ and STL export",
  "Offline PWA install",
  "Local browser backups",
  "Undo / redo history",
  "Keyboard shortcuts",
  "Mobile and tablet support",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Free where it matters, paid where it scales"
        subtitle="The conversion engine runs on your hardware, so we never charge per model. You only pay when you need cloud collaboration, API automation or self-hosted deployment."
      />

      <section className="py-16">
        <Container>
          <PricingTable />
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.015] py-16">
        <Container>
          <SectionHeading eyebrow="Included on every plan" title="Nothing important is paywalled" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-300">
                <span className="text-emerald-400">✓</span>
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Billing questions" title="Pricing FAQ" />
          <div className="mx-auto mt-10 max-w-3xl">
            <Accordion items={FAQS} />
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-20">
        <Container>
          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Start free — upgrade only if you outgrow it</h2>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/studio">Launch studio</CtaButton>
              <CtaButton href="/contact" variant="ghost">
                Talk to sales
              </CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
