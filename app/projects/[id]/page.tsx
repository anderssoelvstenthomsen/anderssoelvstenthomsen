import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/content";
import ProjectGallery from "./project-gallery";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectGallery project={project} />;
}
