import {
  ArrowUpRight,
  Github,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { profile, techStack } from "../data/profile";
import { EntranceNav, MagneticLink, Reveal, ScrollExit } from "../components/Motion";
import { GitHubActivity } from "../components/Interactive";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { ScrollableIntro } from "../components/ScrollableIntro";
import { MobileMenu, ThemeToggle } from "../components/NavbarControls";

export default function Home() {
  return (
    <main>
      <EntranceNav className="nav">
        <a href="#top" className="brand">PA<span>.</span></a>
        <div className="nav-links">
          <a href="#top">About</a>
          <a href="#education">Education</a>
          <a href="#stack">Stack</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
        <MobileMenu />
        <ThemeToggle />
        <MagneticLink href="#contact" className="nav-connect">
          <span>Connect</span><ArrowUpRight size={16} aria-hidden="true" />
        </MagneticLink>
      </EntranceNav>

      <section id="top" className="intro-layout" aria-label="Introduction">
        <aside className="profile-card" aria-label="Piyush Aggarwal profile">
          <div className="profile-details">
            <div className="profile-kicker"><span /> STUDENT DEVELOPER</div>
            <h2>{profile.name}</h2>
            <p className="profile-degree">{profile.degree} <span>(AI / ML)</span></p>
            <p className="profile-intro">{profile.tagline}</p>
            <div className="profile-socials" aria-label="Social links">
              <a href={profile.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>
              <a href={`mailto:${profile.email}`}><Mail size={17} /> Email <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </aside>

        <ScrollableIntro>
          <section id="education" className="intro-section education-section intro-education">
            <Reveal>
              <div className="education-heading">
                <h2>
                  <span className="education-title-strong">Building my</span>
                  <br />
                  <span className="education-title-soft">foundation.</span>
                </h2>
                <p>A path through formal study and the practical skills I keep developing by building.</p>
              </div>
            </Reveal>
            <div className="education-story">
              <Reveal>
                <article className="education-primary">
                  <div className="education-primary-top">
                    <span className="education-icon" aria-hidden="true">
                      <GraduationCap size={21} strokeWidth={1.7} />
                    </span>
                    <span className="education-kicker">UNDERGRADUATE STUDY</span>
                  </div>

                  <h3 className="education-degree">
                    B.Tech in Computer Science Engineering <span className="education-specialty">(AI / ML)</span>
                  </h3>
                  <p className="education-institution">{profile.university}</p>
                  <p className="education-description">
                    Studying computer science while developing practical engineering skills through project work.
                  </p>

                  <div className="education-primary-foot">
                    <span className="education-progress"><i aria-hidden="true" />{profile.educationStatus}</span>
                    <span className="education-location"><MapPin size={14} /> Sonepat, India</span>
                  </div>
                </article>
              </Reveal>

              <div className="education-previous">
                <div className="education-previous-heading">
                  <span>PREVIOUS STUDY</span>
                </div>
                <div className="education-school-list" aria-label="Previous education">
                  {profile.previousSchools.map((school, index) => (
                    <Reveal key={school.name} delay={index * 0.08}>
                      <article className="education-school">
                        <span className={`education-school-marker ${school.status.toLowerCase() === "completed" ? "is-complete" : ""}`} aria-hidden="true" />
                        <div className="education-school-copy">
                          <div className="education-school-meta">
                            <span>{school.level}</span>
                            <span>{school.status}</span>
                          </div>
                          <h3>{school.name}</h3>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="stack" className="intro-section intro-stack" aria-labelledby="stack-heading">
            <Reveal>
              <h2 id="stack-heading" className="intro-title"><span>TECHNICAL</span><span>ARSENAL</span></h2>
              <p className="arsenal-intro">Tools and technologies I use to explore ideas and build useful products.</p>
            </Reveal>
            <div className="arsenal-list">
              {Object.entries(techStack).map(([category, items], index) => (
                <Reveal key={category} delay={index * 0.045}>
                  <div className="arsenal-group">
                    <h3>{({ ai: "AI / ML", other: "Tools & ecosystem" } as Record<string, string>)[category] ?? category}</h3>
                    <div className="arsenal-items">
                      {items.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </ScrollableIntro>
      </section>

      <section id="projects" className="section projects-section">
        <Reveal>
          <div className="section-label">SELECTED WORK</div>
          <div className="section-heading-row">
            <h2>Ideas that became<br /><span>projects.</span></h2>
            <p>I care about the problem, the product and the engineering behind the interface.</p>
          </div>
        </Reveal>

        <ProjectShowcase />
      </section>

      <ScrollExit>
        <section className="section activity-section">
          <Reveal>
            <div className="section-label">OPEN SOURCE TRAIL</div>
            <div className="section-heading-row">
              <h2>Code in motion.<br /><span>Progress over perfection.</span></h2>
              <p>A live GitHub contribution view gives visitors another way to explore the work behind the portfolio.</p>
            </div>
            <GitHubActivity />
          </Reveal>
        </section>
      </ScrollExit>

      <section id="contact" className="closing-hero-section" aria-label="Contact and collaboration">
        <Reveal>
          <div className="closing-content">
            <div className="section-label">LET’S WORK TOGETHER</div>
            <h2 className="closing-headline">
              Building thoughtful<br />digital experiences.
            </h2>
            <p className="closing-lede">
              Open to interesting problems, ambitious ideas, and collaborative work.
            </p>
            <div className="closing-actions">
              <a href={`mailto:${profile.email}`} className="closing-btn closing-btn-primary">
                <Mail size={16} aria-hidden="true" />
                <span>Email Piyush</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="closing-btn closing-btn-secondary"
              >
                <Github size={16} aria-hidden="true" />
                <span>GitHub</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="closing-status">
              <span className="closing-status-dot" aria-hidden="true" />
              <span>Based in Delhi, India · Student Developer</span>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="minimal-footer">
        <div className="minimal-footer-inner">
          <span>© {new Date().getFullYear()} Piyush Aggarwal</span>
          <span className="minimal-footer-divider" aria-hidden="true">·</span>
          <span>Built with curiosity &amp; code.</span>
          <a href="#top" className="minimal-footer-top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}