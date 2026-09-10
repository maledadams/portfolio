import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lucia Adams",
    short_name: "Lucia Adams",
    description: "I design websites and build the systems that make them work.",
    start_url: "/",
    display: "standalone",
    background_color: "#191919",
    theme_color: "#191919",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
