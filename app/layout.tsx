import type { Metadata } from "next";
import localFont from "next/font/local";
import { PT_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Preloader from "@/components/preloader";
import { MenuProvider } from "@/components/menu-context";

const ptMono = PT_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pt-mono",
  display: "swap",
});

const nimbusSans = localFont({
  src: [
    { path: "../fonts/NimbusSanL-Reg.otf", weight: "400", style: "normal" },
    { path: "../fonts/NimbusSanL-RegIta.otf", weight: "400", style: "italic" },
    { path: "../fonts/NimbusSanL-Bol.otf", weight: "700", style: "normal" },
    { path: "../fonts/NimbusSanL-BolIta.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-nimbus-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anderssoelvstenthomsen.com"),
  title: {
    default: "Anders Soelvsten Thomsen — Stylist & Creative Director",
    template: "%s | Anders Soelvsten Thomsen",
  },
  description:
    "Anders Soelvsten Thomsen is a London-based fashion stylist and creative director. Explore editorial work, lookbooks, and collaborations with NME, Footballer Fits, and more.",
  keywords: ["Anders Soelvsten Thomsen", "fashion stylist", "creative director", "London", "editorial", "lookbook"],
  authors: [{ name: "Anders Soelvsten Thomsen" }],
  creator: "Anders Soelvsten Thomsen",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://anderssoelvstenthomsen.com",
    siteName: "Anders Soelvsten Thomsen",
    title: "Anders Soelvsten Thomsen — Stylist & Creative Director",
    description:
      "London-based fashion stylist and creative director. Editorial work, lookbooks, and collaborations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anders Soelvsten Thomsen — Stylist & Creative Director",
    description:
      "London-based fashion stylist and creative director. Editorial work, lookbooks, and collaborations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anders Soelvsten Thomsen",
  jobTitle: "Fashion Stylist & Creative Director",
  url: "https://anderssoelvstenthomsen.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  email: "anderssoelvstenthomsen@gmail.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${nimbusSans.variable} ${ptMono.variable} antialiased`}
      >
        <MenuProvider>
          <Preloader />
          <Header />
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}
