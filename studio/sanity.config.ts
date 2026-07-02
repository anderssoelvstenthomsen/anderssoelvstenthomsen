import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./schemas";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID as string;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Anders Sølvsten Thomsen",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            orderableDocumentListDeskItem({
              type: "project",
              id: "projects-clients",
              title: "Clients",
              filter: 'category == "clients"',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: "project",
              id: "projects-editorial",
              title: "Editorial",
              filter: 'category == "editorial"',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: "project",
              id: "projects-art-direction",
              title: "Art Direction",
              filter: 'category == "art-direction"',
              S,
              context,
            }),
            S.divider(),
            orderableDocumentListDeskItem({
              type: "motionItem",
              id: "motion",
              title: "Motion",
              S,
              context,
            }),
          ]),
    }),
    media(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => t.schemaType !== "siteSettings"),
  },
});
