import Link from "next/link";
import { Container } from "./ui";
import { NewsletterForm } from "./NewsletterForm";

const GROUPS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/gallery", label: "Gallery" },
      { href: "/pricing", label: "Pricing" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs#shortcuts", label: "Keyboard shortcuts" },
      { href: "/docs#api", label: "REST API" },
      { href: "/faq", label: "FAQ" },
      { href: "/download", label: "Offline install" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/studio", label: "Launch studio" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0d13]">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500">🧊</span>
              Sketch3D Studio
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              A browser-native 3D modeling suite that converts sketches and photos into editable meshes instantly —
              no render queue, no GPU server, no waiting.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group.title}</h4>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Sketch3D Studio. Runs offline in your browser.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All systems operational
          </p>
        </div>
      </Container>
    </footer>
  );
}
