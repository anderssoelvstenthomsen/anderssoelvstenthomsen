import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

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
  return ys.length ? Math.max(...ys) : 0;
}

function isoDate(score: number): string | undefined {
  if (!score) return undefined;
  const year = Math.floor(score);
  const month = Math.min(12, Math.max(1, Math.round((score - year) * 12) || 1));
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

type Item = { _key: string; _type: string; asset: { _ref: string; _type: string } };
type Doc = {
  _id: string;
  title: string;
  client?: string;
  category: string;
  date?: string;
  slug: string;
  sections: { title?: string; images?: Item[] }[];
};

async function run() {
  const docs = await client.fetch<Doc[]>(
    `*[_type == "project" && defined(sections)]{
      _id, title, client, category, date, "slug": slug.current,
      sections[]{ title, images[]{ _key, _type, asset } }
    }`,
  );

  for (const doc of docs) {
    const sections = (doc.sections ?? []).filter((s) => (s.images ?? []).length > 0);

    if (sections.length === 1 && !sections[0].title) {
      await client.patch(doc._id).set({ images: sections[0].images }).unset(["sections"]).commit();
      console.log(`✎ ${doc._id} — flattened (single untitled section)`);
      continue;
    }

    for (const section of sections) {
      const sslug = slugify(section.title || "untitled");
      const newId = `${doc._id}-${sslug}`;
      const images = section.images ?? [];
      const coverItem = images.find((it) => it._type === "image");
      await client.createOrReplace({
        _id: newId,
        _type: "project",
        title: doc.title,
        slug: { _type: "slug", current: `${doc.slug}-${sslug}` },
        category: doc.category,
        client: section.title || doc.client,
        date: isoDate(recency(section.title ?? "")) ?? doc.date,
        cover: coverItem ? { _type: "image", asset: coverItem.asset } : undefined,
        images,
      });
      console.log(`＋ ${newId} — "${section.title || "untitled"}" (${images.length} items)`);
    }

    await client.delete(doc._id);
    console.log(`− deleted ${doc._id} (split into ${sections.length})`);
  }

  console.log("✓ split complete");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
