"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { technicalArsenal } from "../data/profile";

export function TechnicalArsenal() {
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.2 });
  const visible = isInView || reducedMotion;

  const renderSkill = (skill: (typeof technicalArsenal)[number], index: number) => (
    <motion.article
      className="portfolio-arsenal-item"
      key={skill.number}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      whileHover={reducedMotion ? undefined : { y: -2, transition: { duration: 0.26, delay: 0, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: reducedMotion ? 0 : 0.48, delay: reducedMotion ? 0 : index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--skill-accent": skill.accent } as CSSProperties}
    >
      <div className="portfolio-arsenal-title">
        <span>{skill.number}</span>
        <h3>{skill.category}</h3>
      </div>
      <div className="portfolio-arsenal-track" aria-hidden="true">
        <motion.span
          className="portfolio-arsenal-fill"
          initial={{ scaleX: reducedMotion ? skill.learningProgress / 100 : 0 }}
          animate={{ scaleX: visible ? skill.learningProgress / 100 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.12 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
        />
      </div>
      <p className="portfolio-arsenal-techs">
        {skill.technologies.map((technology) => <span key={technology}>{technology}</span>)}
      </p>
    </motion.article>
  );

  return (
    <div
      ref={gridRef}
      className="portfolio-arsenal-grid"
    >
      <div className="portfolio-arsenal-row portfolio-arsenal-row-primary">
        {technicalArsenal.slice(0, 4).map(renderSkill)}
      </div>
      <div className="portfolio-arsenal-row portfolio-arsenal-row-centered">
        {technicalArsenal.slice(4).map((skill, index) => renderSkill(skill, index + 4))}
      </div>
    </div>
  );
}