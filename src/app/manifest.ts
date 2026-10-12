import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YT Agent Studio — Creator Tools",
    short_name: "YT Agent Studio",
    description: "11 deterministic tools and AI skills for YouTube creators to write, package, edit, and audit videos.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0d0e",
    theme_color: "#0c0d0e",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
