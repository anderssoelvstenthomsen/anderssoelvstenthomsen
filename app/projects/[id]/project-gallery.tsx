"use client";

import { useState } from "react";
import Image from "next/image";
import { Project } from "@/lib/projects";

function isVideo(src: string) {
  return /\.(webm|mp4|mov)$/i.test(src);
}

export default function ProjectGallery({ project }: { project: Project }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);

  const totalImages = project.images.length;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (overviewOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = rect.width / 2;

    if (x < half) {
      setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
    setOverviewOpen(false);
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-background relative">

      <div
        className={`absolute inset-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${overviewOpen ? "-translate-y-[45vh]" : "translate-y-0"
          }`}
      >
        <div
          className={`flex-1 relative cursor-pointer overflow-hidden transition-opacity duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${overviewOpen ? "opacity-30" : "opacity-100"
            }`}
          onClick={handleClick}
        >
          {project.images.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center px-6 md:px-0 pt-28 pb-8 transition-opacity duration-500 ${i === currentImage ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              <div className="relative w-full h-full">
                {isVideo(img) ? (
                  <video
                    src={img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                ) : (
                  <Image
                    src={img}
                    alt={`${project.title} ${i + 1}`}
                    fill
                    className="object-contain object-center"
                    priority={i === 0}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-20 flex items-end justify-between px-6 md:px-10 lg:px-16 pb-6 pt-4 shrink-0 bg-background">
          <div className="flex flex-col items-start gap-1">
            <span className="font-mono text-[9px] font-bold tracking-normal uppercase text-foreground">
              {project.title} for {project.client}
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => setOverviewOpen(false)}
                className={`font-mono text-[9px] font-bold tracking-normal uppercase transition-all hover:text-accent ${!overviewOpen ? "text-foreground" : "text-foreground/40"
                  }`}
              >
                GALLERY
              </button>
              <button
                onClick={() => setOverviewOpen(true)}
                className={`font-mono text-[9px] font-bold tracking-normal uppercase transition-all hover:text-accent ${overviewOpen ? "text-foreground" : "text-foreground/40"
                  }`}
              >
                OVERVIEW
              </button>
            </div>
          </div>

          <span className="font-mono text-[9px] font-bold tracking-normal text-foreground/40">
            {currentImage + 1} / {totalImages}
          </span>
        </div>
      </div>
      <div
        className={`absolute top-[100dvh] inset-x-0 h-[45vh] bg-background transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] overflow-y-auto ${overviewOpen ? "-translate-y-full" : "translate-y-0"
          }`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-6 md:px-10 lg:px-16 pb-10 pt-2">
          {project.images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                handleThumbnailClick(i);
              }}
              className="relative aspect-[3/4] overflow-hidden"
            >
              {isVideo(img) ? (
                <video
                  src={img}
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={img}
                  alt={`${project.title} thumbnail ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
