export type Project = {
  slug: "pulpina" | "stemise" | "togethersport";
  url: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "pulpina",
    url: "https://pulpina.lucia-adams.com",
    image: "/work/pulpina.png",
  },
  {
    slug: "stemise",
    url: "https://stemise.lucia-adams.com",
    image: "/work/stemise.png",
  },
  {
    slug: "togethersport",
    url: "https://togethersport.lucia-adams.com",
    image: "/work/togethersport.png",
  },
];
