import type { Metadata } from "next";
import ProjectGrid from "@/components/project-grid";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Client and brand work by Anders Sølvsten Thomsen — styling and consulting for the industry’s most recognised names.",
  alternates: { canonical: "/clients" },
};

export default async function ClientsPage() {
  const projects = await getProjects();
  return (
    <ProjectGrid
      heading="Clients — Anders Sølvsten Thomsen"
      items={projects.filter((p) => p.category === "clients")}
    />
  );
}
