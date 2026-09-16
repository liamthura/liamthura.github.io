// project-card.tsx — the shared project card (home strip + gallery
// timeline) and carousel arrow buttons, so both surfaces stay identical.

import Image from "next/image";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  ArticleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { StatusChip } from "@/components/site-ui";

// object-position for card images. Full literals only — Tailwind
// can't see dynamically built class names.
export const IMAGE_POSITIONS: Record<string, string> = {
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

export type CardProject = {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  url: string;
  github: string;
  readMore: string;
  blogUrl: string;
  image: string;
  imagePosition?: string;
};

function toneFor(status: string): "completed" | "archived" | "active" {
  return status === "Completed"
    ? "completed"
    : status === "Archived"
      ? "archived"
      : "active";
}

export function ProjectCard({ project }: { project: CardProject }) {
  const isArchived = project.status === "Archived";
  return (
    <article
      className={`snap-start shrink-0 w-[280px] md:w-[320px] bg-surface rounded-2xl border overflow-hidden flex flex-col p-5 transition-colors
        ${isArchived ? "border-line/70 opacity-70 hover:opacity-100" : "border-line"}`}
    >
      {project.image && (
        <div className="h-36 -m-5 mb-4 w-[calc(100%+2.5rem)] relative">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="320px"
            className={`object-cover ${IMAGE_POSITIONS[project.imagePosition ?? ""] ?? "object-center"}`}
          />
        </div>
      )}

      <div className="mb-2.5">
        <StatusChip tone={toneFor(project.status)}>
          {project.status} · {project.type}
        </StatusChip>
      </div>

      <h3 className="font-display font-semibold text-ink text-lg mb-1.5">
        {project.title}
      </h3>
      <p className={`text-[13px] leading-[1.6] text-muted mb-3 ${project.image ? "line-clamp-3" : ""}`}>
        {project.description}
      </p>

      {(project.url || project.github || project.readMore || project.blogUrl) && (
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
    </article>
  );
}

export function CarouselArrow({
  direction,
  label,
  onClick,
  disabled = false,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = direction === "prev" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`w-11 h-11 inline-flex items-center justify-center rounded-full border transition-colors ${
        disabled
          ? "border-line/60 text-muted/40 cursor-default"
          : "border-line text-ink hover:border-ink"
      }`}
    >
      <Icon size={17} aria-hidden />
    </button>
  );
}
