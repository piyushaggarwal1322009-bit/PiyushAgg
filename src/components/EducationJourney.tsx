"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const CURRENT_YEAR = 2026;

const milestones = [
  {
    id: "btech-cse",
    year: String(CURRENT_YEAR),
    date: `${CURRENT_YEAR} — Present`,
    title: "B.Tech — Computer Science and Engineering",
    institution: "SRM University Delhi NCR",
    specialization: "Artificial Intelligence and Machine Learning",
    status: "Currently studying",
    description:
      "Currently pursuing a Bachelor of Technology in Computer Science and Engineering, specializing in Artificial Intelligence and Machine Learning at SRM University Delhi NCR.",
  },
  {
    id: "class-xii",
    year: `${CURRENT_YEAR - 1} – ${CURRENT_YEAR}`,
    date: `${CURRENT_YEAR - 1} – ${CURRENT_YEAR}`,
    title: "Class XII",
    institution: "Darshan Academy",
    status: "Completed",
    description:
      "Completed senior secondary education at Darshan Academy in June 2026.",
  },
  {
    id: "class-x",
    year: String(CURRENT_YEAR - 2),
    date: String(CURRENT_YEAR - 2),
    title: "Class X",
    institution: "Dayanand Public School",
    status: "Completed",
    description:
      "Completed secondary school education at Dayanand Public School in 2024.",
  },
] as const;

export function EducationJourney() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [railHeight, setRailHeight] = useState(0);
  const [progressTrackWidth, setProgressTrackWidth] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.8,
  });
  const markerY = useTransform(smoothScrollProgress, [0, 1], [0, railHeight]);
  const progressX = useTransform(
    smoothScrollProgress,
    [0, 1],
    [0, progressTrackWidth],
  );

  useEffect(() => {
    const rail = railRef.current;
    const progressTrack = progressTrackRef.current;
    if (!rail || !progressTrack) return;

    const observer = new ResizeObserver(() => {
      setRailHeight(rail.getBoundingClientRect().height);
      setProgressTrackWidth(progressTrack.getBoundingClientRect().width);
    });

    observer.observe(rail);
    observer.observe(progressTrack);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(smoothScrollProgress, "change", (progress) => {
    if (!Number.isFinite(progress)) return;

    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const nextIndex = Math.min(
      milestones.length - 1,
      Math.max(0, Math.round(clampedProgress * (milestones.length - 1))),
    );

    setActiveIndex(nextIndex);
  });

  const activeMilestone = milestones[activeIndex];
  const transition = {
    duration: prefersReducedMotion ? 0 : 0.34,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const yearTransition = {
    duration: prefersReducedMotion ? 0 : 0.38,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section
      className="education-journey"
      aria-labelledby="education-journey-heading"
    >
      <div className="education-journey__shell">
        <div className="education-journey__intro">
          <div className="education-journey__sticky">
            <p className="education-journey__eyebrow">MY STORY</p>
            <h2 id="education-journey-heading">
              Let&apos;s go back in time.
            </h2>
            <p className="education-journey__summary">
              A journey of learning, growing, and building my foundation in
              technology.
            </p>

            <div className="education-journey__active" aria-live="polite">
              <div className="education-journey__year-shell">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`year-${activeMilestone.year}`}
                    className={`education-journey__year${
                      activeMilestone.year.includes("–") ? " is-range" : ""
                    }`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
                    transition={yearTransition}
                  >
                    {activeMilestone.year}
                  </motion.span>
                </AnimatePresence>
              </div>
              <motion.span
                key={`date-${activeMilestone.date}`}
                className="education-journey__date"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                {activeMilestone.date}
              </motion.span>
            </div>

            <div
              className="education-journey__progress"
              aria-label={`Milestone ${activeIndex + 1} of ${milestones.length}`}
            >
              <span className="education-journey__count">
                {String(activeIndex + 1).padStart(2, "0")}
                <span aria-hidden="true"> / </span>
              </span>
              <div
                ref={progressTrackRef}
                className="education-journey__progress-track"
                aria-hidden="true"
              >
                <motion.span
                  className="education-journey__progress-fill"
                  style={{ scaleX: smoothScrollProgress }}
                />
                <motion.span
                  className="education-journey__progress-dot"
                  style={{ x: progressX }}
                />
              </div>
              <span className="education-journey__count">
                {String(milestones.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <div ref={timelineRef} className="education-journey__timeline">
          <div ref={railRef} className="education-journey__rail" aria-hidden="true">
            <motion.span
              className="education-journey__rail-fill"
              style={{ scaleY: smoothScrollProgress }}
            />
            <motion.span
              className="education-journey__active-marker"
              style={{ y: markerY }}
            />
          </div>

          {milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              className={`education-journey__milestone${
                activeIndex === index ? " is-active" : ""
              }`}
              aria-current={activeIndex === index ? "step" : undefined}
            >
              <span className="education-journey__node" aria-hidden="true" />
              <p className="education-journey__milestone-date">
                {milestone.date}
              </p>
              <p className="education-journey__status">{milestone.status}</p>
              <h3>{milestone.title}</h3>
              <p className="education-journey__institution">
                {milestone.institution}
              </p>
              {"specialization" in milestone && (
                <p className="education-journey__specialization">
                  {milestone.specialization}
                </p>
              )}
              <p className="education-journey__description">
                {milestone.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}