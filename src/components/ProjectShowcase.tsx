"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Check, FileText, Github, Mic, Presentation, Sheet } from "lucide-react";
import { projects } from "../data/projects";
import type { Project } from "../data/projects";

export function ProjectShowcase() {
  return (
    <div className="editorial-showcase" aria-label="Selected projects">
      {projects.map((project, index) => (
        <ProjectEditorialArticle key={project.name} project={project} index={index} />
      ))}
    </div>
  );
}

function ProjectEditorialArticle({ project, index }: { project: Project; index: number }) {
  const reducedMotion = useReducedMotion();
  const isInterviewStudio = project.template === "interview-studio";
  const projectAccent = isInterviewStudio ? "#60A5FA" : "#2DD4BF";

  return (
    <motion.article
      id={`project-${project.name.toLowerCase()}`}
      className={`editorial-project template-${project.template ?? "standard"} ${
        index % 2 === 1 ? "layout-reversed" : "layout-standard"
      }`}
      style={{ "--project-accent": projectAccent } as CSSProperties}
      aria-labelledby={`heading-${project.name.toLowerCase()}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reducedMotion ? 0 : 0.46, delay: reducedMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="editorial-copy">
        <div className="editorial-meta-row">
          <span className="editorial-template-badge">
            {isInterviewStudio ? "INTERVIEW STUDIO" : "COLLABORATION WORKSPACE"}
          </span>
          <span className={`project-status ${project.status === "Collaborative workspace" ? "is-active" : ""}`}>
            {project.status === "Collaborative workspace" ? "Built for teams" : project.status}
          </span>
        </div>

        <h3 id={`heading-${project.name.toLowerCase()}`} className="editorial-title">
          {project.name}
        </h3>
        <p className="editorial-eyebrow">{project.eyebrow}</p>
        <p className="editorial-description">{project.description}</p>

        <div className="editorial-tags" aria-label="Technology stack">
          {project.stack.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="editorial-actions">
          {project.live ? (
            <a className="button primary" href={project.live} target="_blank" rel="noreferrer">
              Live Demo <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          ) : (
            <span className="project-unavailable">Demo unavailable</span>
          )}
          {project.github ? (
            <a className="button ghost" href={project.github} target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden="true" /> Source
            </a>
          ) : (
            <span className="project-unavailable">Source unavailable</span>
          )}
        </div>
      </div>

      <div className="editorial-preview-wrap">
        {isInterviewStudio ? <GrillrStudioPreview /> : <SynkroWorkspacePreview />}
      </div>
    </motion.article>
  );
}

function GrillrStudioPreview() {
  const reducedMotion = useReducedMotion();
  const scoreRadius = 27;
  const scoreCircumference = 2 * Math.PI * scoreRadius;
  const scoreOffset = scoreCircumference * 0.33;
  const insights = [
    { label: "Structure", value: "Strong", tone: "positive" },
    { label: "Clarity", value: "Good", tone: "neutral" },
    { label: "Specificity", value: "Add more detail", tone: "focus" },
  ] as const;

  return (
    <motion.div
      className="grillr-studio-mock"
      role="region"
      aria-label="Illustrative Grillr interview workspace"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.header
        className="grillr-preview-header"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.08 }}
      >
        <div className="grillr-preview-brand">
          <span className="grillr-preview-mark" aria-hidden="true"><i /><i /><i /></span>
          <div>
            <strong>Grillr</strong>
            <small>Interview practice</small>
          </div>
        </div>
        <span className="grillr-preview-label"><i aria-hidden="true" />Preview</span>
      </motion.header>

      <div className="grillr-preview-layout">
        <main className="grillr-interview-main">
          <motion.div
            className="grillr-question-block"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.34, delay: reducedMotion ? 0 : 0.16 }}
          >
            <div className="grillr-question-meta">
              <span>Behavioral interview</span>
            </div>
            <h4>Tell me about a time you solved a difficult problem.</h4>
          </motion.div>

          <div className="grillr-listening-area">
            <div className="grillr-preview-waveform" role="img" aria-label="Illustrative waveform preview; microphone is not active">
              {Array.from({ length: 32 }, (_, index) => {
                const barHeight = 20 + ((index * 13) % 23);
                const listeningScale = 0.42 + ((index * 3) % 6) * 0.09;
                return (
                  <i
                    key={index}
                    style={{
                      height: `${barHeight}px`,
                      "--wave-peak": listeningScale,
                      "--wave-delay": `${index * 0.018}s`,
                      "--wave-duration": `${1.2 + (index % 5) * 0.1}s`,
                    } as CSSProperties}
                  />
                );
              })}
            </div>
            <div className="grillr-listening-row">
              <span><Mic size={14} aria-hidden="true" />Microphone idle</span>
              <span className="grillr-preview-note">Visual preview</span>
            </div>
          </div>

          <nav className="grillr-preview-stages" aria-label="Interview practice stages">
            <ol>
              <li aria-current="step">Answer</li>
              <li aria-hidden="true">→</li>
              <li>Review</li>
              <li aria-hidden="true">→</li>
              <li>Improve</li>
            </ol>
          </nav>
        </main>

        <aside className="grillr-analysis-panel" aria-labelledby="grillr-analysis-title">
          <motion.div
            className="grillr-analysis-inner"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.34, delay: reducedMotion ? 0 : 0.24 }}
          >
            <div className="grillr-analysis-heading">
              <h5 id="grillr-analysis-title">Illustrative insights</h5>
              <span>Preview</span>
            </div>

            <div className="grillr-score-summary">
              <svg className="grillr-score-ring" viewBox="0 0 72 72" role="img" aria-label="Illustrative score: 67 out of 100">
                <circle className="grillr-score-track" cx="36" cy="36" r={scoreRadius} />
                <motion.circle
                  className="grillr-score-progress"
                  cx="36"
                  cy="36"
                  r={scoreRadius}
                  strokeDasharray={scoreCircumference}
                  initial={{ strokeDashoffset: scoreCircumference }}
                  whileInView={{ strokeDashoffset: scoreOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.22, ease: "easeOut" }}
                />
              </svg>
              <div className="grillr-score-copy">
                <strong>67 <span>/ 100</span></strong>
                <small>Sample score</small>
              </div>
            </div>

            <div className="grillr-insight-list">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.label}
                  className="grillr-insight-row"
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : 0.32 + index * 0.06 }}
                >
                  <span className={`grillr-insight-marker is-${insight.tone}`} aria-hidden="true" />
                  <span>{insight.label}</span>
                  <strong>{insight.value}</strong>
                </motion.div>
              ))}
            </div>

            <p className="grillr-analysis-note">Try mentioning the specific tools or decisions that helped you solve the problem.</p>
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
}

function SynkroWorkspacePreview() {
  const [activeTab, setActiveTab] = useState<"docs" | "notes" | "slides" | "sheets">("docs");
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="mock-app synkro-workspace-mock"
      role="region"
      aria-label="Illustrative Synkro collaboration workspace preview"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.header
        className="mock-app-head synkro-preview-header"
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.08 }}
      >
        <span className="mock-app-icon synkro-brand-mark" aria-label="Synkro logo">
          <span className="synkro-mark-line synkro-mark-line-one" aria-hidden="true" />
          <span className="synkro-mark-line synkro-mark-line-two" aria-hidden="true" />
        </span>
        <div>
          <strong>Synkro</strong>
          <small>Room: sprint-core · #842-WKSP</small>
        </div>
        <div className="synkro-presence-pill" aria-label="Three sample collaborators shown in this preview">
          <span className="synkro-preview-status-dot" aria-hidden="true" />
          <span>Preview</span>
        </div>
      </motion.header>

      <motion.div
        className="synkro-room-bar"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.28, delay: reducedMotion ? 0 : 0.14 }}
      >
        <div className="synkro-avatars" aria-label="Sample collaborators">
          <span className="synkro-avatar avatar-me" title="Sample owner">PA</span>
          <span className="synkro-avatar avatar-collab-1" title="Sample editor">SM</span>
          <span className="synkro-avatar avatar-collab-2" title="Sample teammate">AK</span>
          <span className="synkro-invite-code">Sample invite: SYNK-842</span>
        </div>
        <div className="synkro-tabs" role="tablist" aria-label="Workspace document types">
          <button
            type="button"
            role="tab"
            id="synkro-tab-docs"
            aria-controls="synkro-tab-panel"
            aria-selected={activeTab === "docs"}
            className={`synkro-tab ${activeTab === "docs" ? "is-active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            <FileText size={12} aria-hidden="true" /> Docs
          </button>
          <button
            type="button"
            role="tab"
            id="synkro-tab-notes"
            aria-controls="synkro-tab-panel"
            aria-selected={activeTab === "notes"}
            className={`synkro-tab ${activeTab === "notes" ? "is-active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <BookOpen size={12} aria-hidden="true" /> Notes
          </button>
          <button
            type="button"
            role="tab"
            id="synkro-tab-slides"
            aria-controls="synkro-tab-panel"
            aria-selected={activeTab === "slides"}
            className={`synkro-tab ${activeTab === "slides" ? "is-active" : ""}`}
            onClick={() => setActiveTab("slides")}
          >
            <Presentation size={12} aria-hidden="true" /> Slides
          </button>
          <button
            type="button"
            role="tab"
            id="synkro-tab-sheets"
            aria-controls="synkro-tab-panel"
            aria-selected={activeTab === "sheets"}
            className={`synkro-tab ${activeTab === "sheets" ? "is-active" : ""}`}
            onClick={() => setActiveTab("sheets")}
          >
            <Sheet size={12} aria-hidden="true" /> Sheets
          </button>
        </div>
      </motion.div>

      <motion.div
        key={activeTab}
        id="synkro-tab-panel"
        role="tabpanel"
        aria-labelledby={`synkro-tab-${activeTab}`}
        className="synkro-editor-window"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.18 }}
      >
        {activeTab === "docs" && (
          <div className="synkro-doc-pane">
            <div className="synkro-doc-meta">
              <span className="synkro-doc-title">Project_Architecture.md</span>
              <span className="synkro-sync-badge" aria-label="Illustrative sync preview">
                <Check size={11} aria-hidden="true" /> Preview synced
              </span>
            </div>
            <div className="synkro-doc-body">
              <p>
                <span className="synkro-collaborator-label">Editing</span>
                <span className="synkro-caret" aria-hidden="true" />
                Define service boundaries, collaboration events, and room-level permissions for the next release.
              </p>
              <div className="synkro-doc-footer-row">
                <span className="synkro-typing-dots" aria-hidden="true"><i /><i /><i /></span>
                <small>Shared edit in progress</small>
              </div>
            </div>
          </div>
        )}
        {activeTab === "notes" && (
          <div className="synkro-notes-pane">
            <div className="synkro-note-card">
              <strong>Release notes</strong>
              <p><span className="synkro-check" aria-hidden="true" /> Team handoff ready for launch review.</p>
            </div>
            <div className="synkro-note-card">
              <strong>Project checklist</strong>
              <p><span className="synkro-check" aria-hidden="true" /> Room permissions and review cadence aligned.</p>
            </div>
          </div>
        )}
        {activeTab === "slides" && (
          <div className="synkro-slides-pane">
            <div className="synkro-slide-thumb is-active">
              <span>01</span>
              <strong>Release plan</strong>
              <small>Scope and dependencies</small>
            </div>
            <div className="synkro-slide-thumb">
              <span>02</span>
              <strong>Team rituals</strong>
              <small>Review and handoff</small>
            </div>
          </div>
        )}
        {activeTab === "sheets" && (
          <div className="synkro-sheets-pane">
            <div className="synkro-sheet-grid">
              <div className="synkro-cell synkro-cell-hdr">Task</div>
              <div className="synkro-cell synkro-cell-hdr">Owner</div>
              <div className="synkro-cell">Roadmap sync</div>
              <div className="synkro-cell">Piyush</div>
              <div className="synkro-cell">Launch checklist</div>
              <div className="synkro-cell synkro-cell-status">Ready</div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="mock-app-foot">
        Illustrative workspace preview <span>Docs · Notes · Slides · Sheets</span>
      </div>
    </motion.div>
  );
}
