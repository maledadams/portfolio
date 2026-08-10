import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Window from "@/components/Window";

type Segment = { t: string; mark?: "lime" | "butter" };
type Note = { label: string; body: string };
type Skill = { term: string; detail: string };

/** Sticker pills get varied tilts and fills so the group reads as scattered. */
const pillStyle = [
  { bg: "bg-pink", tilt: "-rotate-2" },
  { bg: "bg-butter", tilt: "rotate-1" },
  { bg: "bg-blue", tilt: "rotate-2" },
  { bg: "bg-lime", tilt: "-rotate-1" },
  { bg: "bg-tangerine", tilt: "rotate-1" },
  { bg: "bg-butter", tilt: "-rotate-2" },
];

export default function HomePage() {
  const t = useTranslations("home");
  const nav = useTranslations("nav");
  const statement = t.raw("about.statement") as Segment[];
  const notes = t.raw("about.notes") as Note[];
  const skills = t.raw("skills.items") as Skill[];

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <Window
        title={t("windowTitle")}
        accent="butter"
        status={t("status")}
        className="lg:mr-4"
      >
        <div className="p-6 sm:p-9">
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("headline1")}
            <br />
            {t("headline2")}
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink/75 sm:text-lg">
            {t("sub")}
          </p>
          <Link
            href="/contact"
            className="press mt-7 inline-block rounded-full border-[3px] border-ink bg-tangerine px-7 py-3 text-base font-bold"
          >
            {nav("cta")}
          </Link>
        </div>
      </Window>

      <Window
        title={t("about.windowTitle")}
        accent="lime"
        className="lg:ml-8"
      >
        <div className="p-6 sm:p-9">
          <p className="font-display text-2xl leading-[1.35] font-bold sm:text-3xl sm:leading-[1.35]">
            {statement.map((seg, i) =>
              seg.mark ? (
                <span
                  key={i}
                  className="mark"
                  style={{ ["--mark" as string]: `var(--color-${seg.mark})` }}
                >
                  {seg.t}
                </span>
              ) : (
                <span key={i}>{seg.t}</span>
              ),
            )}
          </p>

          <div className="rule my-7" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {notes.map((note, i) => (
              <div
                key={note.label}
                className={
                  ["md:col-span-5", "md:col-span-4 md:mt-8", "md:col-span-3"][i]
                }
              >
                <h2 className="font-display text-lg font-bold">{note.label}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Window>

      <Window
        title={t("skills.windowTitle")}
        accent="blue"
        status={t("skills.status")}
        className="lg:mr-10"
      >
        <div className="flex flex-wrap items-start gap-3 p-6 sm:p-8">
          {skills.map((skill, i) => (
            <span
              key={skill.term}
              className={`shell !shadow-[4px_4px_0_var(--color-ink)] px-4 py-2.5 ${pillStyle[i].bg} ${pillStyle[i].tilt}`}
            >
              <span className="block text-sm font-bold">{skill.term}</span>
              <span className="block text-xs text-ink/70">{skill.detail}</span>
            </span>
          ))}
        </div>
      </Window>
    </div>
  );
}
