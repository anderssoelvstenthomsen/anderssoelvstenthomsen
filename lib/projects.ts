export interface Project {
  id: string;
  title: string;
  client: string;
  subtitle: string;
  category: "clients" | "editorial" | "art-direction" | "motion";
  date: number;
  hero: string;
  thumb: string;
  images: string[];
}
