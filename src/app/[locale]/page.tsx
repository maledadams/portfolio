import type { Metadata } from "next";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import ProjectCard from "@/components/ProjectCard";
import HeroPortrait from "@/components/HeroPortrait";
import SparkleStar from "@/components/SparkleStar";
import TypewriterHero, { type HeroSegment } from "@/components/TypewriterHero";
import { Link } from "@/i18n/navigation";
import { projects } from "@/data/projects";
import { localizedUrl, languageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: localizedUrl(locale as "es" | "en", "/"),
      languages: languageAlternates("/"),
    },
  };
}

export default function HomePage() {
  const t = useTranslations("home");
  const w = useTranslations("work");
  const hero = t.raw("hero") as HeroSegment[];
  const services = t.raw("services") as string[];
  const serviceRows = Array.from({ length: services.length / 2 }, (_, r) => ({
    left: services[r * 2],
    right: services[r * 2 + 1],
  }));

  return (
    <>
      <section className="pb-18">
        <div className="center flex flex-col items-center gap-8 text-center">
          {/*
            The mascot sits above the headline, centered, like it's
            introducing her — the page's signature rather than a second
            column competing with the text. Sized to stay a quiet accent,
            not the dominant element; the headline still carries the page.
          */}
          <HeroPortrait className="hero-face w-[182px] shrink-0 object-contain sm:w-[208px] lg:w-[234px]" />

          <h1 className="max-w-[700px] text-[1.7rem] leading-[1.2] font-normal tracking-[-0.02em] text-balance sm:text-[2rem] lg:text-[2.2rem]">
            <TypewriterHero segments={hero} />
          </h1>
        </div>
      </section>

      <section className="reveal center pb-18">
        <h2 className="mb-6 text-center text-[1.25em] font-semibold">
          {t("projectsTitle")}
        </h2>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              image={project.image}
              images={project.images}
              url={project.url}
              featured={project.rarity === "legendary"}
              name={w(`projects.${project.slug}.name`)}
              category={w(`projects.${project.slug}.category`)}
              year={w(`projects.${project.slug}.year`)}
              alt={w(`projects.${project.slug}.alt`)}
            />
          ))}
        </ul>
      </section>

      <section className="reveal center pb-20">
        <h2 className="mb-6 text-center text-[1.25em] font-semibold">
          {t("servicesTitle")}
        </h2>

        {/* Mobile: a plain single-column list. */}
        <ul className="flex flex-col gap-4 sm:hidden">
          {services.map((service, i) => (
            <li key={service} className="flex items-center gap-3">
              <SparkleStar
                className="sparkle-twinkle h-4 w-4 shrink-0 text-[#ff0000]"
                style={{ animationDelay: `${i * 260}ms` }}
              />
              <span className="font-mono text-[0.85em]">{service}</span>
            </li>
          ))}
        </ul>

        {/* Desktop: one grid, four fixed tracks — both star columns land on
            the same pixel line in every row no matter how long the words
            on either side run. */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_1fr] sm:items-center sm:gap-x-3 sm:gap-y-4">
          {serviceRows.map((row, r) => (
            <Fragment key={r}>
              <span className="text-right font-mono text-[0.85em] whitespace-nowrap">
                {row.left}
              </span>
              <SparkleStar
                className="sparkle-twinkle h-4 w-4 shrink-0 text-[#ff0000]"
                style={{ animationDelay: `${r * 2 * 260}ms` }}
              />
              <SparkleStar
                className="sparkle-twinkle h-4 w-4 shrink-0 text-[#ff0000]"
                style={{ animationDelay: `${(r * 2 + 1) * 260}ms` }}
              />
              <span className="text-left font-mono text-[0.85em] whitespace-nowrap">
                {row.right}
              </span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className="reveal center pb-20">
        <div className="border border-white px-8 py-14 text-center sm:px-14">
          <h2 className="text-[1.4em] font-semibold sm:text-[1.6em]">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-muted">{t("ctaBody")}</p>

          <Link
            href="/contact"
            className="cta-button mt-8 inline-flex items-center gap-2 border border-white bg-transparent px-6 py-3 font-mono text-[0.85em] transition-colors hover:bg-white hover:text-bg"
          >
            {t("ctaButton")}
            <ArrowRightIcon size="1em" weight="bold" className="cta-arrow" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
