"use client";

// Nav.tsx — route links + mobile dropdown + theme toggle.

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CaretDownIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Lists", href: "/lists" },
  { label: "Blog", href: "/#blog" },
  { label: "Contact", href: "/#contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hash, setHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Same-page anchors (Blog, Contact) never match the pathname, so track
  // the visible home section for both the mobile label and highlighting.
  // Clearing on navigation happens during render (the documented
  // adjust-state-when-props-change pattern); the effect only subscribes.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (pathname !== "/") setHash("");
  }

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["blog", "contact"];
    const visible: Record<string, boolean> = {};
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible[entry.target.id] = entry.isIntersecting;
        }
        const active = ids.filter((id) => visible[id]).pop();
        setHash(active ? `#${active}` : "");
      },
      // Active while crossing the viewport middle.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  // Route links match the pathname; same-page anchors match the visible
  // section. Home only wins when no section is active, otherwise it would
  // shadow every anchor on "/".
  const isActive = (href: string) =>
    href.startsWith("/#")
      ? hash === href.slice(1)
      : pathname === href && hash === "";

  const activeLabel =
    navLinks.find((link) => isActive(link.href))?.label || "Home";

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-paper/85 backdrop-blur-md z-50 border-b border-line">
      <div className="container-main flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-xl text-ink no-underline flex items-baseline"
        >
          liam<span className="text-accent text-3xl leading-none">.</span>
        </Link>

        {/* Desktop links + theme toggle */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex list-none gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
            inline-flex items-center min-h-[44px] text-[11px] font-semibold uppercase tracking-[0.1em] no-underline transition-colors
            ${
              isActive(link.href)
                ? "text-accent-deep"
                : "text-muted hover:text-ink"
            }
          `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + dropdown */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-haspopup="menu"
              aria-label={`Sections (currently ${activeLabel})`}
              className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-lg text-sm font-medium text-ink hover:bg-surface transition-colors"
            >
              {activeLabel}
              <CaretDownIcon
                size={16}
                aria-hidden
                className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {mobileMenuOpen && (
              <div
                role="menu"
                aria-label="Sections"
                className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-line shadow-lg py-2 min-w-[140px]"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={handleLinkClick}
                    className={`
                      flex items-center px-4 min-h-[44px] text-sm no-underline transition-colors
                      ${
                        isActive(link.href)
                          ? "text-ink bg-paper font-medium"
                          : "text-muted hover:bg-paper hover:text-ink"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
