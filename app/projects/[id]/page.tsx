import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/content";
import ProjectGallery from "./project-gallery";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return {};

  const title = `${project.title} — ${project.client}`;
  const description = `${project.title} for ${project.client}. ${project.client} work by fashion stylist and art director Anders Sølvsten Thomsen.`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${id}` },
    openGraph: {
      title,
      description,
      url: `/projects/${id}`,
      images: project.hero ? [{ url: project.hero }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.hero ? [project.hero] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return <ProjectGallery project={project} />;
}
