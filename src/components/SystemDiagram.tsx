import type { Accent } from "./Window";

/** A stage is one box, or a set of parallel boxes the flow splits into. */
export type Stage = string | string[];

const accentBg: Record<Accent, string> = {
  pink: "bg-pink",
  blue: "bg-blue",
  tangerine: "bg-tangerine",
  lime: "bg-lime",
  butter: "bg-butter",
};

/** Horizontal centres of a 3-column grid, accounting for the gap. */
const COLS = [16.4, 50, 83.6];

function Arrow({ left }: { left: number }) {
  return (
    <span
      className="absolute h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-ink"
      style={{ left: `${left}%`, top: "25px" }}
    />
  );
}

function Stem({
  left,
  top,
  height,
}: {
  left: number;
  top: number;
  height: number;
}) {
  return (
    <span
      className="absolute w-[3px] -translate-x-1/2 bg-ink"
      style={{ left: `${left}%`, top: `${top}px`, height: `${height}px` }}
    />
  );
}

/**
 * The join between two stages. A branch gets a real fan so the diagram does
 * not imply the flow only reaches the middle box.
 */
function Connector({ mode }: { mode: "line" | "split" | "merge" }) {
  if (mode === "line") {
    return (
      <div aria-hidden="true" className="relative h-8">
        <Stem left={50} top={0} height={25} />
        <Arrow left={50} />
      </div>
    );
  }

  if (mode === "split") {
    return (
      <div aria-hidden="true" className="relative h-8">
        <Stem left={50} top={0} height={12} />
        <span
          className="absolute h-[3px] bg-ink"
          style={{ left: `${COLS[0]}%`, right: `${COLS[0]}%`, top: "12px" }}
        />
        {COLS.map((c) => (
          <Stem key={c} left={c} top={12} height={13} />
        ))}
        {COLS.map((c) => (
          <Arrow key={c} left={c} />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="relative h-8">
      {COLS.map((c) => (
        <Stem key={c} left={c} top={0} height={13} />
      ))}
      <span
        className="absolute h-[3px] bg-ink"
        style={{ left: `${COLS[0]}%`, right: `${COLS[0]}%`, top: "10px" }}
      />
      <Stem left={50} top={10} height={15} />
      <Arrow left={50} />
    </div>
  );
}

function Box({ label, accent }: { label: string; accent: Accent }) {
  return (
    <div
      className={`bevel-btn flex min-h-[44px] items-center justify-center border-[3px] border-ink px-3 py-2 text-center text-sm font-semibold ${accentBg[accent]}`}
    >
      {label}
    </div>
  );
}

/**
 * A project's real architecture drawn as connected boxes. This is an
 * information graphic of a system that exists, not decoration and not a
 * mock of the product's interface.
 */
export default function SystemDiagram({
  stages,
  accent,
  caption,
}: {
  stages: Stage[];
  accent: Accent;
  caption: string;
}) {
  return (
    <figure className="m-0">
      <figcaption className="mb-4 font-chrome text-[10px] tracking-wide text-ink/60">
        {caption}
      </figcaption>

      {stages.map((stage, i) => {
        const prev = stages[i - 1];
        const mode =
          i === 0
            ? null
            : Array.isArray(stage) && !Array.isArray(prev)
              ? "split"
              : !Array.isArray(stage) && Array.isArray(prev)
                ? "merge"
                : "line";

        return (
          <div key={i}>
            {mode && <Connector mode={mode} />}
            {Array.isArray(stage) ? (
              <div className="grid grid-cols-3 gap-2">
                {stage.map((label) => (
                  <Box key={label} label={label} accent={accent} />
                ))}
              </div>
            ) : (
              <Box label={stage} accent={accent} />
            )}
          </div>
        );
      })}
    </figure>
  );
}
