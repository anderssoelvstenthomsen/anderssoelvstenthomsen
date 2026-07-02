import ProjectGrid from "@/components/project-grid";
import { projects } from "@/lib/projects";

export default function ClientsPage() {
  return <ProjectGrid items={projects} />;
}
