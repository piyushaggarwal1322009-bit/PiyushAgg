"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Check, FileText, Github, Mic, Presentation, Sheet, Sparkles } from "lucide-react";
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

  return (
    <div className="mock-app grillr-studio-mock" role="region" aria-label="Grillr interview studio preview">
      <div className="mock-app-head">
        <span className="mock-app-icon">G</span>
        <div>
          <strong>Grillr Studio</strong>
          <small>AI Interviewer · Practice Session #104</small>
        </div>
        <div className="studio-recording-pill" aria-label="Microphone live in session">
          <Mic size={12} aria-hidden="true" />
          <span>LISTENING</span>
        </div>
      </div>

      <div className="studio-main">
        <div className="studio-question-card">
          <div className="studio-card-kicker">
            <span>BEHAVIORAL · SYSTEM LEADERSHIP</span>
            <small>Phase 2 of 4</small>
          </div>
          <h4>Tell me about a time you resolved a major engineering bottleneck under a tight deadline.</h4>

          <div className="studio-waveform-box">
            <div className="studio-waveform-bars" aria-label="Simulated voice waveform">
              {Array.from({ length: 34 }, (_, index) => (
                <i
                  key={index}
                  style={{
                    height: `${12 + ((index * 19) % 32)}px`,
                    animationDelay: `${index * 28}ms`,
                  }}
                />
              ))}
            </div>
            <div className="studio-timer-row">
              <span>01:42 / 03:00</span>
              <small>Transcribing audio via Web Audio API & WebSockets…</small>
            </div>
          </div>
        </div>

        <div className="studio-feedback-panel">
          <div className="studio-feedback-head">
            <Sparkles size={13} aria-hidden="true" />
            <strong>Structured Coaching Metrics</strong>
          </div>

          <div className="studio-meters">
            <div className="studio-meter">
              <div className="studio-meter-meta">
                <span>Communication & Tone</span>
                <b>88%</b>
              </div>
              <div className="studio-meter-bar">
                <motion.b
                  initial={{ width: 0 }}
                  whileInView={{ width: "88%" }}
                  viewport={{ once: true }}
                  transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="studio-meter">
              <div className="studio-meter-meta">
                <span>STAR Framework Adherence</span>
                <b>84%</b>
              </div>
              <div className="studio-meter-bar">
                <motion.b
                  initial={{ width: 0 }}
                  whileInView={{ width: "84%" }}
                  viewport={{ once: true }}
                  transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.1, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="studio-meter">
              <div className="studio-meter-meta">
                <span>Specific Engineering Impact</span>
                <b>92%</b>
              </div>
              <div className="studio-meter-bar">
                <motion.b
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  viewport={{ once: true }}
                  transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          <div className="studio-coach-tip">
            <small>AI COACHING ADVICE</small>
            <p>&ldquo;Clear metrics cited on throughput improvement. Highlight the trade-offs in your initial architecture choice before concluding.&rdquo;</p>
          </div>
        </div>
      </div>

      <div className="mock-app-foot">
        Illustrative Interview Studio <span>FastAPI & Supabase coaching engine</span>
      </div>
    </div>
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
