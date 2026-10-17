"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { CaretLeftIcon, CaretRightIcon, GlobeIcon } from "@phosphor-icons/react";
import TiltCard from "./TiltCard";
import ScrollingScreenshot from "./ScrollingScreenshot";
import CyclingScreenshot from "./CyclingScreenshot";
import type { Project } from "@/data/projects";

/** Projects per page. However many more get added later, the list keeps
 * paging in groups of this size instead of growing one long scroll. */
const PAGE_SIZE = 3;

export default function PaginatedProjects({ projects }: { projects: Project[] }) {
  const t = useTranslations("work");
  const [page, setPage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const pageCount = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < pageCount - 1;

  return (
    <div className="relative">
      {/* Portaled to <body>: PageTransition's wrapper carries a CSS
          animation on `transform`, and any ancestor with one — even at
          rest, fill-mode "both" keeps the animation attached — turns
          position:fixed into position-relative-to-that-wrapper instead of
          the viewport. Same fix as PackReveal's overlay. */}
      {mounted &&
        hasPrev &&
        createPortal(
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            aria-label={t("prevPage")}
            className="page-nav page-nav-prev"
          >
            <CaretLeftIcon size="1.3em" weight="bold" />
          </button>,
          document.body,
        )}
      {mounted &&
        hasNext &&
        createPortal(
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            aria-label={t("nextPage")}
            className="page-nav page-nav-next"
          >
            <CaretRightIcon size="1.3em" weight="bold" />
          </button>,
          document.body,
        )}

      <div className="flex flex-col">
        {visible.map((project) => (
          <article key={project.slug} className="center border-t border-line py-14">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-md bg-white/10 px-6 py-4">
              <h2 className="text-[1.25em] font-semibold">
                {t(`projects.${project.slug}.name`)}
              </h2>
              <p className="self-center font-mono text-[0.7em] text-muted">
                {t(`projects.${project.slug}.category`)}{" "}
                {t(`projects.${project.slug}.year`)}
              </p>
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label={t("visit")}
            >
              <TiltCard maxTilt={4}>
                {project.images && project.images.length > 1 ? (
                  <CyclingScreenshot
                    images={project.images.map((src) => ({
                      src,
                      alt: t(`projects.${project.slug}.alt`),
                    }))}
                    className="aspect-[1.9] border border-line"
                  />
                ) : (
                  <ScrollingScreenshot
                    src={project.image}
                    alt={t(`projects.${project.slug}.alt`)}
                    className="aspect-[1.9] border border-line"
                  />
                )}
              </TiltCard>
            </a>

            <p className="mx-auto mt-3 max-w-[70ch] text-center text-[0.6em] text-muted">
              {t(`projects.${project.slug}.summary`)}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {[
                { label: t("problemLabel"), body: t(`projects.${project.slug}.problem`) },
                { label: t("roleLabel"), body: t(`projects.${project.slug}.role`) },
                { label: t("processLabel"), body: t(`projects.${project.slug}.process`) },
                { label: t("resultsLabel"), body: t(`projects.${project.slug}.results`) },
              ].map((block) => (
                <div key={block.label} className="info-card rounded-md p-5 sm:p-6">
                  <h3 className="mb-3 text-center font-mono text-[0.85em] font-bold">
                    {block.label}
                  </h3>
                  <p className="text-[0.8em] lg:text-justify lg:hyphens-auto lg:[text-align-last:center]">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-line pt-6 text-center">
              <h3 className="mb-2 font-bold">{t("impactLabel")}</h3>
              <p className="text-[0.8em] text-muted">{t(`projects.${project.slug}.impact`)}</p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              {project.liveUrl ? (
                <>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-block font-mono text-[0.8em]"
                  >
                    <GlobeIcon size="1.15em" aria-hidden className="mr-[0.5em] inline-block align-[-0.2em]" />
                    {t("visitStable")}
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link inline-block font-mono text-[0.8em]"
                  >
                    <GlobeIcon size="1.15em" aria-hidden className="mr-[0.5em] inline-block align-[-0.2em]" />
                    {t("visitLive")}
                  </a>
                </>
              ) : (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link inline-block font-mono text-[0.8em]"
                >
                  <GlobeIcon size="1.15em" aria-hidden className="mr-[0.5em] inline-block align-[-0.2em]" />
                  {t("visit")}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="center flex items-center justify-center gap-3 border-t border-line py-8">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={t("page", { n: i + 1 })}
              aria-current={i === page ? "page" : undefined}
              className="page-dot"
            />
          ))}
        </div>
      )}
    </div>
  );
}
