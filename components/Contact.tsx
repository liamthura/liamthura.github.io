"use client";

// Contact.tsx — dark island: headline with marker word, copy, link rows.

import {
  EnvelopeIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import contact from "@/content/contact.json";
import { SectionShell } from "@/components/site-ui";

const iconMap: {
  [key: string]: React.ComponentType<{ size?: number; className?: string }>;
} = { EnvelopeIcon, LinkedinLogoIcon, GithubLogoIcon };

export function Contact() {
  const headlineParts = contact.headline.split(/(\btalk\b)/i);

  return (
    <SectionShell id="contact" dark>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep mb-3">
        Contact
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-8">
        {headlineParts.map((part, i) =>
          /^talk$/i.test(part) ? (
            <span key={i} className="mark">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </h2>

      <div className="grid md:grid-cols-[1fr_380px] gap-12 md:gap-[72px] items-start">
        <div>
          <p className="text-[15px] leading-[1.68] text-ink-island-fg/70 mb-4">
            {contact.intro}
          </p>
          <p className="text-sm leading-[1.68] text-ink-island-fg/70 mb-4">
            {contact.secondary}
          </p>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {contact.availability}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {contact.links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                className="flex items-center justify-between gap-3 px-[18px] py-3.5 border border-ink-island-fg/15 rounded-[10px] hover:border-ink-island-fg/30 transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  {Icon && <Icon size={16} className="text-accent-deep" />}
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                    {link.label}
                  </span>
                </span>
                <span className="text-[13px] font-semibold text-ink-island-fg">
                  {link.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-9 pt-6 border-t border-ink-island-fg/15 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-display font-bold text-base">
          khant<span className="text-accent">.</span>
        </span>
        <span className="text-xs text-ink-island-fg/60">
          © 2026 · Built by Liam Thura, fuelled by dumplings
        </span>
        <a
          href="#"
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep"
        >
          Back to top ↑
        </a>
      </div>
    </SectionShell>
  );
}
