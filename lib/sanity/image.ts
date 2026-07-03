import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = client ? createImageUrlBuilder(client) : null;

export function urlFor(source: unknown, width?: number): string {
  if (!builder || !source) return "";
  let img = builder.image(source as never).auto("format").fit("max");
  if (width) img = img.width(width);
  return img.url();
}
