import type { Metadata } from "next";
import ProjectGrid from "@/components/project-grid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Editorial",
  description:
    "Editorial fashion styling by Anders Sølvsten Thomsen — magazine and publication work across leading titles.",
  alternates: { canonical: "/editorial" },
};

export default async function EditorialPage() {
  const projects = await getProjects();
  return (
    <ProjectGrid
      heading="Editorial — Anders Sølvsten Thomsen"
      items={projects.filter((p) => p.category === "editorial")}
    />
  );
}
