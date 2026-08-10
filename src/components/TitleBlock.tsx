import { useTranslations } from "next-intl";

type Props = {
  sheet: string;
  title: string;
  /** Extra key/value cells on the right side. */
  meta?: { k: string; v: string }[];
  spine?: boolean;
};

/**
 * The stamped info box every real blueprint carries. Used as each
 * section's header instead of a generic label.
 */
export default function TitleBlock({ sheet, title, meta, spine }: Props) {
  const t = useTranslations("titleblock");

  return (
    <div
      data-spine={spine ? "" : undefined}
      className="flex items-stretch border border-line font-mono"
    >
      <div className="flex flex-col justify-center border-r border-line px-4 py-3">
        <span className="text-[10px] tracking-[0.2em] text-dim">
          {t("sheet")}
        </span>
        <span className="text-xl leading-none text-cyan">{sheet}</span>
      </div>
      <div className="flex flex-1 items-center px-4 py-3">
        <span className="text-[11px] tracking-[0.22em] text-ink sm:text-xs">
          {title}
        </span>
      </div>
      {meta && (
        <div className="hidden flex-col justify-center gap-1 border-l border-line px-4 py-3 sm:flex">
          {meta.map((row) => (
            <div key={row.k} className="flex gap-3 text-[10px] tracking-[0.14em]">
              <span className="text-dim">{row.k}</span>
              <span className="text-ink">{row.v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
