"use client";

import Image from "next/image";
import Link from "next/link";
import { useMenu } from "@/components/menu-context";
import { useMountEffect } from "@/hooks/useMountEffect";
import { type Project } from "@/lib/projects";

export default function HomeClient({ heroVideo, featured }: { heroVideo: string; featured: Project[] }) {
  const { menuOpen, preloaderDone, setHeroActive } = useMenu();

  useMountEffect(() => {
    setHeroActive(true);
    return () => setHeroActive(false);
  });

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setHeroActive(index === 0);
  };

  return (
    <main
      id="main-content"
      onScroll={handleScroll}
      className={`h-[100dvh] snap-y snap-mandatory overflow-y-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? "md:translate-y-0 translate-y-[50vh]" : "translate-y-0"
        }`}
    >
      <h1 className="sr-only">Anders Sølvsten Thomsen — Fashion Stylist &amp; Art Director</h1>
      <section className="relative h-[100dvh] snap-start overflow-hidden bg-black">
        <video
          key={preloaderDone ? "hero-ready" : "hero-idle"}
          src={heroVideo}
          autoPlay={preloaderDone}
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Hero campaign film"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center justify-end px-6 md:px-10 lg:px-16">
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-white text-2xl md:text-3xl font-bold tracking-normal uppercase">Anders Sølvsten Thomsen</span>
            <span className="text-white/60 text-[9px] font-bold tracking-normal uppercase" style={{ fontFamily: "var(--font-pt-mono)" }}>Fashion Stylist &amp; Art Director</span>
            <span className="text-white/60 text-[9px] font-bold tracking-normal uppercase" style={{ fontFamily: "var(--font-pt-mono)" }}>London, UK</span>
          </div>
        </div>
      </section>

      {featured.map((project, i) => (
        <section
          key={project.id}
          className="relative h-[100dvh] snap-start flex flex-col pt-16 pb-6 gap-6"
        >
          <div
            className="relative flex-1 w-full overflow-hidden flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              opacity: preloaderDone ? 1 : 0,
              transform: preloaderDone ? "translateY(0) scale(1)" : "translateY(30px) scale(0.98)",
              transitionDelay: i === 0 ? "200ms" : "0ms",
            }}
          >
            <div className="absolute inset-y-0 inset-x-6 md:inset-x-0">
              <Image
                src={project.hero}
                alt={project.title}
                fill
                className="object-contain object-center"
                priority={i === 0}
                unoptimized
              />
            </div>
          </div>

          <div
            className="flex shrink-0 w-full items-end justify-between pb-8 px-6 md:px-10 lg:px-16 transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              opacity: preloaderDone ? 1 : 0,
              transform: preloaderDone ? "translateY(0)" : "translateY(20px)",
              transitionDelay: i === 0 ? "400ms" : "0ms",
            }}
          >
            <h2 className="font-mono text-[9px] font-bold tracking-normal uppercase text-foreground">
              {project.title} — {project.client}
            </h2>
            <Link
              href={`/projects/${project.id}`}
              aria-label={`View ${project.title}`}
              className="font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40 transition-colors hover:text-accent"
            >
              View
            </Link>
          </div>
        </section>
      ))}
    </main>
  );
}
