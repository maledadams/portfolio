import { useTranslations } from "next-intl";
import TitleBlock from "@/components/TitleBlock";

type Step = { verb: string; body: string };

const EMAIL = "maledadams@gmail.com";

export default function ContactPage() {
  const t = useTranslations("contact");
  const steps = t.raw("process.steps") as Step[];

  return (
    <section className="pb-20 pt-10 sm:pb-28 sm:pt-14">
      <TitleBlock sheet="A-3" title={t("sheetTitle")} spine />

      <div className="grid grid-cols-1 gap-16 pt-14 lg:grid-cols-12">
        {/* Process */}
        <div className="lg:col-span-6">
          <h2 className="font-mono text-[11px] tracking-[0.2em] text-dim">
            {t("process.sheetTitle")}
          </h2>
          <ol className="mt-6">
            {steps.map((step, i) => (
              <li
                key={step.verb}
                className="flex gap-5 border-t border-line py-6 last:border-b"
              >
                <span className="font-mono text-sm text-cyan">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium text-ink">{step.verb}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dim">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Contact panel */}
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="border border-line bg-sheet/60 p-7 sm:p-9">
            <h2 className="text-2xl tracking-tight text-ink sm:text-3xl">
              {t("panel.title")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-dim sm:text-base">
              {t("panel.body")}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-7 inline-block border border-amber bg-amber px-6 py-3 font-mono text-sm tracking-[0.1em] text-deep transition-transform hover:bg-transparent hover:text-amber active:translate-y-px"
            >
              {t("panel.cta")}
            </a>

            <dl className="mt-9 border-t border-line font-mono text-[12px]">
              {(
                [
                  [t("panel.email"), EMAIL, `mailto:${EMAIL}`],
                  [
                    t("panel.linkedin"),
                    "/in/lucia-m-adams",
                    "https://www.linkedin.com/in/lucia-m-adams/",
                  ],
                  [
                    t("panel.github"),
                    "/maledadams",
                    "https://github.com/maledadams",
                  ],
                  [t("panel.location"), t("panel.locationValue"), null],
                ] as const
              ).map(([key, value, href]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="tracking-[0.16em] text-dim">{key}</dt>
                  <dd className="text-right">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-ink transition-colors hover:text-cyan"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-ink">{value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
