"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "../data/projects";
import { ProjectPreview } from "./ProjectPreview";

type ProjectSlideProps = {
  project: Project;
  index: number;
};

export function ProjectSlide({ project, index }: ProjectSlideProps) {
  const reduceMotion = useReducedMotion();
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const projectId = project.previewKey ?? project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <motion.article
      className="project-slide"
      aria-labelledby={`project-title-${projectId}`}
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -22 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="project-slide-info">
        <div className="project-slide-kicker">
          <span className="slide-accent-dot" />
          <span>{project.eyebrow}</span>
          <span>{project.status}</span>
        </div>
        <h3 id={`project-title-${projectId}`}>{project.name}<i>.</i></h3>
        <p className="project-slide-description">{project.description}</p>

        {project.highlights.length > 0 && (
          <div className="slide-features">
            <span className="slide-detail-label">PROJECT DETAILS</span>
            <ul>
              {project.highlights.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {project.stack.length > 0 && (
          <div className="slide-technology-group">
            <span className="slide-detail-label">TECHNOLOGIES</span>
            <div className="slide-technologies" aria-label={`${project.name} technologies`}>
              {project.stack.map((technology) => (
                <button
                  key={technology}
                  type="button"
                  className={selectedTechnology === technology ? "is-selected" : ""}
                  aria-pressed={selectedTechnology === technology}
                  onClick={() =>
                    setSelectedTechnology((selected) => selected === technology ? null : technology)
                  }
                >
                  {technology}
                </button>
              ))}
            </div>
            {selectedTechnology && (
              <p className="selected-technology-note">
                {selectedTechnology} is part of the listed project stack.
              </p>
            )}
          </div>
        )}

        <div className="project-slide-links">
          {project.live && (
            <a
              className="slide-primary-link"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.previewKey === "grillr" ? "Open Live App" : "Live Demo"}
              <ArrowUpRight size={16} />
            </a>
          )}
          {project.github && (
            <a
              className="slide-secondary-link"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={15} /> View Source <ArrowUpRight size={13} />
            </a>
          )}
          {!project.live && (
            <span className="slide-url-note">Live demo unavailable</span>
          )}
        </div>
        <span className="slide-count-note">PROJECT {String(index + 1).padStart(2, "0")}</span>
      </div>

      <ProjectPreview project={project} />
    </motion.article>
  );
}
