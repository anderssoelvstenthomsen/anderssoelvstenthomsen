import Image from "next/image";
import Link from "next/link";
import { type Project } from "@/lib/projects";

function getLookbookImage(project: Project): string {
  if (/\.(webm|mp4|mov)$/i.test(project.hero)) {
    return project.images.find((img) => !/\.(webm|mp4|mov)$/i.test(img)) ?? project.hero;
  }
  return project.hero;
}

const textClass = "font-mono text-[9px] font-bold tracking-normal uppercase leading-none";

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

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
        </div>
      ))}
    </div>
  );
}

export default function ProjectGrid({ items }: { items: Project[] }) {
  const mobileRows = chunk(items, 2);
  const desktopRows = chunk(items, 4);

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
