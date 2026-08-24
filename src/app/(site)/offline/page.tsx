import type { Metadata } from "next";
import { Container, CtaButton } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline — the studio still works.",
};

export default function OfflinePage() {
  return (
    <Container className="grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <div className="text-5xl">📴</div>
        <h1 className="mt-6 text-3xl font-bold text-white">You&apos;re offline — and that&apos;s fine</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
          This page needs the network, but the studio does not. The conversion engine, viewport drawing, modeling tools and
          exporters all run locally on your device.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton href="/studio">Continue in the studio</CtaButton>
          <CtaButton href="/" variant="ghost">
            Retry home page
          </CtaButton>
        </div>
      </div>
    </Container>
  );
}
