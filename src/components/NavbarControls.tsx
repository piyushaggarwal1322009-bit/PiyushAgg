"use client";

import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navigation = [
  ["About", "#main"],
  ["Work", "#work"],
  ["Stack", "#stack"],
  ["Contact", "#contact"],
] as const;

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