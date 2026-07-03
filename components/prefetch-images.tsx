"use client";

import { useMountEffect } from "@/hooks/useMountEffect";

export default function PrefetchImages({ urls }: { urls: string[] }) {
  useMountEffect(() => {
    const load = () => {
      for (const url of urls) {
        if (!url) continue;
        const img = document.createElement("img");
        img.src = url;
      }
    };
    const w = window as typeof window & { requestIdleCallback?: (cb: () => void) => number };
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(load);
    } else {
      setTimeout(load, 300);
    }
  });
  return null;
}
