// Experience.tsx — Work history grouped by company, sorted descending by date
// Multiple roles at the same company render as a vertical timeline within
// a single company block. Dates are stored in JSON as ISO month strings
// ("YYYY-MM") or null for "Present", and formatted at render time.
"use client";

import { useMemo, useState } from "react";
import experience from "@/content/experience.json";

type Role = (typeof experience)[number];

type Group = {
  company: string;
  roles: Role[];
  spanFrom: string | null;
  spanTo: string | null;
};

/** ISO month string ("YYYY-MM") → "Jul 2024"; null → "Present". */
function formatMonth(value: string | null): string {
  if (value === null || value === undefined || value === "") return "Present";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value; // fallback for any legacy entries
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!year || !month || month < 1 || month > 12) return value;
  const d = new Date(year, month - 1);
  return d.toLocaleString("en-GB", { month: "short", year: "numeric" });
}

/** Map a date string to a sortable number. null/"Present" = +∞ (most recent). */
function dateValue(value: string | null): number {
  if (value === null || value === undefined || value === "") return Infinity;
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return -Infinity; // unparsable → sort to the bottom
  return Number(match[1]) * 12 + Number(match[2]);
}

export function Experience() {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const toggleRole = (id: string) => {
    setExpandedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 1. Group by company.
  // 2. Within each group, sort roles by `from` descending (newest role first).
  // 3. Sort groups by the newest role's `to` descending, falling back to its
  //    `from` so groups with the same end date (e.g. multiple "Present" jobs)
  //    are ordered by which one started most recently.
  const groups = useMemo<Group[]>(() => {
    const byCompany = new Map<string, Role[]>();
    for (const role of experience) {
      const existing = byCompany.get(role.company);
      if (existing) existing.push(role);
      else byCompany.set(role.company, [role]);
    }

    const result: Group[] = Array.from(byCompany.entries()).map(
      ([company, roles]) => {
        const sortedRoles = [...roles].sort(
          (a, b) => dateValue(b.from) - dateValue(a.from),
        );
        return {
          company,
          roles: sortedRoles,
          spanFrom: sortedRoles[sortedRoles.length - 1].from,
          spanTo: sortedRoles[0].to,
        };
      },
    );

    result.sort((a, b) => {
      const aLatest = a.roles[0];
      const bLatest = b.roles[0];
      const byTo = dateValue(bLatest.to) - dateValue(aLatest.to);
      if (byTo !== 0) return byTo;
      return dateValue(bLatest.from) - dateValue(aLatest.from);
    });

    return result;
  }, []);

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

        {/* Company groups */}
        <div>
          {groups.map((group, i) => {
            const isMulti = group.roles.length > 1;
            return (
              <div
                key={group.company}
                className={`
                  py-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-10
                  ${i < groups.length - 1 ? "border-b border-soft-border" : ""}
                `}
              >
                {/* Left column — company and overall span */}
                <div className="text-warm-gray text-sm">
                  <span className="font-semibold text-charcoal block mb-1">
                    {group.company}
                  </span>
                  <span>
                    {formatMonth(group.spanFrom)} – {formatMonth(group.spanTo)}
                  </span>
                  {!isMulti && (
                    <>
                      <br />
                      <span>{group.roles[0].type}</span>
                    </>
                  )}
                </div>

                {/* Right column — roles (with a vertical timeline when multi) */}
                <div className={isMulti ? "relative" : ""}>
                  {isMulti && (
                    <div
                      aria-hidden
                      className="absolute left-[5px] top-3 bottom-3 w-px bg-soft-border"
                    />
                  )}

                  <div className={isMulti ? "space-y-8" : ""}>
                    {group.roles.map((role) => {
                      const { firstSentence, rest } = splitDescription(
                        role.description,
                      );
                      const isExpanded = expandedRoles.has(role.id);
                      const isCurrent = role.to === null;

                      return (
                        <div
                          key={role.id}
                          className={isMulti ? "relative pl-7" : ""}
                        >
                          {isMulti && (
                            <div
                              aria-hidden
                              className={`
                                absolute left-0 top-2.5 w-[11px] h-[11px] rounded-full
                                ${
                                  isCurrent
                                    ? "bg-lime border-2 border-cream ring-1 ring-lime/30"
                                    : "bg-cream border-2 border-soft-border"
                                }
                              `}
                            />
                          )}

                          <h3 className="font-display text-xl font-medium text-charcoal mb-1">
                            {role.role}
                          </h3>

                          {isMulti && (
                            <p className="text-xs font-medium text-warm-gray mb-3 tracking-wide">
                              {formatMonth(role.from)} – {formatMonth(role.to)}
                              <span className="text-warm-gray/60"> · </span>
                              {role.type}
                            </p>
                          )}

                          <p className="text-warm-gray mb-4">
                            {rest && rest.length <= 100
                              ? role.description
                              : firstSentence +
                                (isExpanded && rest ? ` ${rest}` : "")}
                          </p>

                          {rest && rest.length > 100 && (
                            <button
                              onClick={() => toggleRole(role.id)}
                              className="mb-4 text-sm font-medium text-warm-gray hover:text-charcoal transition-colors"
                            >
                              {isExpanded ? "Read less ↑" : "Read more ↓"}
                            </button>
                          )}

                          {role.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {role.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs py-1.5 px-3 bg-warm-white border border-soft-border rounded-md text-warm-gray"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
