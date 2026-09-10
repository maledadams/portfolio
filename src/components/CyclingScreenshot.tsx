"use client";

import { useCallback, useEffect, useState } from "react";
import ScrollingScreenshot from "./ScrollingScreenshot";

type Slide = { src: string; alt: string };
type Props = { images: Slide[]; className?: string };

/**
 * Cycles through several full-page screenshots inside one card, crossfading
 * between each. Two faces are kept permanently mounted, front and back.
 *
 * Three things have to be sequenced correctly:
 *
 * 1. A face's content is only ever touched once it's fully hidden (opacity
 *    genuinely reached 0, via `transitionend` — not just "we just told it
 *    to start fading out"). Reassigning a slot's image in the same render
 *    that starts its fade-out swaps its content instantly (a `src` change
 *    can't itself be animated), so for a moment it's still fully opaque but
 *    showing the *next* slide's picture — a hard, un-faded flash of the
 *    wrong screenshot right before the real fade.
 * 2. Revealing a face (flipping it to front) waits for its *own* picture to
 *    have actually finished loading — these screenshots run several
 *    megabytes each, and swapping `src` on an already-mounted `<img>`
 *    leaves the previous picture showing until the new one loads.
 * 3. Each face's own scroll loop is only ever running while that face is
 *    both the current front *and* has finished fading all the way in.
 *    Going the other way is immediate: the moment a face stops being
 *    front, its scroll loop stops right then, frozen in place, rather than
 *    continuing to glide through its own fade-out — otherwise it could
 *    still be moving for the last sliver of its fade, and the next time
 *    it's revealed it wouldn't be resting cleanly at the top. Coming back
 *    in is the deliberately slower half: the crossfade takes 1.8s, and a
 *    page with a short scroll distance has a top-hold shorter than that,
 *    so starting the loop immediately on becoming front made it look like
 *    it jumped straight into motion instead of resting at the top. Each
 *    face's `revealed` flag only flips true once its own fade-in
 *    `transitionend` fires, and flips false the instant it stops being
 *    front, so both directions are always bound to that face's own real
 *    animation state, not a shared guess.
 *
 * Advancing is driven by the front face telling us when its own scroll
 * loop finishes a cycle (each screenshot is a different height, so that
 * moment differs per slide) rather than a shared timer guessing when
 * everyone's done.
 */
export default function CyclingScreenshot({ images, className = "" }: Props) {
  const n = images.length;
  const [frontIsA, setFrontIsA] = useState(true);
  const [revealedA, setRevealedA] = useState(true);
  const [revealedB, setRevealedB] = useState(false);
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(n > 1 ? 1 % n : 0);
  const [readyA, setReadyA] = useState(false);
  const [readyB, setReadyB] = useState(false);
  const [pendingFlip, setPendingFlip] = useState(false);

  const frontIndex = frontIsA ? indexA : indexB;
  const backReady = frontIsA ? readyB : readyA;

  useEffect(() => {
    if (pendingFlip && backReady) {
      setPendingFlip(false);
      // The outgoing face stops scrolling immediately, frozen right where
      // it is — it's normally already at rest (its own cycle just
      // completed, which is what triggered this flip), so this mostly
      // guards the case where the flip was held up waiting on backReady.
      if (frontIsA) setRevealedA(false);
      else setRevealedB(false);
      setFrontIsA((f) => !f);
    }
  }, [pendingFlip, backReady, frontIsA]);

  const advance = useCallback(() => setPendingFlip(true), []);
  const onReadyA = useCallback((r: boolean) => setReadyA(r), []);
  const onReadyB = useCallback((r: boolean) => setReadyB(r), []);

  const handleTransitionEnd = useCallback(
    (slot: "A" | "B") => (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "opacity" || e.target !== e.currentTarget) return;
      const isNowFront = slot === "A" ? frontIsA : !frontIsA;
      if (isNowFront) {
        if (slot === "A") setRevealedA(true);
        else setRevealedB(true);
        return;
      }
      const nextIndex = (frontIndex + 1) % n;
      if (slot === "A") setIndexA(nextIndex);
      else setIndexB(nextIndex);
    },
    [frontIsA, frontIndex, n],
  );

  if (n <= 1) {
    const only = images[0];
    return only ? (
      <ScrollingScreenshot src={only.src} alt={only.alt} className={className} />
    ) : null;
  }

  return (
    <div className={`fade-shot ${className}`}>
      <div
        className={`fade-shot-face ${frontIsA ? "is-front" : ""}`}
        onTransitionEnd={handleTransitionEnd("A")}
      >
        <ScrollingScreenshot
          src={images[indexA].src}
          alt={images[indexA].alt}
          className="h-full w-full"
          active={frontIsA && revealedA}
          onCycleComplete={advance}
          onReadyChange={onReadyA}
        />
      </div>
      <div
        className={`fade-shot-face ${frontIsA ? "" : "is-front"}`}
        onTransitionEnd={handleTransitionEnd("B")}
      >
        <ScrollingScreenshot
          src={images[indexB].src}
          alt={images[indexB].alt}
          className="h-full w-full"
          active={!frontIsA && revealedB}
          onCycleComplete={advance}
          onReadyChange={onReadyB}
        />
      </div>
    </div>
  );
}
