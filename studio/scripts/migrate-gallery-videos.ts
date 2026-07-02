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

function isoDate(score: number): string | undefined {
  if (!score) return undefined;
  const year = Math.floor(score);
  const month = Math.min(12, Math.max(1, Math.round((score - year) * 12) || 1));
  return `${year}-${String(month).padStart(2, "0")}-01`;
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

const isVideo = (f: string) => VID_EXT.includes(path.extname(f).toLowerCase());
const key = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

async function uploadVideo(file: string) {
  const asset = await client.assets.upload("file", fs.createReadStream(file), {
    filename: path.basename(file),
    contentType: "video/mp4",
  });
  return { _type: "file", _key: key(), asset: { _type: "reference", _ref: asset._id } };
}

async function uploadImage(file: string) {
  const asset = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(file) });
  return { _type: "image", _key: key(), asset: { _type: "reference", _ref: asset._id } };
}

type Item = { _key: string; _type: string; asset: { _ref: string; _type: string } };

async function run() {
  for (const category of CATEGORIES) {
    const catDir = path.join(ASSETS, category);
    if (!fs.existsSync(catDir)) continue;
    for (const brand of fs.readdirSync(catDir).sort()) {
      const brandDir = path.join(catDir, brand);
      if (!fs.statSync(brandDir).isDirectory()) continue;

      const ordered = walk(brandDir, [...IMG_EXT, ...VID_EXT]).sort((a, b) => recency(b) - recency(a));
      if (!ordered.some(isVideo)) continue;

      const docId = `project-${category}-${brand}`;
      const existing = await client.fetch<Item[]>(`*[_id == $id][0].images[]{ _key, _type, asset }`, { id: docId });
      if (!existing) {
        console.log(`⚠ skip ${docId} — document not found`);
        continue;
      }

      const diskImages = ordered.filter((f) => !isVideo(f));
      let images: Item[];

      if (diskImages.length === existing.length) {
        images = [];
        let p = 0;
        for (const file of ordered) {
          if (isVideo(file)) images.push((await uploadVideo(file)) as Item);
          else images.push(existing[p++]);
        }
        console.log(`✎ ${docId} — inserted ${ordered.filter(isVideo).length} video(s), reused ${existing.length} images`);
      } else {
        console.log(`↻ ${docId} — image count mismatch (${existing.length}≠${diskImages.length}), rebuilding fully`);
        images = [];
        for (const file of ordered) images.push(((await (isVideo(file) ? uploadVideo(file) : uploadImage(file)))) as Item);
      }

      await client
        .patch(docId)
        .set({ images, date: isoDate(Math.max(...ordered.map(recency), 0)) })
        .commit();
    }
  }
  console.log("✓ gallery videos migrated");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
