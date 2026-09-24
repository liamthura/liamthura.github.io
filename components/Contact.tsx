"use client";

// Contact.tsx — dark island: headline with marker word, copy, link rows.
// The form row opens our own popup; the YouTrack form renders inline
// inside it (no vendor button anywhere).

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  EnvelopeIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  XIcon,
} from "@phosphor-icons/react";
import contact from "@/content/contact.json";
import { SectionShell } from "@/components/site-ui";
import { useTheme } from "./ThemeProvider";

declare global {
  interface Window {
    YTFeedbackForm?: {
      renderInline: (
        element: HTMLElement,
        options: {
          backendURL: string;
          formUUID: string;
          theme: string;
          language: string;
        },
      ) => void;
    };
  }
}

const iconMap: {
  [key: string]: React.ComponentType<{ size?: number; className?: string }>;
} = { EnvelopeIcon, LinkedinLogoIcon, GithubLogoIcon };

export function Contact() {
  const headlineParts = contact.headline.split(/(\btalk\b)/i);
  const { resolved } = useTheme();
  const [formReady, setFormReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.YTFeedbackForm),
  );
  const [formFailed, setFormFailed] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const formMount = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Load the YouTrack form script on demand when the popup opens, so the
  // row button is never gated on third-party script timing. Blockers and
  // slow networks fail here instead — with a direct-link fallback.
  useEffect(() => {
    if (!popupOpen || formReady || formFailed) return;
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      if (ok && window.YTFeedbackForm) setFormReady(true);
      else setFormFailed(true);
    };
    const timer = window.setTimeout(() => finish(false), 10000);
    const script = document.createElement("script");
    script.src =
      "https://thuradev.youtrack.cloud/static/simplified/form/form-entry.js?auto=false";
    script.async = true;
    script.onload = () => finish(true);
    script.onerror = () => finish(false);
    document.body.appendChild(script);
    return () => {
      done = true;
      window.clearTimeout(timer);
    };
  }, [popupOpen, formReady, formFailed]);

  // Render the inline form once the on-demand script lands (keyed by
  // theme below so it always matches the site, at the cost of a fresh
  // form on toggle).
  useEffect(() => {
    const mount = formMount.current;
    if (!formReady || formFailed || !popupOpen || !mount || mount.hasChildNodes()) return;
    window.YTFeedbackForm?.renderInline(mount, {
      backendURL: "https://thuradev.youtrack.cloud",
      formUUID: "b00df07f-343c-411d-98e1-2d05946ffa0f",
      theme: resolved === "dark" ? "dark" : "light",
      language: "en",
    });
  }, [formReady, formFailed, popupOpen, resolved]);

  // Deep link + CTA trigger: #message opens the popup from any page.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#message") setPopupOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  // Clear our hash on close so the same link re-triggers next click.
  useEffect(() => {
    if (!popupOpen && window.location.hash === "#message") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [popupOpen]);

  // Escape closes; lock body scroll while open; focus the close control.
  useEffect(() => {
    if (!popupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopupOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [popupOpen]);

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
          {/* Feedback form row — always enabled; the vendor script loads
              only after the popup opens. */}
          <button
            type="button"
            onClick={() => setPopupOpen(true)}
            className="flex items-center justify-between gap-3 px-[18px] py-3.5 min-h-[44px] border border-ink-island-fg/15 rounded-[10px] hover:border-ink-island-fg/30 transition-colors text-left w-full"
          >
            <span className="inline-flex items-center gap-2.5">
              <EnvelopeIcon size={16} className="text-accent-deep" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                Form
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-island-fg">
              Send a message
              <ArrowUpRightIcon size={14} aria-hidden className="text-accent-deep" />
            </span>
          </button>
          {contact.links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex items-center justify-between gap-3 px-[18px] py-3.5 min-h-[44px] border border-ink-island-fg/15 rounded-[10px] hover:border-ink-island-fg/30 transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  {Icon && <Icon size={16} className="text-accent-deep" />}
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep">
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
        <span className="font-display font-bold text-base inline-flex items-baseline">
          liam<span className="text-accent text-2xl leading-none">.</span>
        </span>
        <span className="text-xs text-ink-island-fg/60">
          © 2026 · Built by Liam Thura, fuelled by dumplings
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep"
        >
          Back to top <ArrowUpIcon size={13} aria-hidden />
        </a>
      </div>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />

      {/* Feedback popup — our shell, their inline form. */}
      {popupOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close contact form"
            onClick={() => setPopupOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contact form"
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface rounded-2xl border border-line shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="font-display text-xl font-semibold text-ink">
                Send a message
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setPopupOpen(false)}
                aria-label="Close"
                className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-ink transition-colors shrink-0"
              >
                <XIcon size={17} aria-hidden />
              </button>
            </div>
            {formFailed ? (
              <div className="py-6 text-center">
                <p className="text-sm text-ink/70 mb-4">
                  The embedded form could not load (a tracker blocker or a
                  network hiccup usually). The direct form always works:
                </p>
                <a
                  href="https://thuradev.youtrack.cloud/form/b00df07f-343c-411d-98e1-2d05946ffa0f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3.5 px-6 min-h-[44px] rounded-[10px] text-[11px] font-bold uppercase tracking-[0.1em] bg-ink text-paper hover:opacity-90 transition-opacity"
                >
                  Open the form
                  <ArrowUpRightIcon size={14} aria-hidden />
                </a>
              </div>
            ) : (
              <>
                {!formReady && (
                  <p
                    className="py-10 text-center text-sm text-ink/60"
                    role="status"
                  >
                    Loading the form…
                  </p>
                )}
                <div
                  ref={formMount}
                  key={resolved}
                  hidden={!formReady}
                />
              </>
            )}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
