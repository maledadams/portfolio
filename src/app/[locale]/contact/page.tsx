import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import ContactForm from "@/components/ContactForm";
import { LIMITS } from "@/lib/contact";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { localizedUrl, languageAlternates } from "@/lib/seo";

type Step = { label: string; title: string; body: string };

const social = [
  {
    key: "linkedin",
    href: "https://www.linkedin.com/in/lucia-m-adams/",
    Icon: LinkedinLogoIcon,
  },
  {
    key: "github",
    href: "https://github.com/maledadams",
    Icon: GithubLogoIcon,
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: localizedUrl(locale as "es" | "en", "/contact"),
      languages: languageAlternates("/contact"),
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const steps = t.raw("steps") as Step[];
  const turnstileSiteKey = await getTurnstileSiteKey();

  const formLabels = {
    name: t("formName"),
    email: t("formEmail"),
    message: t("formMessage"),
    submit: t("formSubmit"),
    sending: t("formSending"),
    done: t("formDone"),
    errorInvalid: t("errorInvalid"),
    errorTurnstile: t("errorTurnstile"),
    errorRate: t("errorRate"),
    errorOffline: t("errorOffline"),
    errorGeneric: t("errorGeneric"),
  };

  return (
    <>
      <section className="center pb-16">
        <h1 className="text-[1.9rem] leading-[1.2] font-normal tracking-[-0.02em] sm:text-[2.4rem]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[46ch] text-muted">{t("intro")}</p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <h2 className="font-mono text-[0.7em] text-muted">
            {t("elsewhereTitle")}
          </h2>
          <div className="flex items-center gap-4">
            {social.map(({ key, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`social.${key}`)}
                className="text-fg transition-colors hover:text-muted"
              >
                <Icon size={22} weight="regular" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-5 sm:grid-cols-[98px_1fr]">
          <p className="font-mono text-[0.7em] text-muted sm:pt-[0.55em]">
            {t("baseLabel")}
          </p>
          <p>{t("baseValue")}</p>
        </div>
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

      <section className="center border-t border-line py-14">
        <h2 className="mb-2 text-[1.25em] font-semibold">
          {t("formTitle")}
        </h2>
        <p className="max-w-[46ch] text-[0.8em] text-muted">
          {t("formBody")}
        </p>

        <ContactForm
          labels={formLabels}
          maxName={LIMITS.name}
          maxEmail={LIMITS.email}
          maxMessage={LIMITS.message}
          turnstileSiteKey={turnstileSiteKey}
        />
      </section>
    </>
  );
}
