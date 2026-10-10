"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { projects } from "../data/projects";

const projectAccents: Record<string, string> = {
  grillr: "#60A5FA",
  "jal-dhara": "#A78BFA",
  ezykwelez: "#5EEAD4",
  "migration-y": "#FB7185",
};

export function ProjectShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [previousProjectAccent, setPreviousProjectAccent] = useState("#60A5FA");
  const wheelLock = useRef(false);
  const wheelTimer = useRef<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const showcaseRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const previewIsVisible = useInView(showcaseRef, { once: false, amount: 0.1 });
  const project = projects[index];
  const projectAccent = projectAccents[project.previewKey ?? ""] ?? "#60A5FA";

  const move = useCallback((delta: number) => {
    setPreviousProjectAccent(projectAccent);
    setDirection(delta);
    setIndex((current) => (current + delta + projects.length) % projects.length);
  }, [projectAccent]);

  useEffect(() => () => {
    if (wheelTimer.current !== null) window.clearTimeout(wheelTimer.current);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))) return;
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 45 || wheelLock.current) return;
    if (event.cancelable) event.preventDefault();
    wheelLock.current = true;
    move(delta > 0 ? 1 : -1);
    if (wheelTimer.current !== null) window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(() => { wheelLock.current = false; }, 520);
  };

  return (
    <section ref={showcaseRef} className="showcase-shell" data-preview-visible={previewIsVisible} style={{ "--project-accent": projectAccent } as CSSProperties} aria-label="Selected projects" aria-roledescription="carousel" tabIndex={0} onKeyDown={onKeyDown}>
      <div className="showcase-stage" onWheel={onWheel} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current; if (Math.abs(distance) > 55) move(distance < 0 ? 1 : -1); touchStart.current = null; }}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article key={project.name} className="showcase-project" custom={direction}
            initial={{ opacity: 0.88, x: direction * 26 }}
            animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0.52, x: direction * -22 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="showcase-copy">
              <div className="showcase-project-meta"><span className="project-status">{project.status}</span></div>
              <motion.h3
                key={`${project.name}-title`}
                initial={{ opacity: 0.84, y: 12, color: previousProjectAccent }}
                animate={{ opacity: 1, y: 0, color: projectAccent }}
                transition={{ duration: reducedMotion ? 0 : 0.48, delay: reducedMotion ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
              >{project.name}</motion.h3>
              <p className="showcase-eyebrow">{project.eyebrow}</p>
              <motion.p
                className="showcase-description"
                initial={{ opacity: 0.88, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              >{project.description}</motion.p>
              <motion.ul
                className="showcase-highlights"
                initial={{ opacity: 0.88, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.42, delay: reducedMotion ? 0 : 0.19, ease: [0.22, 1, 0.36, 1] }}
              >{project.highlights.slice(0, 3).map((highlight) => <li key={highlight}>{highlight}</li>)}</motion.ul>
              <div className="showcase-tags">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="showcase-actions">
                {project.live ? <a className="button primary" href={project.live} target="_blank" rel="noreferrer">Live Demo <ArrowUpRight size={17} /></a> : <span className="project-unavailable">Demo unavailable</span>}
                {project.github ? <a className="button ghost" href={project.github} target="_blank" rel="noreferrer"><Github size={17} /> Source</a> : <span className="project-unavailable">Source unavailable</span>}
              </div>
            </div>
            <motion.div
              className={`showcase-preview preview-${project.previewKey ?? "generic"}`}
              role="img"
              aria-label={`${project.name} visual preview`}
              initial={{ opacity: 0.9, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="preview-content" aria-hidden="true">
                {project.previewKey === "grillr" ? <GrillrPreview /> : project.previewKey === "jal-dhara" ? <WaterPreview /> : project.previewKey === "ezykwelez" ? <CampusPreview /> : <MigrationPreview />}
              </div>
            </motion.div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="showcase-controls"><span className="showcase-hint">SCROLL OR SWIPE TO EXPLORE</span><div className="showcase-progress">{projects.map((item, i) => <button key={item.name} aria-label={`Show ${item.name}`} aria-current={i === index ? "step" : undefined} className={i === index ? "active" : ""} onClick={() => { setPreviousProjectAccent(projectAccent); setDirection(i > index ? 1 : -1); setIndex(i); }} />)}</div><div className="showcase-arrows"><button aria-label="Previous project" onClick={() => move(-1)}><ArrowLeft size={17}/></button><button aria-label="Next project" onClick={() => move(1)}><ArrowRight size={17}/></button></div></div>
    </section>
  );
}

function GrillrPreview() {
  return (
    <div className="mock-app grillr-mock">
      <div className="mock-app-head">
        <span className="mock-app-icon">G</span>
        <div><strong>Grillr</strong><small>Interview practice</small></div>
        <span className="mock-live">SAMPLE</span>
      </div>
      <div className="grillr-preview-grid">
        <div className="mock-question">
          <small>BEHAVIORAL · QUESTION</small>
          <h4>Tell me about a time you solved a difficult problem.</h4>
          <div className="waveform" aria-label="Illustrative audio waveform">
            {Array.from({ length: 30 }, (_, index) => (
              <i key={index} style={{ height: `${10 + ((index * 17) % 28)}px`, animationDelay: `${index * 25}ms` }} />
            ))}
          </div>
          <small>Sample response</small>
        </div>
        <div className="mock-analysis">
          <small>ILLUSTRATIVE FEEDBACK</small>
          <strong>Answer review</strong>
          <div className="mock-feedback-meter"><span>Structure</span><i><b /></i></div>
          <div className="mock-feedback-meter"><span>Comms</span><i><b /></i></div>
          <div className="mock-feedback-meter"><span>Specifics</span><i><b /></i></div>
        </div>
      </div>
      <div className="mock-app-foot">Illustrative preview <span>No live interview results</span></div>
    </div>
  );
}

function WaterPreview() {
  return (
    <div className="water-mock">
      <div className="water-network">
        <svg viewBox="0 0 400 230" role="img" aria-label="Illustrative water network preview">
          <path className="water-route" d="M20 120 C80 30 120 200 190 105 S290 25 380 95" />
          <path className="water-route" d="M20 120 C110 130 130 35 220 160 S320 200 380 95" />
          <path className="water-route" d="M20 120 L100 55 L190 105 L270 60 L380 95" />
          {[[20, 120], [100, 55], [190, 105], [270, 60], [380, 95], [220, 160], [320, 190]].map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="7" />
          ))}
        </svg>
        <div className="water-legend"><span>● Network nodes</span><span>↗ Flow paths</span></div>
      </div>
    </div>
  );
}

function CampusPreview() {
  return (
    <div className="campus-mock">
      <div className="campus-heading">
        <div><small>EZYKWELEZ / OPERATIONS</small><strong>Incident response</strong></div>
        <span>Workflow</span>
      </div>
      <div className="campus-flow"><span>Report</span><i /><span>Map impact</span><i /><span>Recovery</span></div>
      <div className="campus-map">
        <div className="campus-map-lines" />
        <span className="campus-node node-a">Power</span>
        <span className="campus-node node-b">Network</span>
        <span className="campus-node node-c">Library</span>
        <span className="campus-node node-d">Labs</span>
      </div>
    </div>
  );
}

function MigrationPreview() {
  return (
    <div className="migration-mock">
      <div className="migration-heading">
        <span>LOCAL PROTOTYPE</span><strong>Migration rehearsal</strong><small>PostgreSQL · sample dataset</small>
      </div>
      <div className="migration-steps">
        <div><span>01</span><strong>Generate dataset</strong><small>50,000 sample orders</small></div>
        <div><span>02</span><strong>Apply migration</strong><small>Sample SQL change</small></div>
        <div><span>03</span><strong>Compare query</strong><small>Before / after latency</small></div>
      </div>
    </div>
  );
}
