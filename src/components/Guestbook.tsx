import { useFormatter, useTranslations } from "next-intl";
import { guestbook } from "@/data/guestbook";

const EMAIL = "maledadams@gmail.com";

/** Paper tints and tilts, cycled so the rail does not look mechanical. */
const tints = ["#fdf6e3", "#f2f6ee", "#fbeff1", "#eef3f8"];
const rotations = ["-1.6deg", "2.1deg", "-0.9deg", "1.4deg"];

export default function Guestbook() {
  const t = useTranslations("guestbook");
  const format = useFormatter();
  const signHref = `mailto:${EMAIL}?subject=${encodeURIComponent(t("mailSubject"))}`;

  return (
    <section className="reveal pb-20">
      <div className="center">
        <h2 className="mb-6 text-[1.25em] font-semibold">
          {t.rich("title", {
            link: (chunks) => (
              <a href={signHref} className="link">
                {chunks}
              </a>
            ),
          })}
        </h2>
      </div>

      {guestbook.length === 0 ? (
        <div className="center">
          <div
            className="notecard flex max-w-[380px] flex-col justify-between border border-line p-5"
            style={{ ["--rotation" as string]: rotations[0], ["--note-tint" as string]: tints[0] }}
          >
            <p className="font-mono text-[0.66em] leading-relaxed whitespace-pre-line text-[#111]">
              {t("emptyNote")}
            </p>
            <p className="text-right font-mono text-[0.6em] text-[#111]/60">
              {t("emptyCredit")}
            </p>
          </div>

          <a href={signHref} className="link mt-6 inline-block font-mono text-[0.8em]">
            {t("sign")}
          </a>
        </div>
      ) : (
        <>
          <ul className="rail px-9">
            {guestbook.map((entry, i) => (
              <li
                key={`${entry.name}-${entry.date}`}
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
                  {format.dateTime(new Date(entry.date), {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </li>
            ))}
          </ul>

          <div className="center">
            <a href={signHref} className="link mt-4 inline-block font-mono text-[0.8em]">
              {t("sign")}
            </a>
          </div>
        </>
      )}
    </section>
  );
}
