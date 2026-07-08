"use client";

// Projects.tsx — bento grid of project cards. Link row pinned to card bottom.

import Image from "next/image";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  ArticleIcon,
} from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell, SectionHeader, Tag, StatusChip } from "@/components/site-ui";

export function Projects() {
  return (
    <SectionShell id="projects">
      <SectionHeader label="Projects" title="Things I've made" />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(140px,auto)] grid-flow-dense w-full">
        {projects.map((project) => {
          const isArchived = project.status === "Archived";
          return (
            <div
              key={project.id}
              className={`group relative bg-surface rounded-2xl border overflow-hidden flex flex-col h-full w-full transition-all
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
                  className="w-full h-44 relative -m-6 mb-4"
                  style={{ width: "calc(100% + 48px)" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
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
              {(project.url || project.github || project.readMore) && (
                <div className="mt-auto pt-3 border-t border-line flex flex-wrap gap-5 text-[11px] font-bold uppercase tracking-[0.1em]">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-accent-deep hover:opacity-80"
                    >
                      <ArrowSquareOutIcon size={13} /> Live
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-ink hover:opacity-80"
                    >
                      <GithubLogoIcon size={13} /> GitHub
                    </a>
                  )}
                  {project.readMore && (
                    <a
                      href={project.readMore}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-accent-deep hover:opacity-80"
                    >
                      <ArticleIcon size={13} /> Read
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
