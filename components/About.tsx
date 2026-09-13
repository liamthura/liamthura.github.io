// About.tsx — pull quote + narrative + strengths grid. Collapsible tail.
"use client";

import { useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import about from "@/content/about.json";
import experience from "@/content/experience.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

export function About({
  header = true,
  bare = false,
}: {
  header?: boolean;
  bare?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Current roles first: active entries (no end date), newest start first.
  const nowRoles = experience
    .filter((role) => role.to === null)
    .sort((a, b) => (a.from < b.from ? 1 : -1))
    .slice(0, 2);

  return (
    <SectionShell id="about" bare={bare}>
      {header && <SectionHeader label="About" title="The slightly longer version" />}

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
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-medium text-muted hover:text-ink transition-colors mb-9"
          >
            {isExpanded ? "Shorter" : "Even longer"}
            <ArrowRightIcon
              size={14}
              aria-hidden
              className={`transition-transform ${isExpanded ? "-rotate-90" : "rotate-90"}`}
            />
          </button>

          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-4">
            What I bring to a team
          </p>
          <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
            {about.strengths.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <ArrowRightIcon
                  size={14}
                  weight="bold"
                  aria-hidden
                  className="text-accent-deep shrink-0 mt-[3px]"
                />
                <span className="text-[13px] font-semibold leading-[1.5] text-ink">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {nowRoles.length > 0 && (
            <div className="mt-8 pt-5 border-t border-line">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-3">
                Now
              </p>
              <ul className="space-y-2">
                {nowRoles.map((role) => (
                  <li
                    key={role.id}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                    />
                    <span className="text-muted">
                      <span className="font-semibold text-ink">
                        {role.role}
                      </span>{" "}
                      at {role.company}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
