// Education.tsx — degree (left) + dissertation callout & highlights (right).

import education from "@/content/education.json";
import { SectionShell, SectionHeader, StatusChip } from "@/components/site-ui";

export function Education() {
  return (
    <SectionShell>
      <SectionHeader label="Education" title="Academic background" />

      {education.map((entry) => (
        <div
          key={entry.id}
          className="grid md:grid-cols-[400px_1fr] gap-12 md:gap-[72px]"
        >
          {/* Degree */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-3">
              {entry.from} — {entry.to}
            </p>
            <h3 className="font-display text-[26px] leading-[1.2] font-semibold text-ink mb-3">
              {entry.title}
            </h3>
            <p className="text-sm text-muted mb-3">{entry.institution}</p>
            {entry.grades && <StatusChip>{entry.grades}</StatusChip>}
          </div>

          {/* Detail */}
          <div>
            {entry.dissertation && (
              <div className="bg-surface border-l-[3px] border-accent px-5 py-4 mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep mb-2">
                  Dissertation
                </p>
                <p className="text-sm leading-[1.65] text-muted">
                  {entry.dissertation}
                </p>
              </div>
            )}

            {entry.highlights && entry.highlights.length > 0 && (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-3">
                  Key highlights
                </p>
                <ul className="space-y-2.5">
                  {entry.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-accent-deep font-bold text-sm">→</span>
                      <span className="text-[13px] font-semibold text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ))}
    </SectionShell>
  );
}
