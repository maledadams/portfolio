import { useTranslations } from "next-intl";
import Window from "@/components/Window";

type Step = { verb: string; body: string };

const EMAIL = "maledadams@gmail.com";

const stepTint = ["bg-butter", "bg-lime", "bg-blue", "bg-pink"];

export default function ContactPage() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const steps = t.raw("process.steps") as Step[];

  const rows: [string, string, string | null][] = [
    [t("panel.email"), EMAIL, `mailto:${EMAIL}`],
    [
      t("panel.linkedin"),
      "/in/lucia-m-adams",
      "https://www.linkedin.com/in/lucia-m-adams/",
    ],
    [t("panel.github"), "/maledadams", "https://github.com/maledadams"],
    [t("panel.location"), t("panel.locationValue"), null],
  ];

  return (
    <div className="flex flex-col gap-7 sm:gap-9">
      <Window title={t("process.windowTitle")} accent="lime">
        <div className="p-6 sm:p-10">
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
            {t("process.heading")}
          </h1>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.verb}
                className={`border-[3px] border-ink p-5 ${stepTint[i]}`}
              >
                <span className="font-chrome text-[11px] text-ink/70">
                  0{i + 1}
                </span>
                <h2 className="mt-1 font-display text-xl font-bold">
                  {step.verb}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Window>

      <Window title={t("panel.windowTitle")} accent="tangerine" status={EMAIL}>
        <div className="p-6 sm:p-10">
          <div className="flex flex-col gap-6 border-b-[3px] border-ink pb-8 md:flex-row md:items-center md:justify-between md:gap-10">
            <div>
              <h2 className="font-display text-3xl leading-tight font-extrabold sm:text-4xl">
                {t("panel.title")}
              </h2>
              <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-ink/75">
                {t("panel.body")}
              </p>
            </div>

            <a
              href={`mailto:${EMAIL}`}
              className="press shrink-0 self-start border-[3px] border-ink bg-tangerine px-8 py-3.5 text-base font-bold md:self-auto"
            >
              {nav("cta")}
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map(([key, value, href]) => (
              <div
                key={key}
                className="bevel-down border-[3px] border-ink bg-shade px-4 py-3"
              >
                <dt className="font-chrome text-[10px] text-ink/60">{key}</dt>
                <dd className="mt-1.5 text-sm font-semibold break-all">
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="underline decoration-2 underline-offset-4 hover:bg-butter"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Window>
    </div>
  );
}
