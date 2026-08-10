import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProjectCard from "@/components/ProjectCard";
import Guestbook from "@/components/Guestbook";
import { projects } from "@/data/projects";

type Segment = { t: string; strong?: boolean; squiggle?: boolean; href?: string };
type Service = { label: string; title: string; body: string };

export default function HomePage() {
  const t = useTranslations("home");
  const w = useTranslations("work");
  const hero = t.raw("hero") as Segment[];
  const services = t.raw("services") as Service[];

  return (
    <>
      <section className="center pb-18">
        <h1 className="text-[2.1rem] leading-[1.2] font-normal tracking-[-0.02em] text-balance sm:text-[2.9rem] lg:text-[3.35rem]">
          {hero.map((seg, i) => {
            if (seg.href) {
              return (
                <Link
                  key={i}
                  href={seg.href as "/contact"}
                  className="font-semibold underline decoration-2 underline-offset-[7px] transition-colors hover:text-muted"
                >
                  {seg.t}
                </Link>
              );
            }
            if (seg.squiggle) {
              return (
                <span key={i} className="squiggle">
                  {seg.t}
                </span>
              );
            }
            return <span key={i}>{seg.t}</span>;
          })}
        </h1>
      </section>

      <section className="reveal center pb-18">
        <h2 className="mb-6 text-[1.25em] font-semibold">
          {t("projectsTitle")}
        </h2>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              image={project.image}
              featured={i === 0}
              name={w(`projects.${project.slug}.name`)}
              category={w(`projects.${project.slug}.category`)}
              year={w(`projects.${project.slug}.year`)}
              alt={w(`projects.${project.slug}.alt`)}
            />
          ))}
        </ul>

        <Link href="/work" className="link mt-6 inline-block font-mono text-[0.8em]">
          {t("moreWork")}
        </Link>
      </section>

      <section className="reveal center pb-20">
        <h2 className="mb-6 text-[1.25em] font-semibold">
          {t("servicesTitle")}
        </h2>

        <ul className="flex flex-col gap-5">
          {services.map((service) => (
            <li
              key={service.label}
              className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-[98px_1fr]"
            >
              <p className="font-mono text-[0.7em] text-muted sm:pt-[0.55em]">
                {service.label}
              </p>
              <div>
                <h3>{service.title}</h3>
                <p className="text-[0.8em] text-muted">{service.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Guestbook />
    </>
  );
}
