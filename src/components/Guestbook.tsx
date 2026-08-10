import { getFormatter, getTranslations } from "next-intl/server";
import SignForm from "@/components/SignForm";
import { listEntries, LIMITS } from "@/lib/guestbook";

/** Paper tints and tilts, cycled so the rail does not look mechanical. */
const tints = ["#fdf6e3", "#f2f6ee", "#fbeff1", "#eef3f8"];
const rotations = ["-1.6deg", "2.1deg", "-0.9deg", "1.4deg"];

export default async function Guestbook() {
  const t = await getTranslations("guestbook");
  const format = await getFormatter();
  const entries = await listEntries();

  const labels = {
    name: t("formName"),
    message: t("formMessage"),
    submit: t("formSubmit"),
    sending: t("formSending"),
    done: t("formDone"),
    errorInvalid: t("errorInvalid"),
    errorRate: t("errorRate"),
    errorOffline: t("errorOffline"),
    errorGeneric: t("errorGeneric"),
  };

  return (
    <section className="reveal pb-20">
      <div className="center">
        <h2 className="mb-6 text-[1.25em] font-semibold">{t("title")}</h2>
      </div>

      {entries.length === 0 ? (
        <div className="center">
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
        </div>
      ) : (
        <ul className="rail px-9">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="notecard flex w-[300px] flex-col justify-between border border-line p-5 sm:w-[380px]"
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

      <div className="center">
        <SignForm
          labels={labels}
          maxName={LIMITS.name}
          maxMessage={LIMITS.message}
        />
      </div>
    </section>
  );
}
