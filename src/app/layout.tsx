import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ServiceWorkerRegister } from "@/components/site/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sketch3d.studio"),
  title: {
    default: "Sketch3D Studio — Turn 2D Sketches Into 3D Models Instantly",
    template: "%s · Sketch3D Studio",
  },
  description:
    "A professional browser-native 3D modeling suite that converts 2D sketches and photos into editable 3D models instantly — no render queue, no GPU server, fully offline capable.",
  keywords: [
    "2D to 3D",
    "sketch to 3D model",
    "image to 3D",
    "browser 3D editor",
    "offline 3D modeling",
    "three.js studio",
    "GLB OBJ STL export",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Sketch3D",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    title: "Sketch3D Studio — Instant 2D to 3D Modeling",
    description:
      "Convert sketches and photos into editable 3D meshes instantly, right in your browser. Works offline.",
    siteName: "Sketch3D Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sketch3D Studio — Instant 2D to 3D Modeling",
    description: "Convert sketches and photos into editable 3D meshes instantly. Works offline.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0d13] text-slate-100 antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
