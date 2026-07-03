import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

const aboutBio =
  "Anders Sølvsten Thomsen is a Danish-born, European-based stylist and art director. He regularly contributes to leading publications and collaborates with some of the industry’s most recognised brands.\n\nAs a consulting stylist, Anders works across concept, design development and art direction. In addition to fashion, Anders curates and consults for various furniture and interior brands.";

async function run() {
  await client.patch("siteSettings").set({ aboutBio, repAgency: "LALALAND" }).commit();
  console.log("✓ about bio (with paragraph break) + agency updated");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
