export type Rarity = "legendary" | "rare";

export type Project = {
  slug: "pulpina" | "stemise" | "togethersport";
  url: string;
  image: string;
  /** Drives the card frame and the rays behind it in the pack reveal. */
  rarity: Rarity;
};

export const projects: Project[] = [
  {
    slug: "pulpina",
    url: "https://pulpina.lucia-adams.com",
    image: "/work/pulpina.png",
    rarity: "legendary",
  },
  {
    slug: "stemise",
    url: "https://stemise.lucia-adams.com",
    image: "/work/stemise.png",
    rarity: "rare",
  },
  {
    slug: "togethersport",
    url: "https://togethersport.lucia-adams.com",
    image: "/work/togethersport.png",
    rarity: "rare",
  },
];
