"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type SquiggleColor = "green" | "red" | "blue" | "gray";
export type HeroSegment = {
  t: string;
  strong?: boolean;
  squiggle?: boolean;
  squiggleColor?: SquiggleColor;
  href?: string;
};

const squiggleColors: Record<SquiggleColor, string> = {
  green: "#2ee66d",
  red: "#ff4040",
  blue: "#3aa0ff",
  gray: "#b4b4b4",
};

/** Characters per millisecond, inverted — how long each letter takes to
 * appear. Fast enough to read as "smooth motion" rather than "waiting for
 * text", slow enough to still register as typing rather than a flash. */
const MS_PER_CHAR = 20;

function renderSegments(
  segments: HeroSegment[],
  visible: number,
  done: boolean,
  ghost: boolean,
) {
  let consumed = 0;

  return segments.map((seg, i) => {
    const start = consumed;
    consumed += seg.t.length;
    const shown = ghost ? seg.t.length : Math.max(0, Math.min(seg.t.length, visible - start));
    const text = seg.t.slice(0, shown);
    const cursorHere = !ghost && !done && visible >= start && visible < consumed;

    const content = (
      <>
        {text}
        {cursorHere && <span className="typewriter-cursor" aria-hidden="true" />}
      </>
    );

    if (seg.href) {
      return (
        <Link
          key={i}
          href={seg.href as "/contact"}
          tabIndex={ghost ? -1 : undefined}
          className="font-semibold underline decoration-2 underline-offset-[7px] transition-colors hover:text-muted"
        >
          {content}
        </Link>
      );
    }
    if (seg.squiggle) {
      const color = seg.squiggleColor ? squiggleColors[seg.squiggleColor] : undefined;
      return (
        <span
          key={i}
          className="squiggle"
          style={color ? ({ "--squiggle-color": color } as React.CSSProperties) : undefined}
        >
          {content}
        </span>
      );
    }
    return <span key={i}>{content}</span>;
  });
}

/**
 * Types the hero line out character by character on mount, driven by
 * requestAnimationFrame (not setInterval) so the reveal rate stays tied to
 * real elapsed time and never drifts or chunks under load. Segment
 * formatting (the bold contact link, the squiggle) is preserved exactly —
 * only how much of each segment's text is currently visible changes.
 *
 * The growing line would otherwise reflow its own line count as it types,
 * dragging everything below it down and up along the way. A full-length
 * invisible copy is stacked underneath (same grid cell) to reserve the
 * final height up front, so the page around it never moves during typing.
 */
export default function TypewriterHero({ segments }: { segments: HeroSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.t.length, 0);
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(total);
      setDone(true);
      return;
    }

    setVisible(0);
    setDone(false);
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const count = Math.min(total, Math.floor(elapsed / MS_PER_CHAR));
      setVisible(count);
      if (count < total) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [total]);

  return (
    <span className="typewriter-stack">
      <span className="typewriter-ghost" aria-hidden="true">
        {renderSegments(segments, total, true, true)}
      </span>
      <span className="typewriter-live">{renderSegments(segments, visible, done, false)}</span>
    </span>
  );
}
