import { defineType, defineField } from "sanity";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "motionItem",
  title: "Motion",
  type: "document",
  fields: [
    orderRankField({ type: "motionItem" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/*" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Still shown before hover / while the video loads.",
    }),
    defineField({
      name: "date",
      type: "date",
      description: "Used to order motion newest → oldest.",
    }),
  ],
  preview: { select: { title: "title", media: "poster" } },
});
