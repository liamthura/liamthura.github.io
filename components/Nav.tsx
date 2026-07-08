"use client";

// Nav.tsx - Desktop top nav + mobile dropdown
// Mobile: shows current section with chevron, expands on click

import { useEffect, useState, useRef } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#", sectionId: "" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Projects", href: "#projects", sectionId: "projects" },
  { label: "Work", href: "#experience", sectionId: "experience" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const sections = document.querySelectorAll("section[id]");

      // Check if at top (hero)
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveSection(sectionId || "");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLabel =
    navLinks.find((link) => link.sectionId === activeSection)?.label || "Home";

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-paper/85 backdrop-blur-md z-50 border-b border-line">
      <div className="container-main flex justify-between items-center h-16">
        {/* Logo */}
        <a
          href="#"
          className="font-display font-bold text-xl text-ink no-underline flex items-center gap-2"
        >
          khant<span className="text-accent">.</span>
        </a>

        {/* Desktop links + theme toggle */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex list-none gap-8">
            {navLinks
              .filter((link) => link.sectionId !== "")
              .map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`
            text-[11px] font-semibold uppercase tracking-[0.1em] no-underline transition-colors
            ${
              activeSection === link.sectionId
                ? "text-accent-deep"
                : "text-muted hover:text-ink"
            }
          `}
                  >
                    {link.label}
                  </a>
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-ink hover:bg-surface transition-colors"
            >
              {activeLabel}
              <CaretDownIcon
                size={16}
                className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown menu */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-surface rounded-xl border border-line shadow-lg py-2 min-w-[140px]">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`
                      block px-4 py-2 text-sm no-underline transition-colors
                      ${
                        activeSection === link.sectionId
                          ? "text-ink bg-paper font-medium"
                          : "text-muted hover:bg-paper hover:text-ink"
                      }
                    `}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
