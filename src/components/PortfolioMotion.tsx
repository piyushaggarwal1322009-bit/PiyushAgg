"use client";

import { useEffect } from "react";

export function PortfolioMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".portfolio-hero");
    if (!hero) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const trailDuration = 720;
    const maxTrailPoints = 24;
    let frame = 0;
    let lastPoint: { x: number; y: number } | null = null;
    let points: Array<{ x: number; y: number; time: number }> = [];
    const clearTrail = () => {
      points = [];
      lastPoint = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      hero.classList.remove("is-pointer-active");
      hero.style.removeProperty("--trail-mask");
    };
    const paint = (time: number) => {
      points = points.filter((point) => time - point.time < trailDuration);
      if (!points.length) { clearTrail(); return; }
      const mask = points.map((point) => {
        const age = (time - point.time) / trailDuration;
        return `radial-gradient(circle ${(5.4 - age * 2.4).toFixed(1)}rem at ${point.x}% ${point.y}%, #000 0%, rgba(0,0,0,${(1 - age).toFixed(2)}) ${Math.max(14, 32 - age * 12).toFixed(1)}%, transparent ${Math.max(42, 68 - age * 12).toFixed(1)}%)`;
      }).join(",");
      hero.style.setProperty("--trail-mask", mask);
      hero.classList.add("is-pointer-active");
      frame = requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) {
        clearTrail();
        return;
      }
      const bounds = hero.getBoundingClientRect();
      const point = { x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)) };
      const time = performance.now();
      if (!lastPoint) {
        points.push({ ...point, time });
      } else {
        const steps = Math.max(1, Math.min(8, Math.ceil(Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) / 3)));
        for (let index = 1; index <= steps; index++) points.push({ x: lastPoint.x + (point.x - lastPoint.x) * index / steps, y: lastPoint.y + (point.y - lastPoint.y) * index / steps, time });
      }
        points = points.slice(-maxTrailPoints);
      lastPoint = point;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const handlePreferenceChange = () => {
      if (!finePointer.matches || reducedMotion.matches) clearTrail();
    };
    hero.addEventListener("pointermove", move, { passive: true });
    finePointer.addEventListener("change", handlePreferenceChange);
    reducedMotion.addEventListener("change", handlePreferenceChange);
    return () => {
      hero.removeEventListener("pointermove", move);
      finePointer.removeEventListener("change", handlePreferenceChange);
      reducedMotion.removeEventListener("change", handlePreferenceChange);
      clearTrail();
    };
  }, []);
  return null;
}
