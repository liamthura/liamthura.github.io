// Lists.tsx — native gallery rows for the /lists page. Client boundary
// exists only for the Phosphor icons; data arrives as props.
"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";

export type ListItem = {
  title: string;
  url: string | null;
  note?: string;
};

export type ReadingList = {
  id: string;
  name: string;
  description?: string;
  items: ListItem[];
};

export function ListSections({ lists }: { lists: ReadingList[] }) {
  return (
    <div className="space-y-10">
      {lists.map((list) => (
        <section key={list.id} aria-label={list.name}>
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">
            {list.name}
          </h2>
          {list.description && (
            <p className="text-sm text-muted mb-4 max-w-[520px]">
              {list.description}
            </p>
          )}
          <ul className="border-t border-line">
            {list.items.map((item, i) => (
              <li key={`${list.id}-${i}`} className="border-b border-line">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-6 py-3.5 min-h-[44px] no-underline"
                  >
                    <span>
                      <span className="block text-[15px] font-semibold text-ink group-hover:text-accent-deep transition-colors">
                        {item.title}
                      </span>
                      {item.note && (
                        <span className="block text-[13px] text-muted mt-0.5">
                          {item.note}
                        </span>
                      )}
                    </span>
                    <ArrowUpRightIcon
                      size={15}
                      aria-hidden
                      className="text-muted shrink-0 translate-y-[3px] group-hover:text-accent-deep transition-colors"
                    />
                  </a>
                ) : (
                  <div className="py-3.5">
                    <span className="block text-[15px] font-semibold text-ink">
                      {item.title}
                    </span>
                    {item.note && (
                      <span className="block text-[13px] text-muted mt-0.5">
                        {item.note}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
