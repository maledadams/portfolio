"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** When false, the image sits still at the top instead of auto-scrolling
   * — used by CyclingScreenshot to keep an off-screen face parked at its
   * start position so it never drifts out of sync with the one on screen. */
  active?: boolean;
  /** Fires once this slide has had its moment: right when the scroll loop
   * completes a full down-and-back cycle, or after a fixed beat for a page
   * too short to scroll. Only ever fires while `active`. */
  onCycleComplete?: () => void;
  /** Reports whether the image for the *current* `src` has actually
   * finished loading. False the instant `src` changes, true once it's
   * fully decoded. CyclingScreenshot uses this to hold off revealing a
   * hidden face until its image is really ready — swapping `src` on an
   * already-mounted `<img>` keeps the previous picture on screen until the
   * new one loads, so without this gate a still-loading multi-megabyte
   * screenshot would flash the stale one from two slides ago. */
  onReadyChange?: (ready: boolean) => void;
};

/** How long a page too short to scroll stays up before CyclingScreenshot
 * moves on — there's no scroll-loop animation to time the beat off. */
const NO_SCROLL_HOLD_MS = 6000;

/** Target glide speed in rendered px/s. The keyframes (globals.css) spend
 * 38% of the total duration on each glide, so the total loop length is
 * derived from this so a very long page (e.g. a catalog with dozens of
 * products) doesn't get dragged through at the same fixed duration as a
 * short one — that mismatch is what made tall pages look like they were
 * flying past their own content ("overshooting"). */
const SCROLL_PX_PER_SEC = 100;
const GLIDE_FRACTION = 0.38;
const MIN_DURATION_MS = 16000;
const MAX_DURATION_MS = 48000;

/**
 * A full-page screenshot auto-scrolling inside a fixed-size viewport: down
 * to the bottom, a beat to look at it, back up to the top, repeat. The
 * container's size comes entirely from `className` (unchanged from a plain
 * static image) — only the image inside it moves.
 */
export default function ScrollingScreenshot({
  src,
  alt,
  className = "",
  active = true,
  onCycleComplete,
  onReadyChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    onReadyChange?.(false);

    const measure = () => {
      const containerHeight = container.getBoundingClientRect().height;
      const imgHeight = img.getBoundingClientRect().height;
      const distance = imgHeight - containerHeight;
      if (distance > 4) {
        container.style.setProperty("--scroll-distance", `-${distance}px`);
        const glideMs = (distance / SCROLL_PX_PER_SEC) * 1000;
        const totalMs = Math.min(
          MAX_DURATION_MS,
          Math.max(MIN_DURATION_MS, glideMs / GLIDE_FRACTION),
        );
        container.style.setProperty("--scroll-duration", `${totalMs}ms`);
        setCanScroll(true);
      } else {
        setCanScroll(false);
      }
      setMeasured(true);
      onReadyChange?.(true);
    };

    if (img.complete) measure();
    else img.addEventListener("load", measure, { once: true });

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(img);
    return () => ro.disconnect();
  }, [src, onReadyChange]);

  const shouldAnimate = canScroll && active;

  // Each screenshot is a different height, so the moment its own scroll loop
  // actually finishes varies too — wait for the real DOM signal (an
  // animation iteration, or a fixed beat when there's nothing to scroll)
  // instead of guessing a single duration that fits every page.
  useEffect(() => {
    if (!active || !measured || !onCycleComplete) return;

    if (canScroll) {
      const img = imgRef.current;
      if (!img) return;
      const handleIteration = () => onCycleComplete();
      img.addEventListener("animationiteration", handleIteration);
      return () => img.removeEventListener("animationiteration", handleIteration);
    }

    const id = setTimeout(onCycleComplete, NO_SCROLL_HOLD_MS);
    return () => clearTimeout(id);
  }, [active, measured, canScroll, onCycleComplete]);

  return (
    <div ref={containerRef} className={`scroll-shot ${shouldAnimate ? "can-scroll" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- must render
          at its natural height (taller than the container) so the scroll
          animation has somewhere to go; next/image's fixed intrinsic box
          fights that. */}
      <img ref={imgRef} src={src} alt={alt} loading="lazy" />
    </div>
  );
}
