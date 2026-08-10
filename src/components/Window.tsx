"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "motion/react";

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
  /** Project windows can blow up to fill the viewport. */
  maximizable?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * The site's one structural primitive. A 3px ink outline plus a hard offset
 * shadow reads as Win98 chrome and as a sticker at the same time, which is
 * what lets the old-web and collage languages sit together.
 *
 * Draggable by the titlebar on pointer-precise desktop only. Drag is additive
 * delight, never the layout: windows always sit in normal document flow.
 */
export default function Window({
  title,
  accent = "butter",
  status,
  maximizable = false,
  className = "",
  children,
}: Props) {
  const [rolled, setRolled] = useState(false);
  const [maxed, setMaxed] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const controls = useDragControls();
  const maxButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const sync = () => setCanDrag(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Escape leaves the maximized state and hands focus back to its trigger.
  useEffect(() => {
    if (!maxed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMaxed(false);
        maxButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [maxed]);

  const dragging = canDrag && !maxed;

  return (
    <motion.section
      drag={dragging}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ zIndex: 40, cursor: "grabbing" }}
      role={maxed ? "dialog" : undefined}
      aria-label={maxed ? title : undefined}
      className={`shell bg-paper ${
        maxed ? "fixed inset-3 z-50 overflow-auto sm:inset-6" : "relative"
      } ${className}`}
    >
      <div
        onPointerDown={(e) => dragging && controls.start(e)}
        className={`flex items-center gap-3 border-b-[3px] border-ink px-3 py-2 ${
          accentBg[accent]
        } ${dragging ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <span className="flex-1 truncate font-chrome text-[11px] tracking-wide text-ink select-none">
          {title}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setRolled((v) => !v)}
            aria-expanded={!rolled}
            aria-label={rolled ? `Expand ${title}` : `Collapse ${title}`}
            className="bevel-btn flex h-5 w-6 items-center justify-center border-2 border-ink bg-paper font-chrome text-[10px] leading-none text-ink"
          >
            {rolled ? "+" : "-"}
          </button>

          {maximizable && (
            <button
              ref={maxButtonRef}
              type="button"
              onClick={() => setMaxed((v) => !v)}
              aria-pressed={maxed}
              aria-label={maxed ? `Restore ${title}` : `Maximize ${title}`}
              className="bevel-btn flex h-5 w-6 items-center justify-center border-2 border-ink bg-paper font-chrome text-[10px] leading-none text-ink"
            >
              {maxed ? "▢" : "□"}
            </button>
          )}
        </div>
      </div>

      {!rolled && <div>{children}</div>}

      {!rolled && status && (
        <div className="bevel-down flex items-center border-t-[3px] border-ink bg-shade px-3 py-1.5">
          <span className="truncate font-chrome text-[10px] text-ink/70">
            {status}
          </span>
        </div>
      )}
    </motion.section>
  );
}
