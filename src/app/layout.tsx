import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "YT Agent Studio — 11 Skills & Deterministic Tools for YouTube Creators",
  description: "Point-and-click studio turning Jakeschincariol/youtube-agent-skill into an ergonomic web app. Script, Package, Edit, Comment, Plan, Viral, Retention, Shorts, SEO, Chapters, Audit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
