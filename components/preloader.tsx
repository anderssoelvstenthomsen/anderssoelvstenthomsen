"use client";

import { useState, useEffect } from "react";
import { useMenu } from "./menu-context";

export default function Preloader() {
  const { preloaderDone, setPreloaderDone } = useMenu();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (preloaderDone) return;

    const duration = 2400;
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setCount(Math.min(Math.round(eased * 100), 100));

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setPreloaderDone(true);
          }, 800);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [preloaderDone, setPreloaderDone]);

  if (preloaderDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-between px-6 md:px-10 lg:px-16 transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${exiting ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <div className="flex flex-col items-start gap-1">
        <span className="font-mono text-[9px] font-bold tracking-normal uppercase text-foreground">
          ANDERS SøLVSTEN THOMSEN
        </span>
        <span className="md:hidden font-mono text-[9px] font-bold tracking-normal uppercase text-foreground">
          FASHION STYLIST & ART DIRECTOR
        </span>
      </div>

      <span className="font-mono text-[9px] font-bold tracking-normal uppercase text-foreground md:absolute md:left-1/2 md:-translate-x-1/2">
        <span>{count}</span>
        <span className="mx-2 text-wash">—</span>
        <span>100</span>
      </span>

      <span className="hidden md:block font-mono text-[9px] font-bold tracking-normal uppercase text-foreground">
        FASHION STYLIST & ART DIRECTOR
      </span>
    </div>
  );
}
