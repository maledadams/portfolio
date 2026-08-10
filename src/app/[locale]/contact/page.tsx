import { useTranslations } from "next-intl";
import { links } from "@/components/Footer";

type Step = { label: string; title: string; body: string };

export default function ContactPage() {
  const t = useTranslations("contact");
  const steps = t.raw("steps") as Step[];

  return (
    <>
      <section className="center pb-16">
        <h1 className="text-[1.9rem] leading-[1.2] font-normal tracking-[-0.02em] sm:text-[2.4rem]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[46ch] text-muted">{t("intro")}</p>

        <ul className="mt-8 flex flex-col gap-3">
          {links.map((link) => (
            <li
              key={link.label}
              className="grid grid-cols-1 gap-x-5 sm:grid-cols-[98px_1fr]"
            >
              <p className="font-mono text-[0.7em] text-muted sm:pt-[0.55em]">
                {link.label}
              </p>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="underline decoration-1 underline-offset-4 transition-colors hover:text-muted"
              >
                {link.text}
              </a>
            </li>
          ))}
          <li className="grid grid-cols-1 gap-x-5 sm:grid-cols-[98px_1fr]">
            <p className="font-mono text-[0.7em] text-muted sm:pt-[0.55em]">
              {t("baseLabel")}
            </p>
            <p>{t("baseValue")}</p>
          </li>
        </ul>
      </section>

      <section className="center border-t border-line py-14">
        <h2 className="mb-6 text-[1.25em] font-semibold">
          {t("processTitle")}
        </h2>

        <ul className="flex flex-col gap-5">
          {steps.map((step) => (
            <li
              key={step.label}
              className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-[98px_1fr]"
            >
              <p className="font-mono text-[0.7em] text-muted sm:pt-[0.55em]">
                {step.label}
              </p>
              <div>
                <h3>{step.title}</h3>
                <p className="text-[0.8em] text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
