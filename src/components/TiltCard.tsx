"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Maximum rotation in degrees at the card's edges. */
  maxTilt?: number;
  holo?: "none" | "rare" | "legendary";
  className?: string;
  children: React.ReactNode;
};

/**
 * Tilts its content toward the cursor with a moving glare, the way collectible
 * cards behave in card games. All per-frame work happens through CSS custom
 * properties written inside requestAnimationFrame; React state is never
 * touched during pointer movement, so scrolling stays smooth.
 *
 * Inert on touch devices and under reduced motion: pointers that can't hover
 * get a plain card, not a broken effect.
 */
export default function TiltCard({
  maxTilt = 8,
  holo = "none",
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rect: DOMRect | null = null;
    let px = 0.5;
    let py = 0.5;

    const paint = () => {
      frame.current = 0;
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.classList.add("tilting");
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) rect = el.getBoundingClientRect();
      px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      if (!frame.current) frame.current = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      rect = null;
      el.classList.remove("tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [maxTilt]);

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      data-holo={holo === "none" ? undefined : holo}
    >
      <div className="tilt-inner">
        {children}
        <span className="tilt-glare" aria-hidden />
        {holo !== "none" && <span className="tilt-holo" aria-hidden />}
      </div>
    </div>
  );
}
