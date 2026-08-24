import type { MetadataRoute } from "next";

const BASE = "https://sketch3d.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/studio", priority: 0.95 },
    { path: "/features", priority: 0.9 },
    { path: "/how-it-works", priority: 0.85 },
    { path: "/gallery", priority: 0.8 },
    { path: "/pricing", priority: 0.85 },
    { path: "/docs", priority: 0.8 },
    { path: "/download", priority: 0.75 },
    { path: "/faq", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/changelog", priority: 0.5 },
  ];

  const now = new Date();
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
}
