import type { Metadata } from "next";
import { Accordion } from "@/components/site/Accordion";
import { Container, CtaButton, PageHero, SectionHeading } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about instant conversion, offline use, mobile support, privacy, licensing and self-hosting.",
};

const GROUPS = [
  {
    title: "Product",
    items: [
      { q: "What exactly does Sketch3D do?", a: "It converts 2D artwork — sketches, logos, technical drawings and photographs — into editable 3D meshes, then gives you a complete editor to refine, light, colour and export them." },
      { q: "Is the conversion really instant?", a: "Yes. The pipeline is deterministic computational geometry that finishes in well under one animation frame, so parameter sliders update the mesh in real time as you drag them." },
      { q: "Is this AI?", a: "No, and that is intentional. AI generators hallucinate geometry and require GPU time. We solve the shape mathematically, which makes results repeatable, explainable, free and private." },
      { q: "What is the difference between the two modes?", a: "Silhouette extrude traces an outline and extrudes a solid — ideal for line art. Heightmap relief displaces a plane using image brightness — ideal for photos and terrain." },
    ],
  },
  {
    title: "Offline & platforms",
    items: [
      { q: "Does it work without internet?", a: "Yes. Install it as a PWA and the editor, viewport drawing, conversion engine and exporters all keep working offline. Only cloud project sync needs a server." },
      { q: "Does it run on a phone?", a: "Fully. The studio has a responsive mobile layout with collapsible panels, a bottom tab bar and touch-friendly drawing and gizmos." },
      { q: "Which browsers are supported?", a: "Any modern browser with WebGL2 — Chrome, Edge, Firefox, Safari and their mobile equivalents." },
      { q: "Can I run it on my own server?", a: "Yes. It is a standard Next.js app with PostgreSQL. Run npm run build and npm run start behind your own network, fully air-gapped if required." },
    ],
  },
  {
    title: "Data & licensing",
    items: [
      { q: "Do you upload my sketches?", a: "Never during conversion. Images are processed in your browser. Artwork only reaches the database if you explicitly save a cloud project." },
      { q: "Who owns the models I create?", a: "You do, completely. Exports carry no licensing restrictions from us and can be used commercially." },
      { q: "What happens if the server goes down mid-session?", a: "Saving falls back to a local browser backup automatically, and you can restore it later from File → Open Offline Backup." },
      { q: "Can I delete my data?", a: "Yes. Delete any project from the Projects dialog, or contact us and we will purge all associated records." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Answers before you ask"
        subtitle="Everything people usually want to know about how Sketch3D works, where it runs and who owns the output."
      />

      <section className="py-16">
        <Container className="space-y-12">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <SectionHeading align="left" title={group.title} />
              <div className="mt-6">
                <Accordion items={group.items} />
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-600/20 to-transparent p-10 text-center">
            <h2 className="text-2xl font-bold text-white">Still have a question?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
              Our team answers every message within one business day.
            </p>
            <div className="mt-7">
              <CtaButton href="/contact">Contact us</CtaButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
