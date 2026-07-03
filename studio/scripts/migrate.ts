import fs from "fs";
import path from "path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const ASSETS = path.join(__dirname, "..", "..", "public", "assets");
const IMG_EXT = [".webp", ".jpg", ".jpeg", ".png"];
const VID_EXT = [".mp4", ".webm", ".mov"];
const CATS: Record<string, string> = {
  clients: "Clients",
  editorial: "Editorial",
  "art-direction": "Art Direction",
};

const SEASON: Record<string, number> = {
  SS: 0.25, SPRING: 0.25, SUMMER: 0.5, AW: 0.75, FW: 0.75, FA: 0.75, AUTUMN: 0.75, WINTER: 0.9,
};

function recency(text: string): number {
  const t = text.toUpperCase();
  const ys: number[] = [];
  for (const m of t.matchAll(/\b(SS|AW|FW|FA)\s*[-_]?\s*(\d{2})\b/g)) {
    const yy = +m[2];
    if (yy >= 15 && yy <= 30) ys.push(2000 + yy + SEASON[m[1]]);
  }
  for (const m of t.matchAll(/\b(SPRING|SUMMER|AUTUMN|WINTER)\s*[-_]?\s*(\d{2})\b/g)) {
    const yy = +m[2];
    if (yy >= 15 && yy <= 30) ys.push(2000 + yy + SEASON[m[1]]);
  }
  for (const m of t.matchAll(/\b(20\d{2})[-_](\d{2})[-_](\d{2})\b/g)) {
    ys.push(+m[1] + (+m[2] >= 1 && +m[2] <= 12 ? +m[2] / 12 : 0));
  }
  for (const m of t.matchAll(/\b(\d{2})(\d{2})(\d{2})\b/g)) {
    const [yy, mo, dd] = [+m[1], +m[2], +m[3]];
    if (yy >= 18 && yy <= 27 && mo >= 1 && mo <= 12 && dd >= 1 && dd <= 31) ys.push(2000 + yy + mo / 12);
  }
  for (const m of t.matchAll(/\b(20[0-2]\d)\b/g)) ys.push(+m[1]);
  return ys.length ? Math.max(...ys) : 0;
}

