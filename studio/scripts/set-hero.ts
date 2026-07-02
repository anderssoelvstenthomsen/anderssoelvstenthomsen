import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

async function run() {
  const ref = await client.fetch<string | null>(`*[_id == "motion-boss"][0].video.asset._ref`);
  if (!ref) {
    console.log("No motion-boss video found — skipping.");
    return;
  }
  await client
    .patch("siteSettings")
    .set({ heroVideo: { _type: "file", asset: { _type: "reference", _ref: ref } } })
    .commit();
  console.log("✓ homepage hero set to the BOSS clip");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
