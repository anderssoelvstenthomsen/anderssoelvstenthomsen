"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const groups = [
    {
        label: "Clients",
        items: [
            "ADIDAS",
            "AWAY",
            "BURBERRY",
            "CANADA GOOSE",
            "CHARLES JEFFREY LOVERBOY",
            "EVERLANE",
            "FARFETCH",
            "GUCCI",
            "HUGO BOSS",
            "LOEWE",
            "LOUIS VUITTON",
            "MARC JACOBS",
            "MONTBLANC",
            "NIKE",
            "NINA RICCI",
            "ZARA",
        ],
    },
    {
        label: "Art Direction",
        items: [
            "FENG CHEN WANG",
            "DESMOND AND DEMPSEY",
            "BARBOUR",
            "CONVERSE",
            "CROCS",
            "ILAI SARAI",
            "LEE",
            "LEVIS RED",
            "MØBEL COPENHAGEN",
            "PANGAIA",
            "SAUCONY",
            "UGG",
        ],
    },
    {
        label: "Editorial",
        items: [
            "CR FASHION BOOK",
            "DOCUMENT JOURNAL",
            "DISPLAY COPY",
            "DUST",
            "FAMILY STYLE",
            "ICON AMERICA",
            "INTERVIEW",
            "LOVE",
            "MODERN MATTER",
            "OFFICE",
            "RE-EDITION",
            "REPLICA MAN",
            "THE CUT",
            "VOGUE",
        ],
    },
];

export default function AboutPage() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [buttonText, setButtonText] = useState("READ MORE");

    const handleToggle = () => {
        if (isExpanded) {
            setIsExpanded(false);
            setTimeout(() => setButtonText("READ MORE"), 800);
        } else {
            setIsExpanded(true);
            setButtonText("READ LESS");
        }
    };

    return (
        <section className="w-full min-h-[100dvh] bg-background text-foreground flex flex-col justify-start px-6 md:px-10 lg:px-16 pt-[60px] pb-16 relative overflow-x-hidden">

            <div className="w-full flex flex-col items-start relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="w-full md:max-w-[80%]"
                >
                    <p className="font-mono font-bold text-lg md:text-2xl lg:text-3xl leading-[1.0] tracking-tight pb-1">
                        Anders Sølvsten Thomsen is a Danish-born, European-based stylist and art director. He regularly contributes to leading publications and collaborates with some of the industry&#39;s most recognised brands.
                    </p>

                    <div
                        className="relative overflow-hidden transition-[max-height] duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
                        style={{ maxHeight: isExpanded ? "3000px" : "0px" }}
                    >
                        <p className="font-mono font-bold text-lg md:text-2xl lg:text-3xl leading-[1.0] tracking-tight pt-6 pb-1">
                            As a consulting stylist, Anders works across concept, design development and art direction. In addition to fashion, Anders curates and consults for various furniture and interior brands.
                        </p>

                        <div className="pt-10 md:pt-14 flex flex-col gap-8">
                            {groups.map((group) => (
                                <div key={group.label}>
                                    <span className="block font-mono font-bold text-sm tracking-normal uppercase text-foreground/30 mb-3">
                                        {group.label}
                                    </span>
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 font-mono font-bold text-base md:text-lg tracking-tight">
                                        {group.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleToggle}
                        className="mt-6 font-mono font-bold text-sm tracking-normal uppercase text-foreground/30 hover:text-foreground transition-colors duration-300"
                    >
                        {buttonText}
                    </button>

                    <div className="pt-8 md:pt-12 flex flex-row w-full">
                        <motion.a
                            href="https://instagram.com/anderssoelvstenthomsen"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            whileHover={{ opacity: 1 }}
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
