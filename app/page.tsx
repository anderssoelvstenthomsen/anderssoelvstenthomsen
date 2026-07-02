import HomeClient from "@/components/home-client";
import { getFeatured, getHeroVideo } from "@/lib/content";

export default async function Home() {
  const [heroVideo, featured] = await Promise.all([getHeroVideo(), getFeatured(6)]);
  return <HomeClient heroVideo={heroVideo} featured={featured} />;
}
