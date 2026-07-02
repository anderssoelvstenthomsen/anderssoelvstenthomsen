import { client, dataset, projectId, sanityEnabled } from "./sanity/client";
import { urlFor } from "./sanity/image";
import { type Project } from "./projects";
import { type MotionItem } from "./motion";

const CATEGORY_LABEL: Record<string, string> = {
  clients: "Clients",
  editorial: "Editorial",
  "art-direction": "Art Direction",
};

function dateToNumber(d?: string): number {
  if (!d) return -1;
  const [y, m] = d.split("-").map(Number);
  return y + (m ? m / 12 : 0);
}

type SanityImage = { asset?: { _ref?: string } };
type ProjectRow = {
  id: string;
  title: string;
  client?: string;
  category: Project["category"];
  date?: string;
  cover?: SanityImage;
  images?: SanityImage[];
};

function fileUrlFromRef(ref: string): string {
  const [, id, ext] = ref.split("-");
  return id && ext ? `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}` : "";
}

function itemUrl(item?: SanityImage, width = 2400): string {
  const ref = item?.asset?._ref;
  if (!ref) return "";
  if (ref.startsWith("file-")) return fileUrlFromRef(ref);
  return urlFor(item, width);
}

function mapProject(r: ProjectRow): Project {
  const images = (r.images ?? []).map((im) => itemUrl(im)).filter(Boolean);
  const firstImage = (r.images ?? []).find((im) => im?.asset?._ref?.startsWith("image-"));
  return {
    id: r.id,
    title: r.title,
    client: r.client || CATEGORY_LABEL[r.category] || "",
    category: r.category,
    date: dateToNumber(r.date),
    hero: (r.cover ? urlFor(r.cover, 2000) : "") || itemUrl(firstImage, 2000) || images[0] || "",
    images,
  };
}

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)]| order(orderRank){
  "id": slug.current, title, client, category, date, cover, images
}`;

export async function getProjects(): Promise<Project[]> {
  if (!sanityEnabled || !client) return [];
  try {
    const rows = await client.fetch<ProjectRow[]>(PROJECTS_QUERY);
    return rows.map(mapProject);
  } catch {
    return [];
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function getMotionItems(): Promise<MotionItem[]> {
  if (!sanityEnabled || !client) return [];
  try {
    const rows = await client.fetch<{ title: string; video?: string; poster?: SanityImage }[]>(
      `*[_type == "motionItem" && defined(video.asset)]| order(orderRank){ title, "video": video.asset->url, poster }`,
    );
    return rows.map((r) => ({
      title: r.title,
      client: "Motion",
      video: r.video ?? "",
      poster: urlFor(r.poster, 1080),
    }));
  } catch {
    return [];
  }
}

export async function getHeroVideo(): Promise<string> {
  if (!sanityEnabled || !client) return "";
  try {
    const url = await client.fetch<string | null>(
      `coalesce(
        *[_id == "siteSettings"][0].heroVideo.asset->url,
        *[_type == "motionItem" && defined(video.asset)] | order(orderRank)[0].video.asset->url
      )`,
    );
    return url || "";
  } catch {
    return "";
  }
}

export async function getFeatured(count: number): Promise<Project[]> {
  const projects = await getProjects();
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const p of projects) {
    if (seen.has(p.title)) continue;
    seen.add(p.title);
    out.push(p);
    if (out.length === count) break;
  }
  return out;
}
