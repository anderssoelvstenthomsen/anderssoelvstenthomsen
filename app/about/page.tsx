import type { Metadata } from "next";
import AboutClient from "@/components/about-client";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Anders Sølvsten Thomsen — Danish-born, European-based fashion stylist and art director. Selected clients, editorial and art direction.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutClient settings={settings} />;
}
