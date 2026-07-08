// site-ui.tsx — shared primitives for the public redesign.
// Section shell (centered column + hairline rules + hatch divider),
// section header (green eyebrow + Bricolage title), chips, marker text.

import type { ReactNode } from "react";

export function SectionShell({
  id,
  dark = false,
  children,
}: {
  id?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={dark ? "bg-ink-island text-ink-island-fg" : ""}>
      {!dark && <div className="hatch-divider" aria-hidden />}
      <div className="container-main">
        <div className="col-shell py-20 md:py-24">{children}</div>
      </div>
    </section>
  );
}

export function SectionHeader({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="mb-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3 text-accent-deep">
        {label}
      </p>
      <h2 className="font-display text-3xl md:text-[40px] font-semibold text-ink">
        {title}
      </h2>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] py-1.5 px-2.5 rounded border border-line text-muted">
      {children}
    </span>
  );
}

export function StatusChip({
  tone = "active",
  children,
}: {
  tone?: "active" | "completed" | "archived";
  children: ReactNode;
}) {
  const styles = {
    active: { chip: "bg-tint text-accent-deep", dot: "bg-accent" },
    completed: { chip: "bg-info-tint text-info", dot: "bg-info" },
    archived: { chip: "bg-line/60 text-muted", dot: "bg-muted" },
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] py-1.5 px-2.5 rounded ${styles.chip}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} aria-hidden />
      {children}
    </span>
  );
}

export function MarkerText({ children }: { children: ReactNode }) {
  return <span className="mark">{children}</span>;
}
