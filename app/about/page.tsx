import AboutClient from "@/components/about-client";
import { getSiteSettings } from "@/lib/content";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutClient settings={settings} />;
}
