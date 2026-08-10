"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import type { Project } from "@/data/projects";

type Callout = { label: string; body: string };

type Props = {
  project: Project;
  index: string;
  name: string;
  type: string;
  alt: string;
  sheetLabel: string;
  surfaceLabel: string;
  systemsLabel: string;
  visitLabel: string;
  callouts: { surface: Callout[]; systems: Callout[] };
};

type Mode = "surface" | "systems";

/** Vertical slots (in % of image height) where the leader lines land. */
const SLOTS = [18, 50, 82];

/** The screenshot aspect is 1440x900, so the viewBox is 100 x 62.5. */
const VB_H = 62.5;

export default function DrawingSheet({
  project,
  index,
  name,
  type,
  alt,
  sheetLabel,
  surfaceLabel,
  systemsLabel,
  visitLabel,
  callouts,
}: Props) {
  const [mode, setMode] = useState<Mode>("surface");
  const reduce = useReducedMotion();

  const accent = mode === "systems" ? "var(--color-amber)" : "var(--color-cyan)";
  const accentText = mode === "systems" ? "text-amber" : "text-cyan";
  const accentBorder = mode === "systems" ? "border-amber" : "border-cyan";
  const points = project.points[mode];
  const items = callouts[mode];

  // Land each leader line at the slot matching its target's vertical rank,
  // so lines never cross on their way to the edge.
  const rank = points
    .map((p, i) => ({ i, y: p.y }))
    .sort((a, b) => a.y - b.y)
    .reduce<number[]>((acc, entry, r) => {
      acc[entry.i] = r;
      return acc;
    }, []);

  return (
    <article data-spine="" className="border border-line bg-sheet/60">
      {/* Sheet header */}
      <header className="flex items-stretch border-b border-line font-mono">
        <div className="flex flex-col justify-center border-r border-line px-4 py-3">
          <span className="text-[10px] tracking-[0.2em] text-dim">
            {sheetLabel}
          </span>
          <span className="text-xl leading-none text-cyan">{index}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-3">
          <h3 className="text-sm tracking-[0.18em] text-ink">{name}</h3>
          <p className="text-[11px] tracking-wide text-dim">{type}</p>
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 border-l border-line px-4 text-[11px] tracking-[0.12em] text-dim transition-colors hover:text-cyan sm:flex"
        >
          {visitLabel}
          <ArrowUpRightIcon size={14} weight="light" />
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Annotated screenshot */}
        <div className="relative border-b border-line lg:col-span-8 lg:border-b-0 lg:border-r">
          <Image
            src={project.image}
            alt={alt}
            width={1440}
            height={900}
            className="block h-auto w-full opacity-90"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />

          {/* Leader lines, keyed by mode so they redraw on toggle */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 100 ${VB_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <AnimatePresence mode="wait">
              <motion.g key={mode}>
                {points.map((p, i) => (
                  <motion.line
                    key={i}
                    x1={p.x}
                    y1={(p.y * VB_H) / 100}
                    x2={94}
                    y2={(SLOTS[rank[i]] * VB_H) / 100}
                    stroke={accent}
                    strokeWidth="1.2"
                    vectorEffect="non-scaling-stroke"
                    initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.09 }}
                  />
                ))}
              </motion.g>
            </AnimatePresence>
          </svg>

          {/* Target markers */}
          {points.map((p, i) => (
            <span
              key={`${mode}-m-${i}`}
              className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border ${accentBorder} bg-deep/40`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-hidden="true"
            />
          ))}

          {/* Index chips where the leader lines land */}
          {points.map((_, i) => (
            <span
              key={`${mode}-c-${i}`}
              className={`absolute right-1.5 flex h-5 w-5 -translate-y-1/2 items-center justify-center border bg-deep/80 font-mono text-[10px] ${accentBorder} ${accentText}`}
              style={{ top: `${SLOTS[rank[i]]}%` }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* Rail: toggle + callout schedule */}
        <div className="flex flex-col lg:col-span-4">
          <div
            className="m-4 flex border border-line font-mono text-[11px] tracking-[0.14em]"
            role="tablist"
            aria-label={`${name}: ${surfaceLabel} / ${systemsLabel}`}
          >
            {(
              [
                ["surface", surfaceLabel],
                ["systems", systemsLabel],
              ] as const
            ).map(([value, label]) => {
              const active = mode === value;
              const fill =
                value === "systems"
                  ? "bg-amber text-deep"
                  : "bg-cyan text-deep";
              return (
                <button
                  key={value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(value)}
                  className={`flex-1 cursor-pointer px-3 py-2.5 transition-colors ${
                    active ? fill : "text-dim hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.ol
              key={mode}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col px-4 pb-4"
            >
              {items.map((item, i) => (
                <li
                  key={item.label}
                  className="flex gap-3 border-t border-line py-4 first:border-t-0"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[10px] ${accentBorder} ${accentText}`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-medium text-ink">
                      {item.label}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-dim">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </AnimatePresence>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-1.5 border-t border-line px-4 py-3 font-mono text-[11px] tracking-[0.12em] text-dim transition-colors hover:text-cyan sm:hidden"
          >
            {visitLabel}
            <ArrowUpRightIcon size={14} weight="light" />
          </a>
        </div>
      </div>
    </article>
  );
}
