"use client";

import { motion } from "framer-motion";
import type { SiteSettings } from "@/lib/content";

function tel(number: string): string {
  return "tel:" + number.replace(/[^\d+]/g, "");
}

function instagramHandle(url: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop();
  return slug ? `@${slug}` : url;
}

export default function ContactClient({ settings }: { settings: SiteSettings }) {
  return (
    <section className="w-full min-h-[100dvh] bg-background text-foreground flex flex-col justify-start px-6 md:px-10 lg:px-16 pt-[60px] pb-12 relative overflow-x-hidden">
      <h1 className="sr-only">Contact — Anders Sølvsten Thomsen</h1>

      <div className="w-full flex flex-col items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full"
        >
          <p className="font-mono font-bold text-lg md:text-2xl lg:text-3xl leading-[1.0] tracking-tight pb-1 md:max-w-[80%]">
            {settings.contactHeadline}
          </p>

          <div className="pt-12 md:pt-16">
            <span className="block font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40 mb-2">
              {settings.repAgency ? `Representation — ${settings.repAgency}` : "Representation"}
            </span>
            <motion.a
              href={`mailto:${settings.repEmail}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
              className="inline-block font-mono font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight cursor-pointer"
            >
              {settings.repEmail}
            </motion.a>
            <p className="mt-3 font-mono text-[11px] font-bold tracking-normal uppercase text-foreground/40">
              {settings.repName} — {settings.repTitle}
            </p>
            <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] font-bold tracking-normal text-foreground/40 tabular-nums" style={{ fontFamily: "var(--font-pt-mono)" }}>
              <a href={tel(settings.repOffice)} className="hover:text-foreground transition-colors">Office {settings.repOffice}</a>
              <a href={tel(settings.repCell)} className="hover:text-foreground transition-colors">Cell {settings.repCell}</a>
            </div>
          </div>

          <div className="pt-8 md:pt-12">
            <span className="block font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40 mb-2">
              SOCIAL
            </span>
            <motion.a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ opacity: 0.4 }}
              transition={{ duration: 0.3 }}
              className="inline-block font-mono font-bold text-base md:text-lg tracking-tight cursor-pointer"
            >
              {instagramHandle(settings.instagram)}
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: 'url("/noise.png")' }}
      />
    </section>
  );
}
