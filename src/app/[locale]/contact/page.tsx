import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactFlow, { type FlowCopy } from "@/components/ContactFlow";
import SparkleStar from "@/components/SparkleStar";
import { LIMITS } from "@/lib/contact";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { localizedUrl, languageAlternates } from "@/lib/seo";

type Step = { label: string; title: string; body: string };

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

  const errors = {
    errorInvalid: t("errorInvalid"),
    errorTurnstile: t("errorTurnstile"),
    errorRate: t("errorRate"),
    errorOffline: t("errorOffline"),
    errorGeneric: t("errorGeneric"),
  };

  return (
    <>
      <section className="center pb-14 text-center">
        <h1 className="font-mono text-[1.9rem] leading-[1.2] font-bold tracking-[-0.02em] sm:text-[2.4rem]">
          {t("title")}
        </h1>
      </section>

      <section className="center border-t border-line py-14">
        <ContactFlow
          copy={t.raw("flow") as FlowCopy}
          errors={errors}
          maxName={LIMITS.name}
          maxEmail={LIMITS.email}
          maxMessage={LIMITS.message}
          turnstileSiteKey={turnstileSiteKey}
        />
      </section>

      <section className="center border-t border-line py-14">
        <h2 className="mb-8 text-center text-[1.25em] font-semibold">
          {t("processTitle")}
        </h2>

        {/* Four steps as cards: one column on phones, two from sm up. The
            red sparkle and mono number tie it to the tags on the home page. */}
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <li key={step.label} className="info-card flex flex-col rounded-md p-6">
              <div className="mb-4 flex items-center gap-2">
                <SparkleStar className="h-3 w-3 shrink-0 text-[#ff0000]" />
                <span className="font-mono text-[0.7em] text-muted">{step.label}</span>
              </div>
              <h3 className="font-mono text-[0.95em] font-bold">{step.title}</h3>
              <p className="mt-2 text-[0.8em] text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
