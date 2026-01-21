"use client";

// Projects.tsx - Bento grid of project cards
// Sizes: large (4col, 2row), medium (3col, 2row), standard (3col), small (2col)

import Image from "next/image";
import { ArrowSquareOutIcon, GithubLogoIcon } from "@phosphor-icons/react";
import projects from "@/content/projects.json";

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

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(120px,auto)] w-full">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`
                bg-cream rounded-xl border border-soft-border overflow-hidden
                hover:-translate-y-1 hover:shadow-lg hover:border-lime-light transition-all
                flex flex-col h-full w-full
                ${project.size === "large" ? "md:col-span-4 md:row-span-2 p-6" : ""}
                ${project.size === "medium" ? "md:col-span-2 md:row-span-2 p-6" : ""}
                ${project.size === "standard" ? "md:col-span-4 p-5" : ""}
                ${project.size === "small" ? "md:col-span-2 p-5" : ""}
              `}
            >
              {/* Preview image - only renders if URL exists */}
              {project.image && (
                <div
                  className="w-full h-40 relative -m-6 mb-4"
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

              {/* Badge */}
              <span
                className={`
                  text-xs font-semibold uppercase tracking-wider py-1 px-2.5 rounded inline-block w-fit
                  ${project.size === "large" || project.size === "medium" ? "mb-3" : "mb-2"}
                  ${project.status === "Active" ? "bg-lime/15 text-lime" : "bg-blue/15 text-blue"}
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
                  ${project.size === "large" || project.size === "medium" ? "text-[15px] mb-4 flex-grow" : "text-sm mb-3"}
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
          ))}
        </div>
      </div>
    </section>
  );
}
