import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import {
  buildPageMetadata,
  buildWebApplicationSchema,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Creator Tools: Script, Title, Edit & Audit | YT Agent Studio",
  description: "Free local-first web app with 11 deterministic tools and AI skills for YouTube creators. Score hooks, lint titles, trim dead air, and diagnose retention graphs.",
  path: "",
});

export default function HomePage() {
  const webAppSchema = buildWebApplicationSchema({
    path: "/",
    name: "YT Agent Studio — 11 Creator Tools & AI Skills",
    description: "Free local-first studio for YouTube creators featuring deterministic scoring, dead-air trimming, title character linting, and retention graph diagnostics.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <DashboardClient />
    </>
  );
}
