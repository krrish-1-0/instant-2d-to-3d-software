import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "emerald" | "amber" | "slate" }) {
  const tones = {
    indigo: "border-indigo-400/30 bg-indigo-500/10 text-indigo-200",
    emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
    slate: "border-white/15 bg-white/5 text-slate-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">{eyebrow}</p>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors hover:border-white/20 ${className}`}>
      {children}
    </div>
  );
}

export function FeatureCard({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <Card>
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 text-lg">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{children}</p>
    </Card>
  );
}

export function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20 hover:brightness-110"
      : "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
      <div className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)]" />
      <Container className="relative">
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">{subtitle}</p>
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
