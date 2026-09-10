import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl, languageAlternates } from "@/lib/seo";

/**
 * Built from `routing.pathnames`, not a hardcoded list — add a route there
 * and it shows up here automatically, in every locale, with the right
 * hreflang alternates. Nothing to remember to update by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.keys(routing.pathnames) as (keyof typeof routing.pathnames)[];

  return routes.map((route) => ({
    url: localizedUrl(routing.defaultLocale, route),
    lastModified: new Date(),
    changeFrequency: "monthly",
    alternates: {
      languages: languageAlternates(route),
    },
  }));
}
