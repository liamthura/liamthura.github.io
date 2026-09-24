// Fold.tsx — collapsible wrapper for the home page's secondary sections.
// Closed it reads as an index row (title + plus, with a screen-reader-only
// label naming the section) and its content is inert; open it
// renders the section bare. Motion is continuity only: the grid-rows
// track explains the height change, content fades in, the plus turns
// into a close mark. Entrance 300ms, exit 200ms, expo-out throughout.
"use client";

import { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";

export function Fold({
  label,
  title,
  children,
}: {
  label: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <h2>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-6 py-6 min-h-[44px] text-left"
        >
          <span>
            <span className="sr-only">{label}: </span>
            <span className="block font-display text-2xl md:text-[28px] font-semibold text-ink">
              {title}
            </span>
          </span>
          <PlusIcon
            size={20}
            aria-hidden
            className={`text-muted shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? "rotate-45" : ""
            }`}
          />
        </button>
      </h2>
      <div
        className={`grid transition-[grid-template-rows] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "grid-rows-[1fr] duration-300"
            : "grid-rows-[0fr] duration-200"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div
            className={`pb-10 pt-2 transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? "opacity-100 translate-y-0 duration-300"
                : "opacity-0 translate-y-2 duration-200"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
