"use client";

import { useState } from "react";

export type MotionItem = {
  title: string;
  client: string;
  video: string;
  poster: string;
};

const textClass = "font-mono text-[9px] font-bold tracking-normal uppercase leading-none";

function MotionRow({
  group,
  cols,
  gap,
  onOpen,
}: {
  group: MotionItem[];
  cols: string;
  gap: string;
  onOpen: (item: MotionItem) => void;
}) {
  return (
    <div className={`grid ${cols} ${gap}`}>
      {group.map((item) => (
        <button
          key={`vid-${item.video}`}
          type="button"
          onClick={() => onOpen(item)}
          aria-label={`Play ${item.title} for ${item.client}`}
          className="group row-start-1 self-end block w-full cursor-pointer"
        >
          <video
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
            className="w-full h-auto transition-opacity duration-500 group-hover:opacity-80"
          />
        </button>
      ))}
      {group.map((item) => (
        <div key={`text-${item.video}`} className="row-start-2 pt-2 flex flex-col">
          <span className={`${textClass} text-foreground`}>{item.title}</span>
          <span className={`${textClass} text-foreground/40`}>{item.client}</span>
        </div>
      ))}
    </div>
  );
}

export default function MotionGrid({ items }: { items: MotionItem[] }) {
  const [active, setActive] = useState<MotionItem | null>(null);

  const mobileRows = [items.slice(0, 2), items.slice(2, 4), items.slice(4)].filter((g) => g.length > 0);
  const desktopRows = [items.slice(0, 4), items.slice(4)].filter((g) => g.length > 0);

  return (
    <main className="min-h-[100dvh] bg-background px-6 md:px-10 lg:px-16 pt-28 pb-16">

      <div className="flex flex-col gap-8 md:hidden">
        {mobileRows.map((group, gi) => (
          <MotionRow key={gi} group={group} cols="grid-cols-2" gap="gap-x-4" onOpen={setActive} />
        ))}
      </div>

      <div className="hidden md:flex flex-col gap-12">
        {desktopRows.map((group, gi) => (
          <MotionRow key={gi} group={group} cols="grid-cols-4" gap="gap-x-6" onOpen={setActive} />
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} for ${active.client}`}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 px-6 py-16 md:px-10 lg:px-16"
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="fixed top-5 right-6 md:right-10 lg:right-16 z-10 font-mono text-[9px] font-bold tracking-normal uppercase text-white hover:text-accent transition-colors"
          >
            Close
          </button>
          <video
            key={active.video}
            src={active.video}
            poster={active.poster}
            autoPlay
            loop
            controls
            playsInline
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full w-auto h-auto object-contain"
          />
        </div>
      )}

    </main>
  );
}
