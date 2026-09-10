"use client";

import { useState } from "react";

/**
 * The mascot's hover shake, triggered via a class rather than plain CSS
 * `:hover` — a `:hover`-gated animation cuts off the instant the cursor
 * leaves, snapping back mid-shake. Adding the class on enter and only
 * clearing it on `animationend` lets a shake that's already started always
 * finish, even after the mouse has moved away.
 */
export default function HeroPortrait({ className }: { className: string }) {
  const [shaking, setShaking] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a local
    // decorative SVG, not a photo that needs next/image's srcset.
    <img
      src="/lucia-portrait.svg"
      alt=""
      aria-hidden="true"
      onMouseEnter={() => setShaking(true)}
      onAnimationEnd={() => setShaking(false)}
      className={`${className} ${shaking ? "is-shaking" : ""}`}
    />
  );
}
