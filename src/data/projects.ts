import type { Accent } from "@/components/Window";

export type Project = {
  slug: "pulpina" | "stemise" | "togethersport";
  url: string;
  image: string;
  /** Each project owns one candy color permanently, everywhere it appears. */
  accent: Accent;
};

export const projects: Project[] = [
  {
    slug: "pulpina",
    url: "https://pulpina.lucia-adams.com",
    image: "/work/pulpina.png",
    accent: "pink",
  },
  {
    slug: "stemise",
    url: "https://stemise.lucia-adams.com",
    image: "/work/stemise.png",
    accent: "blue",
  },
  {
    slug: "togethersport",
    url: "https://togethersport.lucia-adams.com",
    image: "/work/togethersport.png",
    accent: "tangerine",
  },
];
