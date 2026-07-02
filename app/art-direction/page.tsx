import ProjectGrid from "@/components/project-grid";
import { projects } from "@/lib/projects";

export default function ArtDirectionPage() {
  return <ProjectGrid items={projects} />;
}
