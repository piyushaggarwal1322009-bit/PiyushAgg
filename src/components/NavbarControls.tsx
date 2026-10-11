"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const themeKey = "piyush-theme";
const navigation = [
  ["About", "#top"],
  ["Education", "#education"],
  ["Stack", "#stack"],
  ["Projects", "#projects"],
  ["Racing", "#racing"],
  ["Contact", "#contact"],
] as const;

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
    const readPreference = (): Theme => {
      try {
        const stored = window.localStorage.getItem(themeKey);
        if (stored === "light" || stored === "dark") return stored;
      } catch {
        // Fall back to the system preference if storage is unavailable.
      }
      return systemTheme.matches ? "light" : "dark";
    };
    const syncTheme = () => {
      const nextTheme = readPreference();
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };
    syncTheme();

    const followSystem = () => {
      try {
        if (window.localStorage.getItem(themeKey)) return;
      } catch {
        return;
      }
      const nextTheme = systemTheme.matches ? "light" : "dark";
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };
    systemTheme.addEventListener("change", followSystem);
    return () => systemTheme.removeEventListener("change", followSystem);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem(themeKey, nextTheme);
    } catch {
      // The active theme still applies if browser storage is unavailable.
    }
    setTheme(nextTheme);
  };

  return (
    <motion.button
      className="theme-toggle"
      type="button"
      tabIndex={0}
      aria-label="Light mode"
      aria-pressed={theme === "light"}
      onClick={toggleTheme}
      whileTap={reducedMotion ? undefined : { scale: 0.94 }}
      transition={{ duration: reducedMotion ? 0 : 0.16 }}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <Sun className="theme-icon theme-icon-sun" size={17} />
        <Moon className="theme-icon theme-icon-moon" size={17} />
      </span>
    </motion.button>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="nav-mobile-menu">
      <button
        className="nav-menu-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>
      <div id="mobile-navigation" className="nav-mobile-panel" hidden={!open}>
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </div>
    </div>
  );
}