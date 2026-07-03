import { defineType, defineField, defineArrayMember } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";
import { BatchImageInput } from "../components/BatchImageInput";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    orderRankField({ type: "project" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Clients", value: "clients" },
          { title: "Editorial", value: "editorial" },
          { title: "Art Direction", value: "art-direction" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "client",
      type: "string",
      description: "Subtitle shown under the title. Defaults to the category if empty.",
    }),
    defineField({
      name: "date",
      type: "date",
      description: "Used to order projects newest → oldest.",
    }),
    defineField({
      name: "cover",
      title: "Cover (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Grid/home cover. If empty, the first gallery image is used.",
    }),
    defineField({
      name: "sections",
      title: "Gallery",
      description: "Group media into sections (e.g. seasons or collections). Leave a section title empty for an unlabelled group.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          fields: [
            defineField({ name: "title", title: "Section title (e.g. AW25)", type: "string" }),
            defineField({
              name: "images",
              title: "Media",
              type: "array",
              of: [
                { type: "image", options: { hotspot: true } },
                { type: "file", title: "Video", options: { accept: "video/*" } },
              ],
              components: { input: BatchImageInput },
            }),
          ],
          preview: {
            select: { title: "title", media: "images.0", images: "images" },
            prepare: ({ title, media, images }) => ({
              title: title || "Untitled section",
              subtitle: `${images?.length ?? 0} items`,
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", cover: "cover", first: "sections.0.images.0" },
    prepare: ({ title, subtitle, cover, first }) => ({ title, subtitle, media: cover || first }),
  },
});
