import MotionGrid from "@/components/motion-grid";
import { getMotionItems } from "@/lib/content";

export default async function MotionPage() {
  const items = await getMotionItems();
  return <MotionGrid items={items} />;
}
