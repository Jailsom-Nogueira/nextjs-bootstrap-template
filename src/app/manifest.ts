import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js Bootstrap Template",
    short_name: "Template",
    description: "Next.js 16 + Supabase template",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
  };
}
