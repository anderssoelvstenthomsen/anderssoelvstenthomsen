import type { Metadata } from "next";
import ContactClient from "@/components/contact-client";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact and representation for Anders Sølvsten Thomsen — for styling, art direction, collaborations and general inquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactClient settings={settings} />;
}
