import type { Metadata } from "next";
import ProjectGrid from "@/components/project-grid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Art Direction",
  description:
    "Art direction by Anders Sølvsten Thomsen — campaigns, concept and design development for fashion and lifestyle brands.",
  alternates: { canonical: "/art-direction" },
};

export default async function ArtDirectionPage() {
  const projects = await getProjects();
  return (
    <ProjectGrid
      heading="Art Direction — Anders Sølvsten Thomsen"
      items={projects.filter((p) => p.category === "art-direction")}
    />
  );
}
