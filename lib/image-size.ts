export function withWidth(url: string, width: number): string {
  if (!url.includes("cdn.sanity.io/images")) return url;
  if (/[?&]w=\d+/.test(url)) return url.replace(/([?&])w=\d+/, `$1w=${width}`);
  return url + (url.includes("?") ? "&" : "?") + `w=${width}`;
}
