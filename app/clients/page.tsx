import ProjectGrid from "@/components/project-grid";
import { getProjects } from "@/lib/content";

export default async function ClientsPage() {
  const projects = await getProjects();
  return <ProjectGrid items={projects.filter((p) => p.category === "clients")} />;
}
