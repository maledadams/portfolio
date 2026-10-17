import type { Metadata } from "next";
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
  const services = (t.raw("services") as string[]).map((service, i) => ({ service, i }));
  const serviceRows = [services.slice(0, 3), services.slice(3, 5), services.slice(5)];

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
          {t("servicesTitle")}
        </h2>

        {/* Tags in fixed 3 · 2 · 3 rows, each row centered, so the block
            reads symmetrical however long each service runs. The order in
            messages/ is what balances it: the two longest sit in the middle
            row. On narrow screens each row just wraps, still centered. */}
        <ul className="flex flex-col items-center gap-2">
          {serviceRows.map((row, r) => (
            <li key={r} className="flex flex-wrap justify-center gap-2">
              {row.map(({ service, i }) => (
                <span
                  key={service}
                  className="flex items-center gap-2 bg-white/10 px-3 py-1 font-mono text-[0.7em] text-fg transition-colors hover:bg-white/15"
                >
                  <SparkleStar
                    className="sparkle-twinkle h-3 w-3 shrink-0 text-[#ff0000]"
                    style={{ animationDelay: `${i * 260}ms` }}
                  />
                  {service}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal center pb-20">
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
        <div className="info-card rounded-md px-8 py-14 text-center sm:px-14">
          <h2 className="text-[1.4em] font-semibold sm:text-[1.6em]">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-[40ch] text-muted">{t("ctaBody")}</p>

          <Link
            href="/contact"
            className="cta-button btn-card btn-card-solid mt-8 inline-flex items-center gap-2 px-6 py-3 font-mono text-[0.85em]"
          >
            {t("ctaButton")}
            <ArrowRightIcon size="1em" weight="bold" className="cta-arrow" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
