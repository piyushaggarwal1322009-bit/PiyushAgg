"use client";

import { useEffect } from "react";

export function PortfolioMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".portfolio-hero");
    if (!hero || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const trailDuration = 1500;
    let frame = 0;
    let lastPoint = { x: 50, y: 50 };
    let points: Array<{ x: number; y: number; time: number }> = [];
    const paint = (time: number) => {
      points = points.filter((point) => time - point.time < trailDuration);
      if (!points.length) { hero.classList.remove("is-pointer-active"); frame = 0; return; }
      const mask = points.map((point) => {
        const age = (time - point.time) / trailDuration;
        return `radial-gradient(circle ${(22 - age * 8).toFixed(1)}rem at ${point.x}% ${point.y}%, #000 0%, rgba(0,0,0,${(1 - age).toFixed(2)}) ${Math.max(12, 33 - age * 12).toFixed(1)}%, transparent ${Math.max(48, 74 - age * 14).toFixed(1)}%)`;
      }).join(",");
      hero.style.setProperty("--trail-mask", mask);
      hero.classList.add("is-pointer-active");
      frame = requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      const point = { x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)), y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)) };
      const steps = Math.max(1, Math.min(8, Math.ceil(Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) / 3)));
      for (let index = 1; index <= steps; index++) points.push({ x: lastPoint.x + (point.x - lastPoint.x) * index / steps, y: lastPoint.y + (point.y - lastPoint.y) * index / steps, time: performance.now() });
      lastPoint = point;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = () => undefined;
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => { hero.removeEventListener("pointermove", move); hero.removeEventListener("pointerleave", leave); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
