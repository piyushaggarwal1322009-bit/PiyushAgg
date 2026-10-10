"use client";

import { useEffect, useRef, useState } from "react";

const PROJECT_TOTAL = 4;
const ANIMATION_DURATION = 1000;

export function ProjectCount() {
  const statisticRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const statistic = statisticRef.current;
    if (!statistic) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      const reducedMotionTimer = window.setTimeout(() => setCount(PROJECT_TOTAL), 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const scrollPanel = statistic.closest(".intro-panel");
    let frameId: number | undefined;
    let hasStarted = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasStarted) return;
      hasStarted = true;
      observer.disconnect();

      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / ANIMATION_DURATION, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(PROJECT_TOTAL * easedProgress));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setCount(PROJECT_TOTAL);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, {
      root: scrollPanel,
      threshold: 0.4,
    });

    observer.observe(statistic);

    return () => {
      observer.disconnect();
      if (frameId !== undefined) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="project-statistic" ref={statisticRef} role="img" aria-label="4 projects completed.">
      <span className="project-statistic-value" aria-hidden="true"><span>+</span>{count}</span>
      <span className="project-statistic-label" aria-hidden="true">Projects completed</span>
    </div>
  );
}
