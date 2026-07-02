import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "home", title: "Home" },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "heroVideo",
      title: "Homepage hero video",
      type: "file",
      options: { accept: "video/*" },
      group: "home",
    }),
    defineField({
      name: "featured",
      title: "Featured projects (optional)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      description: "Shown on the homepage. If empty, the most recent projects are used.",
      group: "home",
    }),
    defineField({ name: "aboutBio", title: "Bio", type: "text", rows: 6, group: "about" }),
    defineField({
      name: "clientsList",
      title: "Clients list",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({
      name: "artDirectionList",
      title: "Art Direction list",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({
      name: "editorialList",
      title: "Editorial list",
      type: "array",
      of: [{ type: "string" }],
      group: "about",
    }),
    defineField({ name: "contactHeadline", title: "Headline", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "repName", title: "Agent name", type: "string", group: "contact" }),
    defineField({ name: "repTitle", title: "Agent title", type: "string", group: "contact" }),
    defineField({ name: "repEmail", title: "Agent email", type: "string", group: "contact" }),
    defineField({ name: "repOffice", title: "Office phone", type: "string", group: "contact" }),
    defineField({ name: "repCell", title: "Cell phone", type: "string", group: "contact" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url", group: "contact" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
