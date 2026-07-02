"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <section className="w-full min-h-[100dvh] bg-background text-foreground flex flex-col justify-start px-6 md:px-10 lg:px-16 pt-[60px] pb-12 relative overflow-x-hidden">

            <div className="w-full flex flex-col items-start relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="w-full"
                >
                    <p className="font-mono font-bold text-lg md:text-2xl lg:text-3xl leading-[1.0] tracking-tight pb-1 md:max-w-[80%]">
                        For styling, creative direction, collaborations, and all general inquiries.
                    </p>

                    <div className="pt-12 md:pt-16">
                        <span className="block font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40 mb-2">
                            Representation — LALALAND
                        </span>
                        <motion.a
                            href="mailto:murray@lalaland-group.com"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ opacity: 0.4 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block font-mono font-bold text-2xl md:text-4xl lg:text-5xl tracking-tight cursor-pointer"
                        >
                            murray@lalaland-group.com
                        </motion.a>
                        <p className="mt-3 font-mono text-[11px] font-bold tracking-normal uppercase text-foreground/40">
                            Murray Arthur — Senior Agent
                        </p>
                        <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] font-bold tracking-normal text-foreground/40 tabular-nums" style={{ fontFamily: "var(--font-pt-mono)" }}>
                            <a href="tel:+442037017655" className="hover:text-foreground transition-colors">Office +44 (0) 203 701 7655</a>
                            <a href="tel:+447941331206" className="hover:text-foreground transition-colors">Cell +44 (0) 794 133 1206</a>
                        </div>
                    </div>

                    <div className="pt-8 md:pt-12">
                        <span className="block font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40 mb-2">
                            SOCIAL
                        </span>
                        <motion.a
                            href="https://instagram.com/anderssoelvstenthomsen"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ opacity: 0.4 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block font-mono font-bold text-base md:text-lg tracking-tight cursor-pointer"
                        >
                            @anderssoelvstenthomsen
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