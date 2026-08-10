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
    <div className="flex flex-col gap-7 sm:gap-9">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
        <h1 className="font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
          {t("heading")}
        </h1>
        <p className="max-w-[60ch] text-base text-ink/75 md:pb-2 md:text-right">
          {t("intro")}
        </p>
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
        />
      ))}
    </div>
  );
}
