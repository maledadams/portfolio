import { defineRouting } from "next-intl/routing";

/**
 * Paths are localized because the nav renders them literally (`/trabajo`,
 * `/contacto`), so the label and the URL have to agree.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/work": { es: "/trabajo", en: "/work" },
    "/contact": { es: "/contacto", en: "/contact" },
  },
});
