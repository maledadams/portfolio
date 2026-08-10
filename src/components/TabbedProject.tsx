"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import Window, { type Accent } from "./Window";
import SystemDiagram, { type Stage } from "./SystemDiagram";

type Point = { label: string; body: string };

type Props = {
  fileName: string;
  label: string;
  type: string;
  accent: Accent;
  image: string;
  alt: string;
  url: string;
  stages: Stage[];
  surface: Point[];
  systems: Point[];
  labels: {
    surfaceTab: string;
    systemsTab: string;
    visit: string;
    diagramNote: string;
  };
  className?: string;
};

type Tab = "surface" | "systems";

/**
 * A project as a window with two tabs. The surface tab is the live screenshot,
 * the systems tab is the architecture running behind it. Switching swaps both
 * the visual and the three points, so one control moves the whole argument.
 */
export default function TabbedProject({
  fileName,
  label,
  type,
  accent,
  image,
  alt,
  url,
  stages,
  surface,
  systems,
  labels,
  className,
}: Props) {
  const [tab, setTab] = useState<Tab>("surface");
  const id = useId();
  const points = tab === "surface" ? surface : systems;

  const tabs: { key: Tab; text: string }[] = [
    { key: "surface", text: labels.surfaceTab },
    { key: "systems", text: labels.systemsTab },
  ];

  return (
    <Window
      title={fileName}
      accent={accent}
      status={url.replace("https://", "")}
      maximizable
      className={className}
    >
      <div className="flex gap-1 px-3 pt-3" role="tablist" aria-label={label}>
        {tabs.map(({ key, text }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              role="tab"
              id={`${id}-${key}-tab`}
              aria-selected={active}
              aria-controls={`${id}-panel`}
              onClick={() => setTab(key)}
              className={`relative rounded-t-[10px] border-[3px] border-b-0 border-ink px-3 py-1.5 font-chrome text-[10px] tracking-wide ${
                active
                  ? "z-10 -mb-[3px] bg-paper pb-[calc(0.375rem+3px)]"
                  : "bevel-btn bg-shade text-ink/70"
              }`}
            >
              {text}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${tab}-tab`}
        className="border-t-[3px] border-ink p-4 sm:p-6"
      >
        <div className="mb-5">
          <h3 className="font-display text-2xl leading-tight font-extrabold sm:text-3xl">
            {label}
          </h3>
          <p className="text-sm text-ink/70">{type}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            {tab === "surface" ? (
              <Image
                src={image}
                alt={alt}
                width={1440}
                height={900}
                className="block h-auto w-full rounded-[14px] border-[3px] border-ink"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
            ) : (
              <SystemDiagram
                stages={stages}
                accent={accent}
                caption={labels.diagramNote}
              />
            )}
          </div>

          <ol className="lg:col-span-2">
            {points.map((point, i) => (
              <li key={point.label} className="mb-4 flex gap-3 last:mb-0">
                <span className="bevel-btn mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-[3px] border-ink bg-paper font-chrome text-[10px]">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-display text-base font-bold">
                    {point.label}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="press mt-6 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-paper px-5 py-2 text-sm font-semibold"
        >
          {labels.visit}
          <ArrowSquareOutIcon size={16} weight="bold" />
        </a>
      </div>
    </Window>
  );
}
