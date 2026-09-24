// Work.tsx — four recent projects in a horizontal strip on the home page.
// Order follows the admin list; the full gallery lives on /projects.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell } from "@/components/site-ui";
import { ProjectCard, CarouselArrow } from "@/components/project-card";

export function Work({ children }: { children?: React.ReactNode }) {
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

  return (
    <SectionShell id="work">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-display text-3xl md:text-[40px] font-semibold text-ink">
            <span className="sr-only">Work: </span>
            Selected work
          </h2>
        </div>
        <div className="flex gap-2 shrink-0 pb-1">
          <CarouselArrow
            direction="prev"
            label="Scroll projects left"
            onClick={() => nudge(-1)}
            disabled={!canLeft}
          />
          <CarouselArrow
            direction="next"
            label="Scroll projects right"
            onClick={() => nudge(1)}
            disabled={!canRight}
          />
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 min-h-[44px] mt-6 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep hover:opacity-80"
      >
        All projects <ArrowUpRightIcon size={13} aria-hidden />
      </Link>
      {children && (
        <div className="border-t border-line mt-12">{children}</div>
      )}
    </SectionShell>
  );
}
