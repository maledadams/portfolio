export type CalloutPoint = { x: number; y: number };

export type Project = {
  slug: "pulpina" | "stemise" | "togethersport";
  url: string;
  image: string;
  /** Annotation targets as percentages of the screenshot (1440x900). */
  points: {
    surface: CalloutPoint[];
    systems: CalloutPoint[];
  };
};

export const projects: Project[] = [
  {
    slug: "pulpina",
    url: "https://pulpina.lucia-adams.com",
    image: "/work/pulpina.png",
    points: {
      surface: [
        { x: 19.5, y: 56.5 }, // Moon badge (the three universes)
        { x: 49.7, y: 56.5 }, // Sunshine mascot badge (illustration)
        { x: 49.6, y: 21.5 }, // "Elige tu Tienda" headline (custom UI)
      ],
      systems: [
        { x: 81, y: 56.5 }, // Men badge (catalog by universe)
        { x: 49.6, y: 7.3 }, // WhatsApp order banner
        { x: 49.6, y: 83.5 }, // general store entry (automated offers)
      ],
    },
  },
  {
    slug: "stemise",
    url: "https://stemise.lucia-adams.com",
    image: "/work/stemise.png",
    points: {
      surface: [
        { x: 49.8, y: 35 }, // headline (brand voice)
        { x: 48.6, y: 4.4 }, // nav pill (goal-based navigation)
        { x: 42.7, y: 64.3 }, // "Get STEM kits" button (action hierarchy)
      ],
      systems: [
        { x: 49.6, y: 73.9 }, // fiscal sponsor banner (donations)
        { x: 42.7, y: 64.3 }, // kits button (distribution flow)
        { x: 57, y: 64.3 }, // "See curriculum" (open curriculum)
      ],
    },
  },
  {
    slug: "togethersport",
    url: "https://togethersport.lucia-adams.com",
    image: "/work/togethersport.png",
    points: {
      surface: [
        { x: 27, y: 44 }, // giant headline
        { x: 78, y: 55 }, // photo collage
        { x: 7, y: 33 }, // basketball graphic (color per sport)
      ],
      systems: [
        { x: 41.3, y: 4.4 }, // SPORTS nav (multi-program architecture)
        { x: 20, y: 83 }, // CTA pair (participation paths)
        { x: 75.2, y: 4.4 }, // PARTNERS nav (Second Serve)
      ],
    },
  },
];
