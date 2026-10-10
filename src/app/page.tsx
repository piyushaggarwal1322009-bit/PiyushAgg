import {
  ArrowUpRight,
  Code2,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Terminal,
} from "lucide-react";
import { profile, techStack } from "../data/profile";
import { MagneticLink, Reveal } from "../components/Motion";
import { GitHubActivity } from "../components/Interactive";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { ScrollableIntro } from "../components/ScrollableIntro";

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a href="#top" className="brand">PA<span>.</span></a>
        <div className="nav-links">
          <a href="#top">About</a>
          <a href="#education">Education</a>
          <a href="#stack">Stack</a>
          <a href="#projects">Projects</a>
          <a href="#philosophy">Philosophy</a>
          <a href="#contact">Contact</a>
        </div>
        <MagneticLink href={profile.github} target="_blank" rel="noreferrer" className="nav-github">
          <Github size={16} /> GitHub
        </MagneticLink>
      </nav>

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
                        <span className={`education-school-marker ${index === 0 ? "is-mint" : ""}`} aria-hidden="true" />
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

      <section id="philosophy" className="section philosophy-section">
        <Reveal>
          <div className="section-label">PHILOSOPHY</div>
          <div className="philosophy-intro">
            <Sparkles size={22} />
            <h2>How I think<br /><span>about building.</span></h2>
          </div>
        </Reveal>
        <div className="philosophy-grid">
          {profile.philosophy.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <div className="philosophy-card">
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section now-section">
        <Reveal>
          <div className="now-card">
            <div>
              <div className="section-label">CURRENTLY</div>
              <h2>Learning. Building.<br /><span>Iterating.</span></h2>
            </div>
            <div className="now-list">
              <div><Terminal size={17} /><span>Exploring full-stack engineering</span></div>
              <div><Sparkles size={17} /><span>Experimenting with AI-powered products</span></div>
              <div><Code2 size={17} /><span>Turning hackathon ideas into real projects</span></div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="section contact-section">
        <Reveal>
          <div className="section-label">CONTACT</div>
          <h2>Have an idea?<br /><span>Let&apos;s build.</span></h2>
          <p className="contact-copy">I&apos;m always interested in interesting problems, ambitious projects and people who like building things.</p>
          <div className="contact-links">
            <a href={`mailto:${profile.email}`} className="contact-button"><Mail size={18} /> {profile.email}</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="contact-button"><Github size={18} /> GitHub</a>
          </div>
        </Reveal>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Piyush Aggarwal</span>
        <span>Built with curiosity & code.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}