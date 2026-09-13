// Blog.tsx — latest posts from the Hugo blog (thurashares.qzz.io).
// Data is a static snapshot: scripts/update-posts.mjs refreshes
// public/content/posts.json from the blog's RSS feed. No runtime fetching,
// so the page stays fully static.
"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import posts from "@/content/posts.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

const BLOG_URL = "https://thurashares.qzz.io/blog/";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Blog({
  header = true,
  bare = false,
}: {
  header?: boolean;
  bare?: boolean;
}) {
  const latest = posts.slice(0, 3);

  return (
    <SectionShell id="blog" bare={bare}>
      {header && <SectionHeader label="Blog" title="Latest posts" />}

      <div>
        {latest.map((post, i) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start justify-between gap-6 py-6 no-underline ${
              i < latest.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-2">
                {formatDate(post.date)}
              </p>
              <h3 className="font-display text-xl font-semibold text-ink mb-2 group-hover:text-accent-deep transition-colors">
                {post.title}
              </h3>
              <p className="text-sm leading-[1.65] text-muted">{post.excerpt}</p>
            </div>
            <ArrowUpRightIcon
              size={18}
              aria-hidden
              className="text-muted shrink-0 mt-1 group-hover:text-accent-deep group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform transition-colors"
            />
          </a>
        ))}
      </div>

      <a
        href={BLOG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 min-h-[44px] mt-6 text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep hover:opacity-80"
      >
        View all posts <ArrowUpRightIcon size={13} aria-hidden />
      </a>
    </SectionShell>
  );
}
