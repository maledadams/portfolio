import Image from "next/image";
import { useTranslations } from "next-intl";
import TiltCard from "@/components/TiltCard";
import PackReveal, { type PackCard } from "@/components/PackReveal";
import { projects } from "@/data/projects";

export default function WorkPage() {
  const t = useTranslations("work");
  const p = useTranslations("pack");

  const packCards: PackCard[] = projects.map((project) => ({
    slug: project.slug,
    name: t(`projects.${project.slug}.name`),
    category: t(`projects.${project.slug}.category`),
    year: t(`projects.${project.slug}.year`),
    image: project.image,
    alt: t(`projects.${project.slug}.alt`),
    summary: t(`projects.${project.slug}.summary`),
    rarity: project.rarity,
    rarityLabel: p(project.rarity),
  }));

  const packLabels = {
    packName: p("packName"),
    packSub: p("packSub"),
    open: p("open"),
    skip: p("skip"),
    next: p("next"),
    done: p("done"),
  };

  return (
    <>
      <PackReveal cards={packCards} labels={packLabels} />

      <section className="center pb-14">
        <h1 className="text-[1.9rem] leading-[1.2] font-normal tracking-[-0.02em] sm:text-[2.4rem]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[46ch] text-muted">{t("intro")}</p>
      </section>

      <div className="flex flex-col">
        {projects.map((project) => {
          const surface = t.raw(
            `projects.${project.slug}.surface`,
          ) as string[];
          const systems = t.raw(
            `projects.${project.slug}.systems`,
          ) as string[];

          return (
            <article
              key={project.slug}
              className="center border-t border-line py-14"
            >
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 className="text-[1.25em] font-semibold">
                  {t(`projects.${project.slug}.name`)}
                </h2>
                <p className="font-mono text-[0.7em] text-muted">
                  {t(`projects.${project.slug}.category`)}{" "}
                  {t(`projects.${project.slug}.year`)}
                </p>
              </div>

              <TiltCard maxTilt={4} holo={project.rarity}>
                <Image
                  src={project.image}
                  alt={t(`projects.${project.slug}.alt`)}
                  width={1440}
                  height={900}
                  className="block h-auto w-full border border-line"
                  sizes="(min-width: 900px) 788px, 100vw"
                />
              </TiltCard>

              <p className="mt-6 max-w-[52ch]">
                {t(`projects.${project.slug}.summary`)}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {[
                  { label: t("surfaceLabel"), points: surface },
                  { label: t("systemsLabel"), points: systems },
                ].map((block) => (
                  <div key={block.label}>
                    <h3 className="mb-3 font-mono text-[0.7em] text-muted">
                      {block.label}
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {block.points.map((point) => (
                        <li key={point} className="text-[0.8em] text-muted">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link mt-8 inline-block font-mono text-[0.8em]"
              >
                {t("visit")} &rarr;
              </a>
            </article>
          );
        })}
      </div>
    </>
  );
}
