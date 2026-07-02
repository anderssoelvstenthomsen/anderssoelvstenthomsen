import Image from "next/image";
import Link from "next/link";
import { projects as allProjects, type Project } from "@/lib/projects";

function getLookbookImage(project: Project): string {
  if (/\.(webm|mp4|mov)$/i.test(project.hero)) {
    return project.images.find((img) => !/\.(webm|mp4|mov)$/i.test(img)) ?? project.hero;
  }
  return project.hero;
}

const textClass = "font-mono text-[9px] font-bold tracking-normal uppercase leading-none";

function ProjectRow({ group, cols, sizes, gap }: { group: Project[]; cols: string; sizes: string; gap: string }) {
  return (
    <div className={`grid ${cols} ${gap}`}>
      {group.map((project) => (
        <Link key={`img-${project.id}`} href={`/projects/${project.id}`} className="group row-start-1 self-end">
          <Image
            src={getLookbookImage(project)}
            alt={project.title}
            width={0}
            height={0}
            sizes={sizes}
            className="w-full h-auto transition-opacity duration-500 group-hover:opacity-80"
          />
        </Link>
      ))}
      {group.map((project) => (
        <div key={`text-${project.id}`} className="row-start-2 pt-2 flex flex-col">
          <span className={`${textClass} text-foreground`}>{project.title}</span>
          <span className={`${textClass} text-foreground/40`}>{project.client}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectGrid({ items = allProjects }: { items?: Project[] }) {
  const mobileRows = [items.slice(0, 2), items.slice(2, 4), items.slice(4)].filter((g) => g.length > 0);
  const desktopRows = [items.slice(0, 4), items.slice(4)].filter((g) => g.length > 0);

  return (
    <main className="min-h-[100dvh] bg-background px-6 md:px-10 lg:px-16 pt-28 pb-16">

      <div className="flex flex-col gap-8 md:hidden">
        {mobileRows.map((group, gi) => (
          <ProjectRow key={gi} group={group} cols="grid-cols-2" sizes="50vw" gap="gap-x-4" />
        ))}
      </div>

      <div className="hidden md:flex flex-col gap-12">
        {desktopRows.map((group, gi) => (
          <ProjectRow key={gi} group={group} cols="grid-cols-4" sizes="25vw" gap="gap-x-6" />
        ))}
      </div>

    </main>
  );
}
