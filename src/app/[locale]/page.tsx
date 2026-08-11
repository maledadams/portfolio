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
      <section className="pb-18">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-9 lg:flex-row lg:items-center lg:justify-center lg:gap-14">
          {/*
            Shown once there's room for it beside the text. Full image, never
            cropped: width is fixed, height follows the SVG's own aspect
            ratio via object-contain. Centered as a pair with the headline
            rather than stretched to match its height.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a local
              decorative SVG, not a photo that needs next/image's srcset. */}
          <img
            src="/lucia-portrait.svg"
            alt=""
            aria-hidden="true"
            className="hidden w-[340px] shrink-0 object-contain lg:block xl:w-[440px]"
          />

          <h1 className="max-w-[720px] text-[2.1rem] leading-[1.2] font-normal tracking-[-0.02em] text-balance sm:text-[2.9rem] lg:text-[3.35rem]">
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
        </div>
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
