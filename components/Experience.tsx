// Experience.tsx — Work history grouped by company, sorted descending by date
// Multiple roles at the same company render as a vertical timeline within
// a single company block. Dates are stored in JSON as ISO month strings
// ("YYYY-MM") or null for "Present", and formatted at render time.
"use client";

import { useMemo, useState } from "react";
import experience from "@/content/experience.json";
import { SectionShell, SectionHeader, Tag } from "@/components/site-ui";

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
    <SectionShell id="experience">
      <SectionHeader label="Experience" title="Where I've worked" />

      <div>
        {groups.map((group, i) => {
          const isMulti = group.roles.length > 1;
          return (
            <div
              key={group.company}
              className={`py-7 grid md:grid-cols-[190px_1fr] gap-4 md:gap-8 ${
                i < groups.length - 1 ? "border-b border-line" : ""
              }`}
            >
              {/* Left column — dates only */}
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted pt-1">
                {formatMonth(group.spanFrom)} — {formatMonth(group.spanTo)}
              </div>

              {/* Right column — org eyebrow + role(s) */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep mb-3">
                  {group.company}
                </p>

                <div className={isMulti ? "relative" : ""}>
                  {isMulti && (
                    <div
                      aria-hidden
                      className="absolute left-[4px] top-3 bottom-3 w-0.5 bg-line"
                    />
                  )}
                  <div className={isMulti ? "space-y-6" : ""}>
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
                              className={`absolute left-0 top-1.5 w-[9px] h-[9px] rounded-full ${
                                isCurrent
                                  ? "bg-accent"
                                  : "bg-paper border-[1.5px] border-muted"
                              }`}
                            />
                          )}

                          {isMulti && (
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-1">
                              {formatMonth(role.from)} — {formatMonth(role.to)}
                              <span className="text-muted/60"> · </span>
                              {role.type}
                            </p>
                          )}

                          <h3 className="font-display text-xl font-semibold text-ink mb-2">
                            {role.role}
                          </h3>

                          <p className="text-sm leading-[1.65] text-muted mb-3">
                            {rest && rest.length <= 100
                              ? role.description
                              : firstSentence +
                                (isExpanded && rest ? ` ${rest}` : "")}
                          </p>

                          {rest && rest.length > 100 && (
                            <button
                              onClick={() => toggleRole(role.id)}
                              className="mb-3 text-sm font-medium text-muted hover:text-ink transition-colors"
                            >
                              {isExpanded ? "Read less ↑" : "Read more ↓"}
                            </button>
                          )}

                          {role.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {role.tags.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
