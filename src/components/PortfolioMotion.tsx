"use client";

import { useEffect } from "react";

export function PortfolioMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".portfolio-hero");
    if (!hero || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let point = { x: 50, y: 50 };
    const paint = () => {
      hero.style.setProperty("--cursor-x", `${point.x}%`);
      hero.style.setProperty("--cursor-y", `${point.y}%`);
      hero.classList.add("is-pointer-active");
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      point = { x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)) };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => hero.classList.remove("is-pointer-active");
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
