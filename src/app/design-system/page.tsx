import type { Metadata } from "next";
import DesignSystemClient from "./DesignSystemClient";

export const metadata: Metadata = {
  title: "Design System & Color Tokens (Internal)",
  description: "Internal design system token and accessibility contrast specification.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
