import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative h-[100dvh] bg-background text-foreground flex flex-col items-center justify-center px-6 overflow-hidden">
      <h1 className="font-mono font-bold leading-[0.85] tracking-tight text-[clamp(96px,26vw,280px)] select-none">
        4<span className="text-wash">0</span>4
      </h1>

      <p className="mt-7 font-mono text-[9px] font-bold tracking-normal uppercase text-foreground/40">
        The page you&#39;re looking for is off the runway
      </p>

      <Link
        href="/"
        className="mt-2 font-mono text-[9px] font-bold tracking-normal uppercase text-foreground transition-colors hover:text-accent"
      >
        Back to start
      </Link>

      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: 'url("/noise.png")' }}
      />
    </main>
  );
}
