import { notFound } from "next/navigation";
import { projects, getProjectById } from "@/lib/projects";
import ProjectGallery from "./project-gallery";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectGallery project={project} />;
}
