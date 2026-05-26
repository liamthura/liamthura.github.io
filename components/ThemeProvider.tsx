"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (next: Theme) => void;
  resolved: Resolved;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

const STORAGE_KEY = "theme";

function readStored(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* localStorage may throw in private mode — ignore */
  }
  return "system";
}

function isSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(theme: Theme): Resolved {
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return isSystemDark() ? "dark" : "light";
}

function applyResolved(resolved: Resolved) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR-safe defaults; the no-FOUC inline script in <head> has already
  // applied the correct class to <html> before hydration.
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolvedState] = useState<Resolved>("light");

  // On mount, hydrate React state from localStorage. The inline <head> script
  // already applied the correct class to <html> before paint; this effect
  // just syncs the React state to match. The setState calls here are the
  // canonical "read once from the platform" pattern.
  useEffect(() => {
    const initial = readStored();
    const initialResolved = resolve(initial);
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState(initial);
    setResolvedState(initialResolved);
    /* eslint-enable react-hooks/set-state-in-effect */
    applyResolved(initialResolved);
  }, []);

  // Track system changes only while theme === "system".
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next: Resolved = mql.matches ? "dark" : "light";
      setResolvedState(next);
      applyResolved(next);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    // Add a brief transition class so the colour swap fades rather than snaps.
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 220);
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    const nextResolved = resolve(next);
    setThemeState(next);
    setResolvedState(nextResolved);
    applyResolved(nextResolved);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, resolved }),
    [theme, setTheme, resolved],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Inline script string that runs in <head> before React hydrates. Sets the
 * `dark` class on <html> synchronously so the first paint is correct.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var t=(s==='light'||s==='dark'||s==='system')?s:'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
