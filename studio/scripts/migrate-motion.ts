import fs from "fs";
import path from "path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const ASSETS = path.join(__dirname, "..", "..", "public", "assets");
const VID_EXT = [".mp4", ".webm", ".mov"];

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

function humanize(slug: string): string {
  return slug.split("-").map((w) => (w === "x" ? "×" : w === "and" ? "&" : w[0].toUpperCase() + w.slice(1))).join(" ");
}

function isoDate(score: number): string | undefined {
  if (!score) return undefined;
  const year = Math.floor(score);
  const month = Math.min(12, Math.max(1, Math.round((score - year) * 12) || 1));
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function walkVideos(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkVideos(p));
    else if (VID_EXT.includes(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
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
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

async function run() {
  console.log("Removing existing Motion documents…");
  await client.delete({ query: '*[_type == "motionItem"]' });

  const motionDir = path.join(ASSETS, "motion");
  const posterDir = path.join(ASSETS, "motion-posters");
  for (const brand of fs.readdirSync(motionDir).sort()) {
    const brandDir = path.join(motionDir, brand);
    if (!fs.statSync(brandDir).isDirectory()) continue;
    const vids = walkVideos(brandDir).sort();
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
  console.log("✓ motion migration complete");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
