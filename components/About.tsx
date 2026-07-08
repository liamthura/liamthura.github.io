// About.tsx — pull quote + narrative + strengths grid. Collapsible tail.
"use client";

import { useState } from "react";
import about from "@/content/about.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

export function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SectionShell id="about">
      <SectionHeader label="About" title="The slightly longer version" />

      <div className="grid md:grid-cols-[400px_1fr] gap-12 md:gap-[72px] items-start">
        {/* Pull quote */}
        <p className="font-display text-[26px] leading-[1.45] font-medium text-ink">
          {about.intro}
        </p>

        {/* Narrative + strengths */}
        <div>
          <p className="text-[15px] leading-[1.68] text-muted mb-5">
            {about.paragraphs[0]}
          </p>

          {isExpanded && (
            <div className="space-y-5 mb-5">
              {about.paragraphs.slice(1).map((para, i) => (
                <p key={i} className="text-[15px] leading-[1.68] text-muted">
                  {para}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-muted hover:text-ink transition-colors mb-9"
          >
            {isExpanded ? "Shorter ↑" : "Even longer ↓"}
          </button>

          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-4">
            What I bring to a team
          </p>
          <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
            {about.strengths.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-accent-deep font-bold text-sm leading-[1.5]">
                  →
                </span>
                <span className="text-[13px] font-semibold leading-[1.5] text-ink">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
