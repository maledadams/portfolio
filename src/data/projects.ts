export type Rarity = "legendary" | "rare";

export type Project = {
  slug: "pulpina" | "stemise" | "togethersport";
  url: string;
  image: string;
  /** When set, the card cycles through these screenshots, flipping around
   * between each instead of showing a single static one. */
  images?: string[];
  /** Drives the card frame and the rays behind it in the pack reveal. */
  rarity: Rarity;
};

export const projects: Project[] = [
  {
    slug: "pulpina",
    url: "https://pulpina.lucia-adams.com",
    image: "/work/scroll/pulpina-home.webp",
    images: [
      "/work/scroll/pulpina-home.webp",
      "/work/scroll/pulpina-moon.webp",
      "/work/scroll/pulpina-sunshine.webp",
      "/work/scroll/pulpina-men.webp",
    ],
    rarity: "legendary",
  },
  {
    slug: "togethersport",
    url: "https://togethersport.lucia-adams.com",
    image: "/work/scroll/togethersport-home.webp",
    rarity: "rare",
  },
  {
    slug: "stemise",
    url: "https://stemise.lucia-adams.com",
    image: "/work/scroll/stemise-home.webp",
    rarity: "rare",
  },
];
