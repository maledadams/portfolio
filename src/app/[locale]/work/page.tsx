import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import PackReveal, { type PackCard } from "@/components/PackReveal";
import PaginatedProjects from "@/components/PaginatedProjects";
import { projects } from "@/data/projects";
import { localizedUrl, languageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: localizedUrl(locale as "es" | "en", "/work"),
      languages: languageAlternates("/work"),
    },
  };
}

export default function WorkPage() {
  const t = useTranslations("work");
  const p = useTranslations("pack");

  const packCards: PackCard[] = projects.map((project) => ({
    slug: project.slug,
    // Together Sports' full name wraps to two lines on the narrow pack
    // card, unbalancing the layout — shortened here only for that card.
    name:
      project.slug === "togethersport"
        ? p("togetherSportsShort")
        : t(`projects.${project.slug}.name`),
    category: t(`projects.${project.slug}.category`),
    year: t(`projects.${project.slug}.year`),
    image: project.image,
    alt: t(`projects.${project.slug}.alt`),
    summary: t(`projects.${project.slug}.summary`),
    rarity: project.rarity,
    rarityLabel: p(project.rarity),
  }));

  // Pulpina reads best centered in the 3-up pack reveal — reordered only
  // for this display, the shared `projects` order (main list, homepage
  // grid) is untouched.
  const packOrder: Array<PackCard["slug"]> = ["togethersport", "pulpina", "stemise"];
  const orderedPackCards = packOrder.map(
    (slug) => packCards.find((card) => card.slug === slug)!,
  );

  const packLabels = {
    packName: p("packName"),
    open: p("open"),
    skip: p("skip"),
    next: p("next"),
    done: p("done"),
  };

  return (
    <>
      <PackReveal cards={orderedPackCards} labels={packLabels} />

      <section className="center pb-14 text-center">
        <h1 className="font-mono text-[1.9rem] leading-[1.2] font-bold tracking-[-0.02em] sm:text-[2.4rem]">
          {t("title")}
        </h1>
      </section>

      <PaginatedProjects projects={projects} />
    </>
  );
}
