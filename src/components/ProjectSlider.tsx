"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import type { Project } from "../data/projects";
import { ProjectSlide } from "./ProjectSlide";

type ProjectSliderProps = {
  projects: Project[];
};

export function ProjectSlider({ projects }: ProjectSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartedOnControl = useRef(false);
  const activeProject = projects[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, projects.length - 1)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(projects.length - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartedOnControl.current =
      event.target instanceof HTMLElement &&
      Boolean(event.target.closest("a, button, input, select, textarea"));
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null || touchStartedOnControl.current) return;

    const distance = event.changedTouches[0]?.clientX - startX;
    if (distance > 60) goTo(activeIndex - 1);
    if (distance < -60) goTo(activeIndex + 1);
  };

  if (!activeProject) return null;

  return (
    <div className="project-slider">
      <div className="slider-toolbar">
        <p className="slider-position" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i>/</i>
          {String(projects.length).padStart(2, "0")}
          <i className="slider-position-dash">—</i>
          <strong>{activeProject.name.toUpperCase()}</strong>
        </p>
        <div className="slider-controls" aria-label="Project navigation">
          <button
            type="button"
            className="slider-arrow"
            aria-label="Previous project"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            className="slider-arrow"
            aria-label="Next project"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        className="project-slider-stage"
        role="region"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <ProjectSlide
            key={activeProject.previewKey ?? activeProject.name}
            project={activeProject}
            index={activeIndex}
          />
        </AnimatePresence>
      </div>

      <div className="slider-progress" aria-label="Choose a project">
        {projects.map((project, index) => (
          <button
            key={project.previewKey ?? project.name}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`Show project ${index + 1}: ${project.name}`}
            aria-current={index === activeIndex ? "step" : undefined}
            onClick={() => goTo(index)}
          >
            <span />
          </button>
        ))}
        <span className="slider-progress-caption">
          {activeIndex + 1} of {projects.length}
        </span>
      </div>
    </div>
  );
}
