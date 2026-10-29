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
      initial={{ opacity: 0.86, y: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="editorial-copy">
        <div className="editorial-meta-row">
          <span className="editorial-template-badge">
            {isInterviewStudio ? "INTERVIEW STUDIO" : "COLLABORATION WORKSPACE"}
          </span>
          <span className={`project-status ${project.status === "Collaborative workspace" ? "is-active" : ""}`}>
            {project.status}
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

  return (
    <div className="mock-app synkro-workspace-mock" role="region" aria-label="Synkro collaboration workspace preview">
      <div className="mock-app-head">
        <span className="mock-app-icon">S</span>
        <div>
          <strong>Synkro Workspace</strong>
          <small>Room: sprint-core · ID: #842-WKSP</small>
        </div>
        <div className="synkro-presence-pill" aria-label="3 team members online">
          <span className="synkro-status-dot" aria-hidden="true" />
          <span>3 ONLINE</span>
        </div>
      </div>

      <div className="synkro-room-bar">
        <div className="synkro-avatars" aria-label="Active collaborators in room">
          <span className="synkro-avatar avatar-me" title="Piyush (You)">PA</span>
          <span className="synkro-avatar avatar-collab-1" title="Sarthak (Editor)">SM</span>
          <span className="synkro-avatar avatar-collab-2" title="Collaborator">AK</span>
          <span className="synkro-invite-code">Invite: SYNK-842</span>
        </div>
        <div className="synkro-tabs" role="tablist" aria-label="Workspace document types">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "docs"}
            className={`synkro-tab ${activeTab === "docs" ? "is-active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            <FileText size={12} aria-hidden="true" /> Docs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "notes"}
            className={`synkro-tab ${activeTab === "notes" ? "is-active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            <BookOpen size={12} aria-hidden="true" /> Notes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "slides"}
            className={`synkro-tab ${activeTab === "slides" ? "is-active" : ""}`}
            onClick={() => setActiveTab("slides")}
          >
            <Presentation size={12} aria-hidden="true" /> Slides
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sheets"}
            className={`synkro-tab ${activeTab === "sheets" ? "is-active" : ""}`}
            onClick={() => setActiveTab("sheets")}
          >
            <Sheet size={12} aria-hidden="true" /> Sheets
          </button>
        </div>
      </div>

      <div className="synkro-editor-window">
        {activeTab === "docs" && (
          <div className="synkro-doc-pane">
            <div className="synkro-doc-meta">
              <span className="synkro-doc-title">Project_Architecture_RFC.md</span>
              <span className="synkro-sync-badge">
                <Check size={11} aria-hidden="true" /> Synced to Atlas
              </span>
            </div>
            <div className="synkro-doc-body">
              <p>
                <span className="synkro-cursor-tag">Sarthak typing</span>
                The room state synchronizes via Socket.IO using server-ordered last-write-wins updates and revision history.
              </p>
              <div className="synkro-conflict-notice" role="status">
                <span className="synkro-conflict-pill">Collision check</span>
                <small>Concurrent same-field edit detected on Section 2.3 — review before overwriting</small>
              </div>
            </div>
          </div>
        )}
        {activeTab === "notes" && (
          <div className="synkro-notes-pane">
            <div className="synkro-note-card">
              <strong>Meeting takeaways</strong>
              <p>Shared workspace rooms with invite codes and real-time presence indicators.</p>
            </div>
            <div className="synkro-note-card">
              <strong>Revision safety</strong>
              <p>Room owners can restore earlier versions from MongoDB Atlas revision log.</p>
            </div>
          </div>
        )}
        {activeTab === "slides" && (
          <div className="synkro-slides-pane">
            <div className="synkro-slide-thumb is-active">
              <span>01</span>
              <strong>Real-Time Sync</strong>
              <small>Socket.IO architecture</small>
            </div>
            <div className="synkro-slide-thumb">
              <span>02</span>
              <strong>Document Model</strong>
              <small>Field-level updates</small>
            </div>
          </div>
        )}
        {activeTab === "sheets" && (
          <div className="synkro-sheets-pane">
            <div className="synkro-sheet-grid">
              <div className="synkro-cell synkro-cell-hdr">A1 (Topic)</div>
              <div className="synkro-cell synkro-cell-hdr">B1 (Metric)</div>
              <div className="synkro-cell">Active rooms</div>
              <div className="synkro-cell">14</div>
              <div className="synkro-cell">Total sessions</div>
              <div className="synkro-cell synkro-cell-calc">=SUM(B2:B5)</div>
            </div>
          </div>
        )}
      </div>

      <div className="mock-app-foot">
        Illustrative preview <span>Socket.IO synced · MongoDB Atlas</span>
      </div>
    </div>
  );
}
