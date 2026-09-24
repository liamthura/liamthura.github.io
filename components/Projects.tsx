"use client";

// Projects.tsx — featured sticky-note carousel over a year timeline.
// Each featured slide is a text card with its photo stuck on a different
// corner like a polaroid; the archive runs one 4-up strip per year.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  ArticleIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell, SectionHeader, Tag, StatusChip } from "@/components/site-ui";
import { IMAGE_POSITIONS, ProjectCard, CarouselArrow } from "@/components/project-card";

type Project = (typeof projects)[number];

function toneFor(status: string): "completed" | "archived" | "active" {
  return status === "Completed"
    ? "completed"
    : status === "Archived"
      ? "archived"
      : "active";
}

// Photo alternates side per slide; tilt and edge-break alternate with it,
// so every slide shares one alignment system instead of four. The breakout
// is desktop-only — on mobile the polaroid stays inside the card.
function SidePhoto({ project, photoLeft }: { project: Project; photoLeft: boolean }) {
  return (
    <div
      className={`relative ${photoLeft ? "rotate-[-2deg] md:rotate-[-4deg] md:-ml-14 md:-mt-16" : "rotate-[2deg] md:rotate-[4deg] md:-mr-14 md:-mb-16"}`}
    >
      <div className="bg-white p-2.5 pb-9 shadow-[0_18px_40px_color-mix(in_srgb,var(--shade)_22%,transparent)] rounded-[4px]">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-cover-fill/85 rounded-sm" />
        {project.image ? (
          <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-[2px] bg-cover-fill">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className={`object-cover ${IMAGE_POSITIONS[project.imagePosition] ?? "object-center"}`}
            />
          </div>
        ) : (
          <div className="aspect-[16/10] md:aspect-[4/3] rounded-[2px] bg-tint flex items-center justify-center">
            <span className="font-display text-7xl font-extrabold text-ink/15">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedSlide({ project, index }: { project: Project; index: number }) {
  const photoLeft = index % 2 === 0;
  // Mobile shows the opening sentence only — full story on desktop.
  const firstSentence =
    project.description.trim().match(/^.*?[.!?](?=\s|$)/)?.[0] ??
    project.description.trim();
  const descClass = "text-[15px] leading-[1.68] text-muted mb-4 max-w-[60ch]";
  return (
    <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-surface border border-line rounded-2xl p-6 md:p-12 h-full">
      <div className={photoLeft ? "" : "md:order-2"}>
        <SidePhoto project={project} photoLeft={photoLeft} />
      </div>
      <div className={photoLeft ? "" : "md:order-1"}>
        <div className="mb-3">
          <StatusChip tone={toneFor(project.status)}>
            {project.status} · {project.type}
          </StatusChip>
        </div>
        <h3 className="font-display font-semibold text-ink text-2xl md:text-[32px] leading-tight mb-3 text-balance">
          {project.title}
        </h3>
        <p className={`${descClass} hidden md:block`}>
          {project.description}
        </p>
        <p className={`${descClass} md:hidden`}>{firstSentence}</p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
        <ProjectLinks project={project} />
      </div>
    </article>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.url && !project.github && !project.readMore && !project.blogUrl) return null;
  const linkClass =
    "inline-flex items-center gap-1.5 min-h-[44px] text-accent-deep hover:opacity-80";
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-bold uppercase tracking-[0.1em]">
      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <ArrowSquareOutIcon size={13} /> Live
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass.replace("text-accent-deep", "text-ink")}
        >
          <GithubLogoIcon size={13} /> GitHub
        </a>
      )}
      {project.readMore && (
        <a href={project.readMore} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <ArticleIcon size={13} /> Read
        </a>
      )}
      {project.blogUrl && (
        <a href={project.blogUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          <BookOpenIcon size={13} /> Build log
        </a>
      )}
    </div>
  );
}

function FeaturedCarousel({ items }: { items: Project[] }) {
  const count = items.length;
  // True loop: three copies of the set in one track, resting in the
  // middle copy. Wrapping re-anchors by exactly one set width, so the
  // visible window is pixel-identical and can never flash.
  const loop = count > 1;
  const copies = loop ? [0, 1, 2] : [0];
  const [pos, setPos] = useState(loop ? count : 0);
  const [instant, setInstant] = useState(false);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<number | null>(null);

  const logical = loop ? (((pos - count) % count) + count) % count : 0;

  useEffect(() => {
    return () => {
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, []);

  const go = (direction: 1 | -1) => {
    if (!loop) return;
    if (snapTimer.current) {
      window.clearTimeout(snapTimer.current);
      snapTimer.current = null;
    }
    setInstant(false);
    const next = pos + direction;
    setPos(next);
    // Re-anchor into the middle copy once the glide lands.
    const twin = next < count ? next + count : next > 2 * count - 1 ? next - count : null;
    if (twin !== null) {
      snapTimer.current = window.setTimeout(() => {
        setInstant(true);
        setPos(twin);
        snapTimer.current = null;
      }, 550);
    }
  };

  // Center the active slide in the track; neighbors peek, dimmed.
  useEffect(() => {
    const layout = () => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) return;
      const w = (track.children[0] as HTMLElement).offsetWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      setOffset(Math.round(pos * (w + gap) - (track.clientWidth - w) / 2));
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [pos]);

  return (
    <div className="mb-16 md:mb-20">
      <div className="flex items-end justify-between gap-6 mb-2">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink">
          Featured
        </h2>
        {count > 1 && (
          <div className="flex items-center gap-2 shrink-0 pb-1">
            <CarouselArrow
              direction="prev"
              label="Previous featured project"
              onClick={() => go(-1)}
            />
            <CarouselArrow
              direction="next"
              label="Next featured project"
              onClick={() => go(1)}
            />
          </div>
        )}
      </div>
      <p className="sr-only" role="status">
        Showing {items[logical].title}, {logical + 1} of {count}
      </p>
      {/* Breathing room for the edge-breaking photo (desktop only). */}
      <div className="overflow-hidden px-2 md:px-8 pt-6 md:pt-20 pb-8 md:pb-20 -mx-2 md:-mx-8">
        <div
          ref={trackRef}
          className={`flex gap-10 md:gap-16 items-stretch duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${instant ? "transition-none" : "transition-transform"}`}
          style={{ transform: `translateX(${-offset}px)` }}
        >
          {copies.flatMap((copy) =>
            items.map((project, i) => {
              const p = copy * count + i;
              return (
                <div
                  key={`${copy}-${project.id}`}
                  className={`flex-none w-full sm:w-[82%] md:w-[76%] ${instant ? "transition-none" : "transition-opacity transition-transform duration-500 motion-reduce:transition-none"} ${p === pos ? "opacity-100" : "opacity-40 scale-[0.94]"}`}
                  aria-hidden={p !== pos}
                  inert={p !== pos}
                >
                  <FeaturedSlide project={project} index={i} />
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

function YearRow({ label, items, anchor }: { label: string; items: Project[]; anchor: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    setOverflows(el.scrollWidth > el.clientWidth + 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.9,
      behavior: calm ? "auto" : "smooth",
    });
  };

  return (
    <section id={anchor} aria-label={`Projects from ${label}`} className="scroll-mt-28 mb-12 md:mb-16 last:mb-0">
      <div className="flex items-end justify-between gap-6 mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink">
            {label}
          </h2>
          <span className="text-sm text-muted">
            {items.length} {items.length === 1 ? "project" : "projects"}
          </span>
        </div>
        {overflows && (
          <div className="flex gap-2 shrink-0 pb-1">
            <CarouselArrow
              direction="prev"
              label={`Scroll ${label} projects left`}
              onClick={() => nudge(-1)}
              disabled={!canLeft}
            />
            <CarouselArrow
              direction="next"
              label={`Scroll ${label} projects right`}
              onClick={() => nudge(1)}
              disabled={!canRight}
            />
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        role="region"
        aria-label={`${label} projects`}
        tabIndex={0}
        className="no-scrollbar flex gap-5 overflow-x-auto snap-x pb-2 -mx-1 px-1"
      >
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export function Projects({ header = true }: { header?: boolean }) {
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);

  const dated = archive.filter((p) => typeof p.year === "number");
  const undated = archive.filter((p) => typeof p.year !== "number");
  const years = [...new Set(dated.map((p) => p.year as number))].sort((a, b) => b - a);

  return (
    <SectionShell id="projects">
      {header && <SectionHeader label="Projects" title="Things I've made" />}

      {featured.length > 0 && <FeaturedCarousel items={featured} />}

      {/* Year jumps — plain anchors, no state. */}
      {years.length > 0 && (
        <nav aria-label="Jump to year" className="flex flex-wrap gap-2 mb-12">
          {years.map((year) => (
            <a
              key={year}
              href={`#year-${year}`}
              className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-line text-[11px] font-bold uppercase tracking-[0.1em] text-ink hover:border-ink transition-colors"
            >
              {year}
            </a>
          ))}
          {undated.length > 0 && (
            <a
              href="#year-earlier"
              className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-line text-[11px] font-bold uppercase tracking-[0.1em] text-ink hover:border-ink transition-colors"
            >
              Earlier
            </a>
          )}
        </nav>
      )}

      {years.map((year) => (
        <YearRow
          key={year}
          label={String(year)}
          anchor={`year-${year}`}
          items={dated.filter((p) => p.year === year)}
        />
      ))}

      {undated.length > 0 && (
        <YearRow label="Earlier" anchor="year-earlier" items={undated} />
      )}
    </SectionShell>
  );
}
