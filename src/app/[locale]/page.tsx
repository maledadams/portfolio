import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TitleBlock from "@/components/TitleBlock";
import Legend from "@/components/Legend";

type Note = { label: string; body: string };
type LegendItem = { term: string; detail: string };

export default function HomePage() {
  const t = useTranslations("home");
  const tb = useTranslations("titleblock");
  const notes = t.raw("positioning.notes") as Note[];
  const legendItems = t.raw("legend.items") as LegendItem[];

  return (
    <>
      {/* Hero: the set's title sheet */}
      <section className="pt-10 sm:pt-14">
        <TitleBlock
          sheet="A-1"
          title={t("sheetTitle")}
          meta={[
            { k: tb("drawnBy"), v: "LUCIA ADAMS" },
            { k: tb("date"), v: "2026" },
            { k: tb("scale"), v: "1:1" },
          ]}
          spine
        />

        <div className="grid grid-cols-1 gap-10 py-14 sm:py-20 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="max-w-[24ch] text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] xl:text-6xl">
              {t("headline1")}
              <br />
              <span className="text-cyan">{t("headline2")}</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-dim sm:text-lg">
              {t("sub")}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block border border-amber bg-amber px-6 py-3 font-mono text-sm tracking-[0.1em] text-deep transition-transform hover:bg-transparent hover:text-amber active:translate-y-px"
            >
              {t("cta")}
            </Link>
          </div>

          {/* Sheet index: functional navigation, drawn like a drawing-set index */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="border border-line font-mono">
              <div className="border-b border-line px-4 py-2.5 text-[10px] tracking-[0.2em] text-dim">
                {t("index.title")}
              </div>
              {(
                [
                  ["A-1", t("index.a1"), "/", true],
                  ["A-2", t("index.a2"), "/work", false],
                  ["A-3", t("index.a3"), "/contact", false],
                ] as const
              ).map(([code, label, href, current]) => (
                <Link
                  key={code}
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className="group flex items-center gap-4 border-b border-line px-4 py-3.5 last:border-b-0"
                >
                  <span className="text-cyan">{code}</span>
                  <span className="flex-1 text-sm text-ink group-hover:text-cyan">
                    {label}
                  </span>
                  {current && (
                    <span className="text-[10px] tracking-[0.14em] text-amber">
                      {t("index.current")}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* General notes: the positioning pitch as drawing annotations */}
      <section className="py-14 sm:py-20">
        <TitleBlock sheet="A-1.1" title={t("positioning.sheetTitle")} spine />
        <div className="grid grid-cols-1 gap-10 pt-12 md:grid-cols-12">
          {notes.map((note, i) => (
            <div
              key={note.label}
              className={
                [
                  "md:col-span-5",
                  "md:col-span-4 md:mt-10",
                  "md:col-span-3 md:mt-20",
                ][i]
              }
            >
              <div className="border-l-2 border-cyan pl-5">
                <span className="font-mono text-[11px] tracking-[0.16em] text-dim">
                  N-{i + 1}
                </span>
                <h2 className="mt-2 text-lg font-medium text-ink">
                  {note.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-dim">
                  {note.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities legend */}
      <section className="pb-20 pt-6 sm:pb-28">
        <TitleBlock sheet="A-1.2" title={t("legend.sheetTitle")} spine />
        <div className="pt-10">
          <Legend items={legendItems} />
        </div>
      </section>
    </>
  );
}
