// Work.tsx — four recent projects in a horizontal strip on the home page.
// Order follows the admin list; the full gallery lives on /projects.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  BookOpenIcon,
  ArrowUpRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell, StatusChip } from "@/components/site-ui";

const IMAGE_POSITIONS: Record<string, string> = {
  "top-left": "object-left-top",
  top: "object-top",
  "top-right": "object-right-top",
  left: "object-left",
  center: "object-center",
  right: "object-right",
  "bottom-left": "object-left-bottom",
  bottom: "object-bottom",
  "bottom-right": "object-right-bottom",
};

export function Work() {
  // Starred in /admin/projects (max 4); falls back to list order.
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const strip = featured.length > 0 ? featured : projects.slice(0, 4);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const calm =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: calm ? "auto" : "smooth",
    });
  };

  const arrowClass = (enabled: boolean) =>
    `w-11 h-11 inline-flex items-center justify-center rounded-full border transition-colors ${
      enabled
        ? "border-line text-ink hover:border-ink"
        : "border-line/60 text-muted/40 cursor-default"
    }`;

  return (
    <SectionShell id="work">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3 text-accent-deep">
            Work
          </p>
          <h2 className="font-display text-3xl md:text-[40px] font-semibold text-ink">
            Selected work
          </h2>
        </div>
        <div className="flex gap-2 shrink-0 pb-1">
          <button
            onClick={() => nudge(-1)}
            disabled={!canLeft}
            aria-label="Scroll projects left"
            className={arrowClass(canLeft)}
          >
            <ArrowLeftIcon size={17} aria-hidden />
          </button>
          <button
            onClick={() => nudge(1)}
            disabled={!canRight}
            aria-label="Scroll projects right"
            className={arrowClass(canRight)}
          >
            <ArrowRightIcon size={17} aria-hidden />
          </button>
        </div>
      </div>
      <p className="text-[15px] leading-[1.68] text-muted max-w-[560px] -mt-6 mb-8">
        These are some favourite projects I&apos;ve had a good time working on. You can always see the full shelf on my Projects page!
      </p>

      <div
        ref={trackRef}
        onScroll={updateEdges}
        role="region"
        aria-label="Selected work"
        tabIndex={0}
        className="no-scrollbar flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {strip.map((project) => (
          <article
            key={project.id}
            className="snap-start shrink-0 w-[280px] md:w-[320px] bg-surface rounded-2xl border border-line overflow-hidden flex flex-col p-5"
          >
            {project.image && (
              <div className="h-36 -m-5 mb-4 w-[calc(100%+2.5rem)] relative">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="320px"
                  className={`object-cover ${IMAGE_POSITIONS[project.imagePosition] ?? "object-center"}`}
                />
              </div>
            )}

            <div className="mb-2.5">
              <StatusChip
                tone={
                  project.status === "Completed"
                    ? "completed"
                    : project.status === "Archived"
                      ? "archived"
                      : "active"
                }
              >
                {project.status} · {project.type}
              </StatusChip>
            </div>

            <h3 className="font-display font-semibold text-ink text-lg mb-1.5">
              {project.title}
            </h3>
            <p className="text-[13px] leading-[1.6] text-muted mb-3 line-clamp-3">
              {project.description}
            </p>

            {(project.url || project.github || project.blogUrl) && (
              <div className="mt-auto pt-3 border-t border-line flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-[0.1em]">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-accent-deep hover:opacity-80"
                  >
                    <ArrowSquareOutIcon size={13} /> Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-ink hover:opacity-80"
                  >
                    <GithubLogoIcon size={13} /> GitHub
                  </a>
                )}
                {project.blogUrl && (
                  <a
                    href={project.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-accent-deep hover:opacity-80"
                  >
                    <BookOpenIcon size={13} /> Build log
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 min-h-[44px] mt-6 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep hover:opacity-80"
      >
        All projects <ArrowUpRightIcon size={13} aria-hidden />
      </Link>
    </SectionShell>
  );
}
