import type { Metadata } from "next";
import MotionGrid from "@/components/motion-grid";
import { getMotionItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Motion",
  description:
    "Motion and film work by Anders Sølvsten Thomsen — campaign films and moving image for fashion brands and publications.",
  alternates: { canonical: "/motion" },
};

export default async function MotionPage() {
  const items = await getMotionItems();
  return <MotionGrid heading="Motion — Anders Sølvsten Thomsen" items={items} />;
}
