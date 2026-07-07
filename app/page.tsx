import HomeClient from "@/components/home-client";
import { getFeatured, getHero } from "@/lib/content";

export default async function Home() {
  const [hero, featured] = await Promise.all([getHero(), getFeatured(6)]);
  return <HomeClient hero={hero} featured={featured} />;
}
