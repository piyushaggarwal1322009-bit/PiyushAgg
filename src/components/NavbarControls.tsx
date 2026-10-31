"use client";

import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const themeKey = "piyush-theme";
const navigation = [
  ["About", "#main"],
  ["Work", "#work"],
  ["Stack", "#stack"],
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
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
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

export function PortfolioNavbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header ref={headerRef} className="portfolio-header">
      <a href="#top" className="portfolio-brand" aria-label="Piyush Aggarwal home">
        PA<span aria-hidden="true">✦</span>
      </a>
      <nav className="portfolio-desktop-nav" aria-label="Primary navigation">
        {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="portfolio-nav-actions">
        <ThemeToggle />
        <a
          className="portfolio-header-cta"
          href="/Piyush_Aggarwal_Resume.pdf"
          download="Piyush_Aggarwal_Resume.pdf"
        >
          <Download size={15} aria-hidden="true" />
          Resume
        </a>
        <button
          ref={toggleRef}
          className="portfolio-menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="portfolio-mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </div>
      <nav
        id="portfolio-mobile-navigation"
        className={`portfolio-mobile-nav ${open ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
      >
        {navigation.map(([label, href]) => (
          <a key={href} href={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
    </header>
  );
}