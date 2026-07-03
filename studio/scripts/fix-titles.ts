import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const FIXES: [RegExp, string][] = [
  [/CMAPIAGN/g, "CAMPAIGN"],
  [/CAMPIAGN/g, "CAMPAIGN"],
];

type Section = { title?: string };

async function run() {
  const docs = await client.fetch<{ _id: string; sections: Section[] }[]>(
    `*[_type == "project" && count(sections[defined(title)]) > 0]{ _id, sections }`,
  );
  const tx = client.transaction();
  let changed = 0;
  for (const doc of docs) {
    let dirty = false;
    const sections = doc.sections.map((s) => {
      if (!s.title) return s;
      let title = s.title;
      for (const [re, rep] of FIXES) title = title.replace(re, rep);
      if (title !== s.title) {
        dirty = true;
        return { ...s, title };
      }
      return s;
    });
    if (dirty) {
      tx.patch(doc._id, (p) => p.set({ sections }));
      changed += 1;
    }
  }
  if (changed) await tx.commit();
  console.log(`✓ fixed section titles in ${changed} project(s)`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
