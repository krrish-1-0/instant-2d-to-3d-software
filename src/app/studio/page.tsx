import type { Metadata } from "next";
import StudioLoader from "../studio-loader";

export const metadata: Metadata = {
  title: "Studio — Sketch3D",
  description: "The full 3D editor: instant 2D→3D conversion, modeling, materials, lighting and export.",
};

export default function StudioPage() {
  return <StudioLoader />;
}
