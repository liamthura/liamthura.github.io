"use client";

import { useEffect, useRef, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  DesktopIcon,
  CheckIcon,
} from "@phosphor-icons/react";
import { useTheme, type Theme } from "./ThemeProvider";

const OPTIONS: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
];

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Pick the icon to show on the trigger:
  //  - In "system" mode, show the system's current resolved icon
  //  - Otherwise, show the explicit choice
  const TriggerIcon =
    theme === "system"
      ? resolved === "dark"
        ? MoonIcon
        : SunIcon
      : theme === "dark"
        ? MoonIcon
        : SunIcon;

  const triggerLabel =
    theme === "system"
      ? `Theme: System (currently ${resolved})`
      : `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        title={triggerLabel}
        className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-warm-gray hover:text-charcoal hover:bg-warm-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30"
      >
        <TriggerIcon
          size={17}
          weight={resolved === "dark" ? "fill" : "regular"}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Theme"
          className="absolute right-0 top-full mt-2 bg-warm-white rounded-xl border border-soft-border shadow-lg py-1 min-w-[150px] z-50"
        >
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors
                  ${
                    active
                      ? "text-charcoal font-medium bg-cream"
                      : "text-warm-gray hover:bg-cream hover:text-charcoal"
                  }
                `}
              >
                <Icon size={15} weight={active ? "fill" : "regular"} />
                <span className="flex-1">{opt.label}</span>
                {active && (
                  <CheckIcon
                    size={13}
                    weight="bold"
                    className="text-charcoal/60"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
