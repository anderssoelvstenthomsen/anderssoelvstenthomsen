import { getCliClient } from "sanity/cli";
import { LexoRank } from "lexorank";

const client = getCliClient({ apiVersion: "2024-01-01" });

async function seed(type: string) {
  const docs = await client.fetch<{ _id: string }[]>(
    `*[_type == $type]| order(coalesce(date, "0000-01-01") desc, _createdAt asc){ _id }`,
    { type },
  );
  let rank = LexoRank.middle();
  const tx = client.transaction();
  for (const doc of docs) {
    tx.patch(doc._id, (p) => p.set({ orderRank: rank.toString() }));
    rank = rank.genNext();
  }
  await tx.commit();
  console.log(`✓ ordered ${docs.length} ${type} (newest → oldest)`);
}

async function run() {
  await seed("project");
  await seed("motionItem");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
