import { useTranslations } from "next-intl";
import TabbedProject from "@/components/TabbedProject";
import { projects } from "@/data/projects";
import type { Stage } from "@/components/SystemDiagram";

type Point = { label: string; body: string };

export default function WorkPage() {
  const t = useTranslations("work");

  const labels = {
    surfaceTab: t("surfaceTab"),
    systemsTab: t("systemsTab"),
    visit: t("visit"),
    diagramNote: t("diagramNote"),
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <header>
        <h1 className="font-display text-3xl leading-tight font-extrabold sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="mt-2 max-w-[52ch] text-base text-ink/75">{t("intro")}</p>
      </header>

      {projects.map((project) => (
        <TabbedProject
          key={project.slug}
          fileName={t(`projects.${project.slug}.name`)}
          label={t(`projects.${project.slug}.label`)}
          type={t(`projects.${project.slug}.type`)}
          alt={t(`projects.${project.slug}.alt`)}
          accent={project.accent}
          image={project.image}
          url={project.url}
          stages={t.raw(`projects.${project.slug}.diagram`) as Stage[]}
          surface={t.raw(`projects.${project.slug}.surface`) as Point[]}
          systems={t.raw(`projects.${project.slug}.systems`) as Point[]}
          labels={labels}
          className={project.offset}
        />
      ))}
    </div>
  );
}
