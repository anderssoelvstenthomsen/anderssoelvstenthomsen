export interface Project {
  id: string;
  title: string;
  client: string;
  category: "clients" | "editorial" | "art-direction" | "motion";
  date: number;
  hero: string;
  images: string[];
}
