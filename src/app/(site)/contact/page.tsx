import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Card, Container, PageHero } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Sketch3D team about support, team plans, self-hosted deployment or partnerships.",
};

const CHANNELS = [
  { icon: "💬", title: "Support", body: "Stuck on a conversion or an export? Send us the sketch and settings and we'll reproduce it.", meta: "Replies within 1 business day" },
  { icon: "🏢", title: "Teams & enterprise", body: "Shared workspaces, SSO, audit logs and air-gapped self-hosted deployment.", meta: "Custom onboarding available" },
  { icon: "🤝", title: "Partnerships", body: "Education programs, integrations and OEM licensing of the conversion engine.", meta: "Let's build together" },
  { icon: "🐞", title: "Bug reports", body: "Include your browser, device and the source image if you can share it.", meta: "Triaged daily" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're building"
        subtitle="Whether you need help with a tricky silhouette or want Sketch3D running inside your own network, we're happy to help."
      />

      <section className="py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <ContactForm />

            <div className="space-y-4">
              {CHANNELS.map((c) => (
                <Card key={c.title}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-base">
                      {c.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{c.body}</p>
                      <p className="mt-2 text-[11px] text-indigo-300">{c.meta}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
