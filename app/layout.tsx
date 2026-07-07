import type { Metadata } from "next";
import localFont from "next/font/local";
import { PT_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Preloader from "@/components/preloader";
import { MenuProvider } from "@/components/menu-context";
import PrefetchImages from "@/components/prefetch-images";
import { getProjects, getSiteSettings } from "@/lib/content";

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

const TITLE = "Anders Sølvsten Thomsen — Fashion Stylist & Art Director";
const DESCRIPTION =
  "Anders Sølvsten Thomsen is a Danish-born, European-based fashion stylist and art director, contributing to leading publications and collaborating with the industry’s most recognised brands.";

export const metadata: Metadata = {
  metadataBase: new URL("https://anderssoelvstenthomsen.com"),
  title: {
    default: TITLE,
    template: "%s — Anders Sølvsten Thomsen",
  },
  description: DESCRIPTION,
  keywords: [
    "Anders Sølvsten Thomsen",
    "Anders Soelvsten Thomsen",
    "fashion stylist",
    "art director",
    "stylist",
    "creative direction",
    "editorial",
    "campaigns",
    "fashion",
  ],
  authors: [{ name: "Anders Sølvsten Thomsen" }],
  creator: "Anders Sølvsten Thomsen",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://anderssoelvstenthomsen.com",
    siteName: "Anders Sølvsten Thomsen",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Anders Sølvsten Thomsen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Anders Sølvsten Thomsen",
  alternateName: "Anders Soelvsten Thomsen",
  jobTitle: "Fashion Stylist & Art Director",
  url: "https://anderssoelvstenthomsen.com",
  image: "https://anderssoelvstenthomsen.com/og-image.png",
  email: "contact@anderssoelvstenthomsen.com",
  sameAs: ["https://www.instagram.com/anderssoelvstenthomsen/"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const coverUrls = projects.map((p) => p.thumb).filter(Boolean);

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
          <Header email={settings.contactEmail} />
          {children}
        </MenuProvider>
        <PrefetchImages urls={coverUrls} />
      </body>
    </html>
  );
}
