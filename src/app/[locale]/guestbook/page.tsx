import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import SignForm from "@/components/SignForm";
import { listEntries, LIMITS } from "@/lib/guestbook";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { localizedUrl, languageAlternates } from "@/lib/seo";

/** Paper tints and tilts, cycled so the grid does not look mechanical. */
const tints = ["#fdf6e3", "#f2f6ee", "#fbeff1", "#eef3f8"];
const rotations = ["-1.6deg", "2.1deg", "-0.9deg", "1.4deg"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guestbook" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: localizedUrl(locale as "es" | "en", "/guestbook"),
      languages: languageAlternates("/guestbook"),
    },
  };
}

export default async function GuestbookPage() {
  const t = await getTranslations("guestbook");
  const format = await getFormatter();
  const entries = await listEntries();
  const turnstileSiteKey = await getTurnstileSiteKey();

  const labels = {
    name: t("formName"),
    message: t("formMessage"),
    submit: t("formSubmit"),
    sending: t("formSending"),
    done: t("formDone"),
    errorInvalid: t("errorInvalid"),
    errorTurnstile: t("errorTurnstile"),
    errorRate: t("errorRate"),
    errorOffline: t("errorOffline"),
    errorGeneric: t("errorGeneric"),
    previewTitle: t("previewTitle"),
    previewEmptyName: t("previewEmptyName"),
    previewEmptyMessage: t("previewEmptyMessage"),
  };

  return (
    <section className="reveal mx-auto max-w-[1100px] px-9 pb-20">
      <h1 className="text-[1.9rem] leading-[1.2] font-normal tracking-[-0.02em] sm:text-[2.4rem]">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-[52ch] text-muted">{t("intro")}</p>

      <div className="mt-10">
        <SignForm
          labels={labels}
          maxName={LIMITS.name}
          maxMessage={LIMITS.message}
          turnstileSiteKey={turnstileSiteKey}
        />
      </div>

      <div className="mt-16">
        {entries.length === 0 ? (
          <div
            className="notecard flex max-w-[380px] flex-col justify-between border border-line p-5"
            style={{
              ["--rotation" as string]: rotations[0],
              ["--note-tint" as string]: tints[0],
            }}
          >
            <p className="font-mono text-[0.66em] leading-relaxed whitespace-pre-line text-[#111]">
              {t("emptyNote")}
            </p>
            <p className="mt-4 text-right font-mono text-[0.6em] text-[#111]/60">
              {t("emptyCredit")}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => (
              <li
                key={entry.id}
                className="notecard flex flex-col justify-between border border-line p-5"
                style={{
                  ["--rotation" as string]: rotations[i % rotations.length],
                  ["--note-tint" as string]: tints[i % tints.length],
                }}
              >
                <p className="font-mono text-[0.66em] leading-relaxed whitespace-pre-line text-[#111]">
                  {entry.message}
                </p>
                <p className="mt-4 text-right font-mono text-[0.6em] text-[#111]/60">
                  {entry.name}
                  <br />
                  {format.dateTime(new Date(`${entry.created_at}Z`), {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
