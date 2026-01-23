// Experience.tsx - Work history timeline
// Grid layout: date column (200px) + details column
"use client";

import { useState } from "react";
import experience from "@/content/experience.json";

export function Experience() {
  // Track which jobs are expanded by their id
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJob = (id: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Split description into first sentence and the rest
  const splitDescription = (description: string) => {
    const match = description.match(/^[^.!?]+[.!?]/);
    if (match) {
      const firstSentence = match[0];
      const rest = description.slice(firstSentence.length).trim();
      return { firstSentence, rest };
    }
    return { firstSentence: description, rest: "" };
  };

  return (
    <section id="experience" className="py-24">
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            Experience
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            Where I&apos;ve worked
          </h2>
        </div>

        {/* Experience list */}
        <div>
          {experience.map((job, i) => {
            const { firstSentence, rest } = splitDescription(job.description);
            const isExpanded = expandedJobs.has(job.id);

            return (
              <div
                key={job.id}
                className={`
                  py-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-10
                  ${i < experience.length - 1 ? "border-b border-soft-border" : ""}
                `}
              >
                {/* Left column - company and dates */}
                <div className="text-warm-gray text-sm">
                  <span className="font-semibold text-charcoal block mb-1">
                    {job.company}
                  </span>
                  <span>
                    {job.from} – {job.to}
                  </span>
                  <br />
                  <span>{job.type}</span>
                </div>

                {/* Right column - role details */}
                <div>
                  <h3 className="font-display text-xl font-medium text-charcoal mb-3">
                    {job.role}
                  </h3>

                  {/* Description - first sentence always visible, rest either collapsed or shown if short */}
                  <p className="text-warm-gray mb-4">
                    {rest && rest.length <= 100
                      ? job.description // Show full description if rest is short
                      : firstSentence + (isExpanded && rest ? ` ${rest}` : "")}
                  </p>

                  {/* Toggle button - only if there's substantial extra content */}
                  {rest && rest.length > 100 && (
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="mb-4 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors"
                    >
                      {isExpanded ? "Read less ↑" : "Read more ↓"}
                    </button>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs py-1.5 px-3 bg-warm-white border border-soft-border rounded-md text-warm-gray"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
