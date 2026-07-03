import ContactClient from "@/components/contact-client";
import { getSiteSettings } from "@/lib/content";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return <ContactClient settings={settings} />;
}
