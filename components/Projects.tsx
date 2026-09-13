"use client";

// Projects.tsx — bento grid of project cards. Link row pinned to card bottom.

import Image from "next/image";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  ArticleIcon,
  BookOpenIcon,
} from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell, SectionHeader, Tag, StatusChip } from "@/components/site-ui";

// object-position for the card image. Full literals only — Tailwind
// can't see dynamically built class names.
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

export function Projects({ header = true }: { header?: boolean }) {
  return (
    <SectionShell id="projects">
      {header && <SectionHeader label="Projects" title="Things I've made" />}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(140px,auto)] grid-flow-dense w-full">
        {projects.map((project) => {
          const isArchived = project.status === "Archived";
          return (
            <div
              key={project.id}
              className={`group relative bg-surface rounded-2xl border overflow-hidden flex flex-col h-full w-full transition-transform transition-colors
                ${
                  isArchived
                    ? "border-line/70 opacity-70 hover:opacity-100"
                    : "border-line hover:-translate-y-1 hover:border-tint-line"
                }
                ${project.size === "large" ? "md:col-span-4 md:row-span-2 p-6" : ""}
                ${project.size === "medium" ? "md:col-span-2 md:row-span-2 p-6" : ""}
                ${project.size === "standard" ? "md:col-span-4 p-5" : ""}
                ${project.size === "small" ? "md:col-span-2 p-5" : ""}`}
            >
              {project.image && (
                <div
                  className={`h-44 relative mb-4 ${
                    project.size === "large" || project.size === "medium"
                      ? "-m-6 w-[calc(100%+3rem)]"
                      : "-m-5 w-[calc(100%+2.5rem)]"
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
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

              <h3 className="font-display font-semibold text-ink text-xl mb-2">
                {project.title}
              </h3>

              <p className="text-[13.5px] leading-[1.6] text-muted mb-3">
                {project.description}
              </p>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}

              {/* Link row — pinned to the bottom edge */}
              {(project.url || project.github || project.readMore || project.blogUrl) && (
                <div className="mt-auto pt-3 border-t border-line flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-bold uppercase tracking-[0.1em]">
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
                  {project.readMore && (
                    <a
                      href={project.readMore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 min-h-[44px] text-accent-deep hover:opacity-80"
                    >
                      <ArticleIcon size={13} /> Read
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
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
