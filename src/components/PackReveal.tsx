"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import TiltCard from "./TiltCard";
import type { Rarity } from "@/data/projects";

export type PackCard = {
  slug: string;
  name: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  summary: string;
  rarity: Rarity;
  rarityLabel: string;
};

type Labels = {
  packName: string;
  open: string;
  skip: string;
  next: string;
  done: string;
};

type Phase = "sealed" | "tearing" | "reveal" | "closed";

/*
 * Reduced motion is read as an external store: the server snapshot says
 * "reduced", so nothing renders on the server, and the client corrects it
 * after hydration. No setState-in-effect, no mismatch.
 */
function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

/*
 * Module scope survives client-side navigation but not a reload, so the pack
 * plays once per visit: coming back to /work from the nav skips it, while a
 * refresh or a fresh open of the site shows it again.
 */
let packShown = false;

/**
 * The /work entrance: projects arrive as a sealed pack over a darkened,
 * locked page. Opening it reveals one card at a time, with the backdrop
 * tinted by each card's rarity. Escape or "skip" drops you straight to the
 * page, and reduced-motion visitors never see the overlay at all.
 */
export default function PackReveal({
  cards,
  labels,
}: {
  cards: PackCard[];
  labels: Labels;
}) {
  const [phase, setPhase] = useState<Phase>(() => (packShown ? "closed" : "sealed"));
  const overlayRef = useRef<HTMLDivElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);
  const mounted = !usePrefersReducedMotion();

  const close = useCallback(() => setPhase("closed"), []);

  useEffect(() => {
    if (mounted) packShown = true;
  }, [mounted]);

  // Scroll lock while open.
  useEffect(() => {
    if (!mounted || phase === "closed") return;
    document.body.dataset.packOpen = "";
    return () => {
      delete document.body.dataset.packOpen;
    };
  }, [mounted, phase]);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!mounted || phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;
      const focusables = Array.from(
        overlayRef.current.querySelectorAll<HTMLElement>("button, a[href]"),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, phase, close]);

  // Keep focus on the primary control as phases change.
  useEffect(() => {
    if (phase === "reveal") advanceRef.current?.focus();
  }, [phase]);

  if (!mounted || phase === "closed") return null;

  const tear = () => {
    setPhase("tearing");
    window.setTimeout(() => setPhase("reveal"), 620);
  };

  // Portaled to <body>: the page-transition wrapper carries a transform while
  // animating, and a transformed ancestor turns position:fixed into
  // position-relative-to-the-wrapper, shifting the overlay.
  return createPortal(
    <div
      ref={overlayRef}
      className="pack-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={labels.packName}
    >
      <div
        className="rays"
        data-rarity={phase === "reveal" ? cards[0]?.rarity : undefined}
        aria-hidden
      />

      <button
        type="button"
        onClick={close}
        className="absolute top-5 right-6 z-10 font-mono text-[0.75em] text-white/60 transition-colors hover:text-white"
      >
        {labels.skip}
      </button>

      {phase !== "reveal" ? (
        <TiltCard maxTilt={14}>
          <button
            type="button"
            onClick={tear}
            disabled={phase === "tearing"}
            className={`pack ${phase === "tearing" ? "tearing" : ""}`}
            aria-label={labels.open}
          >
            <span className="pack-crimp" aria-hidden />
            <span className="pack-body">
              <img
                src="/lucia-portrait.svg"
                alt=""
                aria-hidden="true"
                className="relative w-[110px]"
              />
              <span className="relative font-mono text-[0.7em] text-white/60">
                {labels.open}
              </span>
            </span>
            <span className="pack-crimp" aria-hidden />
          </button>
        </TiltCard>
      ) : (
        <>
          {/* Every project revealed together, side by side — scales to
              however many cards `cards` holds, wrapping to a new row
              rather than needing a fixed layout for a fixed count. */}
          <div className="pcard-grid relative">
            {cards.map((card, i) => (
              <div
                key={card.slug}
                className="card-enter"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <TiltCard maxTilt={12} className="rounded-[16px]">
                  <div className="pcard" data-rarity={card.rarity}>
                    <div className="pcard-inner">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-semibold text-[0.95em] leading-tight">
                          {card.name}
                        </h3>
                        <span className="font-mono text-[0.6em] text-[#191713]/60">
                          {card.year}
                        </span>
                      </div>

                      <div className="overflow-hidden rounded-[4px] border border-[#191713]/25">
                        <Image
                          src={card.image}
                          alt={card.alt}
                          width={1440}
                          height={900}
                          className="block aspect-[1.15] h-auto w-full object-cover object-top"
                          sizes="240px"
                          priority={i < 3}
                        />
                      </div>

                      <p className="font-mono text-[0.6em] text-[#191713]/70">
                        {card.rarity === "legendary" ? "★" : "◆"} {card.rarityLabel}
                        {" · "}
                        {card.category}
                      </p>

                      <p className="mt-auto text-[0.68em] leading-snug italic">
                        {card.summary}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>

          <div className="relative">
            <button
              ref={advanceRef}
              type="button"
              onClick={close}
              className="btn-card px-5 py-2 font-mono text-[0.8em] text-white"
            >
              {labels.done}
            </button>
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
