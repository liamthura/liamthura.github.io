"use client";

// Projects.tsx — Bento grid of project cards
// Grid uses `grid-flow-dense` so smaller tiles backfill any holes the
// larger tiles leave behind, preventing awkward empty space.
// Sizes (on 6-col grid): large = 4×2, medium = 2×2, standard = 4×1, small = 2×1.

import Image from "next/image";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import projects from "@/content/projects.json";

const STATUS_BADGE: Record<string, string> = {
  Active: "bg-lime/15 text-lime",
  Completed: "bg-blue/15 text-blue",
  Archived: "bg-soft-border/60 text-warm-gray",
};

export function Projects() {
  return (
    <section
      id="projects"
      className="py-24 bg-warm-white border-t border-soft-border"
    >
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            Selected work
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            Projects
          </h2>
        </div>

        {/* Bento grid — grid-flow-dense lets smaller tiles backfill empty slots */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(140px,auto)] grid-flow-dense w-full">
          {projects.map((project) => {
            const isArchived = project.status === "Archived";
            const isFeature =
              project.size === "large" || project.size === "medium";

            return (
              <div
                key={project.id}
                className={`
                  group relative bg-cream rounded-xl border overflow-hidden
                  flex flex-col h-full w-full transition-all
                  ${
                    isArchived
                      ? "border-soft-border/70 opacity-70 hover:opacity-100 hover:border-soft-border"
                      : "border-soft-border hover:-translate-y-1 hover:border-lime-light"
                  }
                  ${project.size === "large" ? "md:col-span-4 md:row-span-2 p-6" : ""}
                  ${project.size === "medium" ? "md:col-span-2 md:row-span-2 p-6" : ""}
                  ${project.size === "standard" ? "md:col-span-4 p-5" : ""}
                  ${project.size === "small" ? "md:col-span-2 p-5" : ""}
                `}
              >
                {/* Preview image — only renders if URL exists */}
                {project.image && (
                  <div
                    className="w-full h-40 relative -m-6 mb-4"
                    style={{ width: "calc(100% + 48px)" }}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`object-cover transition-[filter] ${
                        isArchived
                          ? "grayscale group-hover:grayscale-0"
                          : ""
                      }`}
                    />
                  </div>
                )}

                {/* Badge */}
                <span
                  className={`
                    text-xs font-semibold uppercase tracking-wider py-1 px-2.5 rounded inline-block w-fit
                    ${isFeature ? "mb-3" : "mb-2"}
                    ${STATUS_BADGE[project.status] ?? STATUS_BADGE.Archived}
                  `}
                >
                  {project.status} · {project.type}
                </span>

                {/* Title */}
                <h3
                  className={`
                    font-display font-medium text-charcoal
                    ${project.size === "large" ? "text-2xl mb-3" : ""}
                    ${project.size === "medium" ? "text-xl mb-2" : ""}
                    ${project.size === "standard" || project.size === "small" ? "text-lg mb-1" : ""}
                  `}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className={`
                    text-warm-gray
                    ${isFeature ? "text-[15px] mb-4 flex-grow" : "text-sm mb-3"}
                  `}
                >
                  {project.description}
                </p>

                {/* Links + Tags grouped at bottom */}
                <div className="mt-auto space-y-3">
                  {/* Link buttons */}
                  {(project.url || project.github) && (
                    <div className="flex flex-wrap gap-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-md bg-charcoal text-warm-white hover:bg-charcoal/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowSquareOutIcon size={14} />
                          Explore
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 text-xs font-medium py-1.5 px-3 rounded-md border border-soft-border text-charcoal hover:bg-warm-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GithubLogoIcon size={14} />
                          Source Code
                        </a>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs py-1 px-2.5 bg-warm-white rounded text-warm-gray"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
