import { routing } from "@/i18n/routing";

export const SITE_URL = "https://lucia-adams.com";

type RouteKey = keyof typeof routing.pathnames;
type Locale = (typeof routing.locales)[number];

function pathnameFor(locale: Locale, route: RouteKey): string {
  const entry = routing.pathnames[route];
  return typeof entry === "string" ? entry : entry[locale];
}

/**
 * Absolute URL for a route in a given locale, built from the same localized
 * pathnames the app routes on ("/trabajo" for es, "/work" for en) — so
 * canonical/hreflang links always match what the site actually serves.
 * `as-needed` prefixing: the default locale (es) carries no prefix.
 */
export function localizedUrl(locale: Locale, route: RouteKey): string {
  const pathname = pathnameFor(locale, route);
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = pathname === "/" ? "" : pathname;
  return `${SITE_URL}${prefix}${suffix}`;
}

/** Every locale variant of a route, for `alternates.languages`. */
export function languageAlternates(route: RouteKey): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const locale of routing.locales) {
    entries[locale] = localizedUrl(locale, route);
  }
  entries["x-default"] = localizedUrl(routing.defaultLocale, route);
  return entries;
}
