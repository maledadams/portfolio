"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Reveals every `.reveal` section once it reaches the lower part of the
 * viewport.
 *
 * This checks positions directly rather than using IntersectionObserver:
 * an observer silently misses elements that a fast or programmatic scroll
 * jumps straight past, which left sections stuck invisible. A rAF-throttled
 * pass over a handful of nodes is cheap and cannot miss.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = new Set(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"),
    );
    if (pending.size === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    let frame = 0;

    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.92;
      for (const node of pending) {
        if (node.getBoundingClientRect().top < limit) {
          node.classList.add("is-visible");
          pending.delete(node);
        }
      }
      if (pending.size === 0) stop();
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(check);
    };

    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();

    return stop;
  }, [pathname]);

  return null;
}
