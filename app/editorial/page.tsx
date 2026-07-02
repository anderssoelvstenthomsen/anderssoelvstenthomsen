import ProjectGrid from "@/components/project-grid";
import { projects } from "@/lib/projects";

export default function EditorialPage() {
  return <ProjectGrid items={projects} />;
}
