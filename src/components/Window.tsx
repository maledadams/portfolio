export type Accent = "pink" | "blue" | "tangerine" | "lime" | "butter";

const accentBg: Record<Accent, string> = {
  pink: "bg-pink",
  blue: "bg-blue",
  tangerine: "bg-tangerine",
  lime: "bg-lime",
  butter: "bg-butter",
};

type Props = {
  /** ASCII-only: this renders in the pixel face, which lacks accents. */
  title: string;
  accent?: Accent;
  status?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * The site's one structural frame. A 3px ink outline plus a hard offset
 * shadow reads as old chrome and as a sticker at once, which is what lets
 * the old-web and collage languages sit together.
 *
 * Deliberately static: no drag, no controls. Every window is exactly where
 * the layout puts it, so nothing on the page can be moved out of alignment.
 */
export default function Window({
  title,
  accent = "butter",
  status,
  className = "",
  children,
}: Props) {
  return (
    <section className={`shell bg-paper ${className}`}>
      <div
        className={`border-b-[3px] border-ink px-4 py-2 ${accentBg[accent]}`}
      >
        <span className="block truncate font-chrome text-[11px] tracking-wide text-ink">
          {title}
        </span>
      </div>

      <div>{children}</div>

      {status && (
        <div className="bevel-down flex items-center border-t-[3px] border-ink bg-shade px-4 py-1.5">
          <span className="truncate font-chrome text-[10px] text-ink/70">
            {status}
          </span>
        </div>
      )}
    </section>
  );
}
