import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// One explicit import per locale instead of a template-literal path: the
// bundler can't track `messages/${locale}.json` as individual files, so in
// `next dev` edits to the JSON kept serving stale copies.
const loaders = {
  es: () => import("../../messages/es.json"),
  en: () => import("../../messages/en.json"),
} satisfies Record<(typeof routing.locales)[number], () => Promise<unknown>>;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await loaders[locale]()).default,
  };
});
