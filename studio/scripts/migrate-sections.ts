import fs from "fs";
import path from "path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const ASSETS = path.join(__dirname, "..", "..", "public", "assets");
const IMG_EXT = [".webp", ".jpg", ".jpeg", ".png"];
const VID_EXT = [".mp4", ".webm", ".mov"];
const CATEGORIES = ["clients", "editorial", "art-direction"];

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

const key = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function sectionSlug(file: string, brandDir: string): string {
  const parts = path.relative(brandDir, file).split(path.sep);
  return parts.length > 1 ? parts[0] : "";
}

function sectionTitle(slug: string): string {
  return slug ? slug.replace(/-/g, " ").toUpperCase() : "";
}

type Item = { _key: string; _type: string; asset: { _ref: string; _type: string } };
type Section = { _key: string; _type: "section"; title?: string; images: Item[] };

async function run() {
  for (const category of CATEGORIES) {
    const catDir = path.join(ASSETS, category);
    if (!fs.existsSync(catDir)) continue;
    for (const brand of fs.readdirSync(catDir).sort()) {
      const brandDir = path.join(catDir, brand);
      if (!fs.statSync(brandDir).isDirectory()) continue;

      const docId = `project-${category}-${brand}`;
      const row = await client.fetch<{ items: Item[] } | null>(
        `*[_id == $id][0]{ "items": coalesce(images[]{ _key, _type, asset }, sections[].images[]{ _key, _type, asset }) }`,
        { id: docId },
      );
      const existing = row?.items;
      if (!existing || existing.length === 0) {
        console.log(`· skip ${docId} (no media)`);
        continue;
      }

      const ordered = walk(brandDir, [...IMG_EXT, ...VID_EXT]).sort((a, b) => recency(b) - recency(a));

      let sections: Section[];
      if (ordered.length !== existing.length) {
        sections = [{ _key: key(), _type: "section", images: existing }];
        console.log(`↻ ${docId} — count mismatch (${existing.length}≠${ordered.length}), one untitled section`);
      } else {
        const orderSlugs: string[] = [];
        const bySlug = new Map<string, Item[]>();
        ordered.forEach((file, i) => {
          const slug = sectionSlug(file, brandDir);
          if (!bySlug.has(slug)) {
            bySlug.set(slug, []);
            orderSlugs.push(slug);
          }
          bySlug.get(slug)!.push(existing[i]);
        });
        sections = orderSlugs.map((slug) => ({
          _key: key(),
          _type: "section",
          title: sectionTitle(slug) || undefined,
          images: bySlug.get(slug)!,
        }));
        console.log(`✎ ${docId} — ${sections.length} section(s): ${sections.map((s) => s.title || "—").join(", ")}`);
      }

      await client.patch(docId).set({ sections }).unset(["images"]).commit();
    }
  }
  console.log("✓ sections migrated");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
