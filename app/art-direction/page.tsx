import ProjectGrid from "@/components/project-grid";
import { getProjects } from "@/lib/content";

export default async function ArtDirectionPage() {
  const projects = await getProjects();
  return <ProjectGrid items={projects.filter((p) => p.category === "art-direction")} />;
}
