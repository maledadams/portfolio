import { useTranslations } from "next-intl";
import TitleBlock from "@/components/TitleBlock";
import DrawingSheet from "@/components/DrawingSheet";
import { projects } from "@/data/projects";

type Callout = { label: string; body: string };

export default function WorkPage() {
  const t = useTranslations("work");

  return (
    <section className="pb-20 pt-10 sm:pb-28 sm:pt-14">
      <TitleBlock sheet="A-2" title={t("sheetTitle")} spine />
      <p className="max-w-[58ch] pt-6 text-base leading-relaxed text-dim sm:text-lg">
        {t("intro")}
      </p>

      <div className="flex flex-col gap-20 pt-14 sm:gap-28">
        {projects.map((project, i) => (
          <DrawingSheet
            key={project.slug}
            project={project}
            index={`0${i + 1}`}
            name={t(`projects.${project.slug}.name`)}
            type={t(`projects.${project.slug}.type`)}
            alt={t(`projects.${project.slug}.alt`)}
            sheetLabel={t("sheetLabel")}
            surfaceLabel={t("surface")}
            systemsLabel={t("systems")}
            visitLabel={t("visit")}
            callouts={{
              surface: t.raw(`projects.${project.slug}.surface`) as Callout[],
              systems: t.raw(`projects.${project.slug}.systems`) as Callout[],
            }}
          />
        ))}
      </div>
    </section>
  );
}
