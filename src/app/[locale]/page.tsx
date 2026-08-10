import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Window from "@/components/Window";

type Segment = { t: string; mark?: "lime" | "butter" };
type Note = { label: string; body: string };
type Skill = { term: string; detail: string };

/** Fills rotate so the grid has colour rhythm while staying aligned. */
const pillBg = [
  "bg-pink",
  "bg-butter",
  "bg-blue",
  "bg-lime",
  "bg-tangerine",
  "bg-butter",
];

export default function HomePage() {
  const t = useTranslations("home");
  const nav = useTranslations("nav");
  const statement = t.raw("about.statement") as Segment[];
  const notes = t.raw("about.notes") as Note[];
  const skills = t.raw("skills.items") as Skill[];

  return (
    <div className="flex flex-col gap-7 sm:gap-9">
      <Window title={t("windowTitle")} accent="butter" status={t("status")}>
        <div className="p-6 sm:p-10">
          <h1 className="font-display text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            {t("headline1")}
            <br />
            {t("headline2")}
          </h1>

          <div className="mt-8 flex flex-col gap-5 border-t-[3px] border-ink pt-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <p className="max-w-[70ch] text-base leading-relaxed text-ink/75 sm:text-lg">
              {t("sub")}
            </p>
            <Link
              href="/contact"
              className="press shrink-0 self-start border-[3px] border-ink bg-tangerine px-8 py-3.5 text-base font-bold md:self-auto"
            >
              {nav("cta")}
            </Link>
          </div>
        </div>
      </Window>

      <Window title={t("about.windowTitle")} accent="lime">
        <div className="p-6 sm:p-10">
          <p className="font-display text-2xl leading-[1.35] font-bold sm:text-3xl sm:leading-[1.35] lg:text-4xl lg:leading-[1.3]">
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

          <div className="rule my-8" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {notes.map((note) => (
              <div key={note.label}>
                <h2 className="font-display text-xl font-bold">{note.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
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
      >
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
          {skills.map((skill, i) => (
            <div
              key={skill.term}
              className={`border-[3px] border-ink px-5 py-4 ${pillBg[i]}`}
            >
              <span className="block text-base font-bold">{skill.term}</span>
              <span className="mt-0.5 block text-sm text-ink/70">
                {skill.detail}
              </span>
            </div>
          ))}
        </div>
      </Window>
    </div>
  );
}
