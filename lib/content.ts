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
  sections?: { title?: string; images?: SanityImage[] }[];
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
  const items = r.images ?? (r.sections ?? []).flatMap((s) => s.images ?? []);
  const images = items.map((im) => itemUrl(im, 1800)).filter(Boolean);
  const firstImageItem = items.find((im) => im?.asset?._ref?.startsWith("image-"));
  const coverSource = r.cover ?? firstImageItem;
  const label = CATEGORY_LABEL[r.category] || "";

  return {
    id: r.id,
    title: r.title,
    client: r.client || label,
    subtitle: r.client && r.client !== label ? r.client : "",
    category: r.category,
    date: dateToNumber(r.date),
    hero: (coverSource ? itemUrl(coverSource, 2000) : "") || images[0] || "",
    thumb: (coverSource ? itemUrl(coverSource, 800) : "") || images[0] || "",
    images,
  };
}

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)]| order(orderRank){
  "id": slug.current, title, client, category, date, cover,
  images, sections[]{ title, images }
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
      poster: urlFor(r.poster, 900),
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

export interface SiteSettings {
  aboutBio: string;
  clientsList: string[];
  artDirectionList: string[];
  editorialList: string[];
  contactHeadline: string;
  repAgency: string;
  repName: string;
  repTitle: string;
  repEmail: string;
  repOffice: string;
  repCell: string;
  instagram: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  aboutBio:
    "Anders Sølvsten Thomsen is a Danish-born, European-based stylist and art director. He regularly contributes to leading publications and collaborates with some of the industry’s most recognised brands.\n\nAs a consulting stylist, Anders works across concept, design development and art direction. In addition to fashion, Anders curates and consults for various furniture and interior brands.",
  clientsList: [
    "ADIDAS", "AWAY", "BURBERRY", "CANADA GOOSE", "CHARLES JEFFREY LOVERBOY", "EVERLANE", "FARFETCH",
    "GUCCI", "HUGO BOSS", "LOEWE", "LOUIS VUITTON", "MARC JACOBS", "MONTBLANC", "NIKE", "NINA RICCI", "ZARA",
  ],
  artDirectionList: [
    "FENG CHEN WANG", "DESMOND AND DEMPSEY", "BARBOUR", "CONVERSE", "CROCS", "ILAI SARAI", "LEE",
    "LEVIS RED", "MØBEL COPENHAGEN", "PANGAIA", "SAUCONY", "UGG",
  ],
  editorialList: [
    "CR FASHION BOOK", "DOCUMENT JOURNAL", "DISPLAY COPY", "DUST", "FAMILY STYLE", "ICON AMERICA",
    "INTERVIEW", "LOVE", "MODERN MATTER", "OFFICE", "RE-EDITION", "REPLICA MAN", "THE CUT", "VOGUE",
  ],
  contactHeadline: "For styling, creative direction, collaborations, and all general inquiries.",
  repAgency: "LALALAND",
  repName: "Murray Arthur",
  repTitle: "Senior Agent",
  repEmail: "murray@lalaland-group.com",
  repOffice: "+44 (0) 203 701 7655",
  repCell: "+44 (0) 794 133 1206",
  instagram: "https://www.instagram.com/anderssoelvstenthomsen/",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!sanityEnabled || !client) return DEFAULT_SETTINGS;
  try {
    const s = await client.fetch<Partial<SiteSettings> | null>(
      `*[_id == "siteSettings"][0]{
        aboutBio, clientsList, artDirectionList, editorialList,
        contactHeadline, repAgency, repName, repTitle, repEmail, repOffice, repCell, instagram
      }`,
    );
    if (!s) return DEFAULT_SETTINGS;
    const present = Object.fromEntries(
      Object.entries(s).filter(([, v]) => v != null && (!Array.isArray(v) || v.length > 0)),
    );
    return { ...DEFAULT_SETTINGS, ...present };
  } catch {
    return DEFAULT_SETTINGS;
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