function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (exts.includes(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

function humanize(slug: string): string {
  return slug.split("-").map((w) => (w === "x" ? "×" : w === "and" ? "&" : w[0].toUpperCase() + w.slice(1))).join(" ");
}

const uniqueKey = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function sectionSlug(file: string, brandDir: string): string {
  const parts = path.relative(brandDir, file).split(path.sep);
  return parts.length > 1 ? parts[0] : "";
}

function sectionTitle(slug: string): string {
  return slug ? slug.replace(/-/g, " ").toUpperCase() : "";
}

function isoDate(score: number): string | undefined {
  if (!score) return undefined;
  const year = Math.floor(score);
  const month = Math.min(12, Math.max(1, Math.round((score - year) * 12) || 1));
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

async function uploadImage(file: string) {
  const asset = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(file) });
  return { _type: "image", _key: Math.random().toString(36).slice(2), asset: { _type: "reference", _ref: asset._id } };
}

async function uploadVideo(file: string) {
  const asset = await client.assets.upload("file", fs.createReadStream(file), {
    filename: path.basename(file),
    contentType: "video/mp4",
  });
  return { _type: "file", _key: uniqueKey(), asset: { _type: "reference", _ref: asset._id } };
}

type MediaItem = { _type: string; _key: string; asset: { _type: string; _ref: string } };

export async function migrateMotion() {
  const motionDir = path.join(ASSETS, "motion");
  const posterDir = path.join(ASSETS, "motion-posters");
  for (const brand of fs.readdirSync(motionDir).sort()) {
    const brandDir = path.join(motionDir, brand);
    if (!fs.statSync(brandDir).isDirectory()) continue;
    const vids = walk(brandDir, VID_EXT).sort();
    for (let i = 0; i < vids.length; i++) {
      const slug = vids.length > 1 ? `${brand}-${i + 1}` : brand;
      const poster = path.join(posterDir, `${slug}.jpg`);
      console.log(`↑ motion/${slug}`);
      await client.createOrReplace({
        _id: `motion-${slug}`,
        _type: "motionItem",
        title: humanize(brand),
        date: isoDate(recency(vids[i])),
        video: await uploadVideo(vids[i]),
        ...(fs.existsSync(poster) ? { poster: await uploadImage(poster) } : {}),
      });
    }
  }
}

async function migrate() {
  for (const category of Object.keys(CATS)) {
    const catDir = path.join(ASSETS, category);
    if (!fs.existsSync(catDir)) continue;
    for (const brand of fs.readdirSync(catDir).sort()) {
      const brandDir = path.join(catDir, brand);
      if (!fs.statSync(brandDir).isDirectory()) continue;
      const files = walk(brandDir, [...IMG_EXT, ...VID_EXT]).sort((a, b) => recency(b) - recency(a));
      if (files.length === 0) continue;
      const score = Math.max(...files.map(recency), 0);
      console.log(`↑ ${category}/${brand} — ${files.length} items`);

      const orderSlugs: string[] = [];
      const bySlug = new Map<string, MediaItem[]>();
      let coverItem: MediaItem | null = null;
      for (const f of files) {
        const slug = sectionSlug(f, brandDir);
        if (!bySlug.has(slug)) {
          bySlug.set(slug, []);
          orderSlugs.push(slug);
        }
        const item = VID_EXT.includes(path.extname(f).toLowerCase()) ? await uploadVideo(f) : await uploadImage(f);
        bySlug.get(slug)!.push(item);
        if (!coverItem && item._type === "image") coverItem = item;
      }
      const sections = orderSlugs.map((slug) => ({
        _key: uniqueKey(),
        _type: "section" as const,
        title: sectionTitle(slug) || undefined,
        images: bySlug.get(slug)!,
      }));

      await client.createOrReplace({
        _id: `project-${category}-${brand}`,
        _type: "project",
        title: humanize(brand),
        slug: { _type: "slug", current: `${category}-${brand}` },
        category,
        client: CATS[category],
        date: isoDate(score),
        cover: coverItem ? { _type: "image", asset: coverItem.asset } : undefined,
        sections,
      });
    }
  }

  await migrateMotion();

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    aboutBio:
      "Anders Sølvsten Thomsen is a Danish-born, European-based stylist and art director. He regularly contributes to leading publications and collaborates with some of the industry's most recognised brands. As a consulting stylist, Anders works across concept, design development and art direction. In addition to fashion, Anders curates and consults for various furniture and interior brands.",
    clientsList: ["ADIDAS", "AWAY", "BURBERRY", "CANADA GOOSE", "CHARLES JEFFREY LOVERBOY", "EVERLANE", "FARFETCH", "GUCCI", "HUGO BOSS", "LOEWE", "LOUIS VUITTON", "MARC JACOBS", "MONTBLANC", "NIKE", "NINA RICCI", "ZARA"],
    artDirectionList: ["FENG CHEN WANG", "DESMOND AND DEMPSEY", "BARBOUR", "CONVERSE", "CROCS", "ILAI SARAI", "LEE", "LEVIS RED", "MØBEL COPENHAGEN", "PANGAIA", "SAUCONY", "UGG"],
    editorialList: ["CR FASHION BOOK", "DOCUMENT JOURNAL", "DISPLAY COPY", "DUST", "FAMILY STYLE", "ICON AMERICA", "INTERVIEW", "LOVE", "MODERN MATTER", "OFFICE", "RE-EDITION", "REPLICA MAN", "THE CUT", "VOGUE"],
    contactHeadline: "For styling, creative direction, collaborations, and all general inquiries.",
    repName: "Murray Arthur",
    repTitle: "Senior Agent",
    repEmail: "murray@lalaland-group.com",
    repOffice: "+44 (0) 203 701 7655",
    repCell: "+44 (0) 794 133 1206",
    instagram: "https://www.instagram.com/anderssoelvstenthomsen/",
  });

  console.log("✓ migration complete");
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
