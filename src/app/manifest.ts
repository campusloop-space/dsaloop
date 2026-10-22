import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DSALoop by https://campusloop.space/",
    short_name: "DSALoop",
    description:
      "DSALoop by https://campusloop.space/ — Minimal, pattern-first coding interview preparation with roadmaps, 185+ company tracks, and 28-chapter system design primer.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FFF8ED",
    theme_color: "#FFF8ED",
    categories: ["education", "developer", "productivity"],
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
