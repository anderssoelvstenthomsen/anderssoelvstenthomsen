import { defineType, defineField } from "sanity";
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
      title: "Subtitle",
      type: "string",
      description: "Shown under the title, e.g. a season (AW25) or collection. Defaults to the category if empty.",
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
      name: "images",
      title: "Gallery",
      type: "array",
      of: [
        { type: "image", options: { hotspot: true } },
        { type: "file", title: "Video", options: { accept: "video/*" } },
      ],
      components: { input: BatchImageInput },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", cover: "cover", first: "images.0" },
    prepare: ({ title, subtitle, cover, first }) => ({ title, subtitle, media: cover || first }),
  },
});
