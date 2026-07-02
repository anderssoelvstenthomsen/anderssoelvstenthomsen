import MotionGrid, { type MotionItem } from "@/components/motion-grid";

const motionItems: MotionItem[] = [
  {
    title: "Campaign",
    client: "Ilái Sarái",
    video: "/assets/hero.mp4",
    poster: "/assets/motion/ilai-sarai.jpg",
  },
  {
    title: "Poised and Posed",
    client: "Icon America",
    video: "/assets/images/poised-and-posed-for-icon-america/SnapInsta.to_AQPmc8NWqjBSLyyB2vTPX7d5qmT11EwLv5q6wbMGUlQGvo8hncJRKc48a65-HYOGSPoJ5_qxDVp7CSW9Em6txnFv2Bx2NPXvrNVZQMg.mp4",
    poster: "/assets/motion/poised.jpg",
  },
];

export default function MotionPage() {
  return <MotionGrid items={motionItems} />;
}
