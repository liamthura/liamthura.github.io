"use client";

// Contact.tsx - Dark section with CTA and social links
// Uses Phosphor icons for link buttons

import {
  EnvelopeIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import contact from "@/content/contact.json";

const iconMap: {
  [key: string]: React.ComponentType<{ size?: number; className?: string }>;
} = {
  EnvelopeIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
};

export function Contact() {
  // Separate links with and without values
  const linksWithValues = contact.links.filter(
    (link) => link.value && link.value.trim().length > 0,
  );
  const linksWithoutValues = contact.links.filter(
    (link) => !link.value || link.value.trim().length === 0,
  );

  return (
    <section id="contact" className="py-24 bg-ink text-ink-fg">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-lime-light mb-3">
              Get in touch
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-ink-fg mb-4">
              {contact.headline}
            </h2>
            <p className="text-ink-fg/70 mb-6">{contact.intro}</p>
            <p className="text-ink-fg/70 mb-6">{contact.secondary}</p>
            <p className="text-ink-fg/50 text-sm">{contact.availability}</p>
          </div>

          {/* Right column - links */}
          <div className="flex flex-col gap-4">
            {/* Links without values - inline flex stretched (shown first) */}
            {linksWithoutValues.length > 0 && (
              <div className="flex gap-4">
                {linksWithoutValues.map((link) => {
                  const Icon = iconMap[link.icon];

                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target={
                        link.url.startsWith("mailto") ? undefined : "_blank"
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-ink-fg/5 border border-ink-fg/10 rounded-xl text-ink-fg no-underline hover:bg-ink-fg/10 hover:border-ink-fg/20 transition-all"
                    >
                      {Icon && <Icon size={20} className="text-ink-fg" />}
                      <span className="font-medium text-sm">{link.label}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Links with values - full width (shown after) */}
            {linksWithValues.map((link) => {
              const Icon = iconMap[link.icon];

              return (
                <a
                  key={link.label}
                  href={link.url}
                  target={link.url.startsWith("mailto") ? undefined : "_blank"}
                  className="flex items-center gap-4 p-4 bg-ink-fg/5 border border-ink-fg/10 rounded-xl text-ink-fg no-underline hover:bg-ink-fg/10 hover:border-ink-fg/20 transition-all"
                >
                  {Icon && <Icon size={24} className="text-ink-fg" />}
                  <div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-ink-fg/60 text-sm">{link.value}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
