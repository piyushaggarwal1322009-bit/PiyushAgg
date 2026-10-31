"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, ArrowUpRight, Code2, Database, BrainCircuit, Globe } from "lucide-react";
import { buildContributionWeeks, getContributionWindow, type GitHubActivityPayload } from "../lib/github-activity";
import { projects } from "../data/projects";

const CONTRIBUTION_MONTHS = 5;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionPreference() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

const nodes = [
  { label: "Frontend", detail: "Interfaces people enjoy using", icon: Globe, angle: -90 },
  { label: "AI / ML", detail: "Intelligent features and LLM integrations", icon: BrainCircuit, angle: -18 },
  { label: "Backend", detail: "APIs, application logic and services", icon: Code2, angle: 54 },
  { label: "Data", detail: "Structured storage and persistence", icon: Database, angle: 126 },
  { label: "Product", detail: "Useful outcomes, not tech for tech's sake", icon: ArrowUpRight, angle: 198 },
];

export function TechOrbit() {
  const [active, setActive] = useState(0);
  const selected = nodes[active];
  return (
    <div className="orbit-panel">
      <div className="orbit-copy">
        <div className="orbit-kicker">HOW I CONNECT THE DOTS</div>
        <h3>One product.<br /><span>Many moving parts.</span></h3>
        <p>Explore the layers I think about when building a software product.</p>
        <div className="orbit-detail">
          <selected.icon size={19} />
          <div><strong>{selected.label}</strong><span>{selected.detail}</span></div>
        </div>
        <div className="orbit-tabs">
          {nodes.map((node, i) => (
            <button key={node.label} onClick={() => setActive(i)} className={active === i ? "active" : ""}>
              {node.label}
            </button>
          ))}
        </div>
      </div>
      <div className="orbit-visual" aria-label="Interactive technology layers">
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
        <div className="orbit-core"><span>IDEA</span><strong>→</strong><span>IMPACT</span></div>
        {nodes.map((node, i) => {
          const angle = (node.angle * Math.PI) / 180;
          const x = 50 + Math.cos(angle) * 34;
          const y = 50 + Math.sin(angle) * 34;
          const Icon = node.icon;
          return (
            <button
              key={node.label}
              className={`orbit-node ${active === i ? "active" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setActive(i)}
              aria-label={`Explore ${node.label}`}
            >
              <Icon size={18} /><span>{node.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function readCachedActivity(): GitHubActivityPayload | null {
  try {
    const raw = window.localStorage.getItem("github-activity-v2");
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
    const payload = value as Partial<GitHubActivityPayload>;
    if (payload.username !== "piyushaggarwal1322009-bit" || typeof payload.profileUrl !== "string" || typeof payload.fetchedAt !== "string" || !Array.isArray(payload.days)) return null;
    if (!payload.stats || typeof payload.stats.publicRepos !== "number" || typeof payload.stats.stars !== "number" || !Array.isArray(payload.stats.languages) || payload.stats.languages.some((language) => typeof language !== "string")) return null;
    if (payload.days.some((day) => !day || typeof day.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4)) return null;
    if (typeof payload.contributionDataAvailable !== "boolean" || (payload.totalContributions !== null && typeof payload.totalContributions !== "number")) return null;
    return { ...payload as GitHubActivityPayload, stale: true };
  } catch {
    return null;
  }
}

export function GitHubActivity() {
  const reducedMotion = useReducedMotion();
  const [data, setData] = useState<GitHubActivityPayload | null>(null);
  const [calendarToday, setCalendarToday] = useState<Date | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const cached = readCachedActivity();
    fetch("/api/github-activity", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("GitHub request failed"); return response.json() as Promise<GitHubActivityPayload>; })
      .then((payload) => {
        const result = !payload.contributionDataAvailable && cached?.contributionDataAvailable
          ? { ...payload, days: cached.days, totalContributions: cached.totalContributions, fetchedAt: cached.fetchedAt, contributionDataAvailable: true, stale: true }
          : payload;
        setCalendarToday(new Date());
        setData(result);
        setError(!result.contributionDataAvailable);
        try { window.localStorage.setItem("github-activity-v2", JSON.stringify(result)); } catch { /* Browser storage may be disabled. */ }
      })
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") return;
        if (cached) {
          setCalendarToday(new Date());
          setData(cached);
        }
        setError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [retry]);

  const contributionWindow = useMemo(
    () => calendarToday ? getContributionWindow(calendarToday, CONTRIBUTION_MONTHS) : null,
    [calendarToday],
  );
  const weeks = useMemo(
    () => calendarToday ? buildContributionWeeks(data?.days ?? [], calendarToday, CONTRIBUTION_MONTHS) : [],
    [data?.days, calendarToday],
  );
  const months = useMemo(() => {
    if (!contributionWindow || weeks.length === 0) return [];
    const start = new Date(`${contributionWindow.startDate}T00:00:00Z`);
    const end = new Date(`${contributionWindow.endDate}T00:00:00Z`);
    const weekdayOffset = (start.getUTCDay() + 6) % 7;
    const starts: { label: string; weekIndex: number }[] = [];
    const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));

    while (cursor <= end) {
      const dayOffset = Math.floor((cursor.getTime() - start.getTime()) / 86_400_000);
      starts.push({
        label: cursor.toLocaleDateString("en", { month: "short", timeZone: "UTC" }),
        weekIndex: Math.floor((weekdayOffset + dayOffset) / 7),
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    return starts.map((month, index) => ({
      ...month,
      span: (starts[index + 1]?.weekIndex ?? weeks.length) - month.weekIndex,
    }));
  }, [contributionWindow, weeks]);
  const recentContributions = data?.contributionDataAvailable && contributionWindow
    ? data.days.reduce((sum, day) => day.date >= contributionWindow.startDate && day.date <= contributionWindow.endDate ? sum + day.count : sum, 0)
    : null;
  const updatePanelHighlight = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  };

  return <div className="github-dashboard">
    <motion.aside
      className="github-statistics"
      aria-label="Developer statistics"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1], staggerChildren: reducedMotion ? 0 : 0.06 } },
      }}
    >
      <h3>Developer statistics</h3>
      <div className="github-stats-grid">
        <motion.div className="github-stat" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } } }}>
          <AnimatedNumber value={projects.length} suffix="+" delay={0} />
          <span>Projects built</span>
          <small>In this portfolio</small>
        </motion.div>
        <motion.div className="github-stat" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } } }}>
          <AnimatedNumber value={data?.stats.publicRepos ?? null} suffix="+" delay={120} />
          <span>Public repositories</span>
          <small>From GitHub profile</small>
        </motion.div>
        <motion.div className="github-stat" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } } }}>
          <strong className="github-stat-value github-stat-value-text" aria-label={data?.stats.topLanguage ?? "Language unavailable"}>
            {data?.stats.topLanguage ?? "—"}
          </strong>
          <span>Most-reported language</span>
          <small>By public repository count</small>
        </motion.div>
        <motion.div className="github-stat" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } } }}>
          <AnimatedNumber value={data?.stats.languages.length ?? null} suffix="+" delay={240} />
          <span>Languages detected</span>
          <small className="github-language-list">
            {data?.stats.languages.length ? data.stats.languages.slice(0, 4).join(" · ") : data ? "No language data" : ""}
            {data && data.stats.languages.length > 4 ? ` · +${data.stats.languages.length - 4}` : ""}
          </small>
        </motion.div>
      </div>
    </motion.aside>

    <motion.section
      className="github-panel"
      aria-labelledby="github-activity-heading"
      onPointerMove={updatePanelHighlight}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="github-panel-head">
        <div className="github-panel-brand"><Github size={22} /><div><strong id="github-activity-heading">GitHub activity</strong></div></div>
        <div className="github-total">
          <AnimatedNumber value={recentContributions} delay={360} />
          <span>contributions in the last {CONTRIBUTION_MONTHS} months</span>
        </div>
      </div>
      {loading && !data ? <div className="calendar-loading" aria-label="Loading GitHub activity"><span/><span/><span/><span/><span/><span/><span/></div> : data?.contributionDataAvailable && contributionWindow ? <>
        <div className="calendar-scroll">
          <div className="calendar-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(var(--calendar-week-min-size), 1fr))` }}>
            {months.map((month) => <span key={`${month.label}-${month.weekIndex}`} style={{ gridColumn: `${month.weekIndex + 1} / span ${month.span}` }}>{month.label}</span>)}
          </div>
          <div className="calendar-layout">
            <div className="calendar-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
            <motion.div className="contribution-weeks" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(var(--calendar-week-min-size), 1fr))` }} role="grid" aria-label={`Daily GitHub contributions from ${contributionWindow.startDate} through ${contributionWindow.endDate}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.008 } } }}>
              {weeks.map((week, weekIndex) => <motion.div className="contribution-week" role="row" key={weekIndex} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: reducedMotion ? 0 : 0.008 } } }}>
                {week.map((day, dayIndex) => day
                  ? <motion.button type="button" role="gridcell" key={day.date} className={`level-${day.level}`} title={`${day.count} contributions on ${day.date}`} aria-label={`${day.count} contributions on ${day.date}`} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reducedMotion ? 0 : 0.16 } } }} />
                  : <span key={`blank-${weekIndex}-${dayIndex}`} className="calendar-empty" aria-hidden="true" />)}
              </motion.div>)}
            </motion.div>
          </div>
        </div>
      </> : <div className="calendar-state">
        <p>{error ? "Live contribution data is unavailable." : "Contribution data could not be loaded."}</p>
        <button type="button" onClick={() => { setLoading(true); setRetry((value) => value + 1); }}>Retry</button>
      </div>}
      <div className="activity-foot">
        {data?.contributionDataAvailable && <span aria-label="Contribution intensity from less to more">Less <i className="level-0"/><i className="level-1"/><i className="level-2"/><i className="level-3"/><i className="level-4"/> More</span>}
        <a href={data?.profileUrl ?? "https://github.com/piyushaggarwal1322009-bit"} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={15} /></a>
      </div>
    </motion.section>
  </div>;
}

function AnimatedNumber({ value, suffix = "", delay }: { value: number | null; suffix?: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);
  const [displayValue, setDisplayValue] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionPreference, () => false);

  useEffect(() => {
    if (value === null) return;
    if (hasStarted.current) {
      setDisplayValue(value);
      return;
    }
    if (reducedMotion) {
      hasStarted.current = true;
      return;
    }
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      hasStarted.current = true;
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let timeout = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasStarted.current) return;
      hasStarted.current = true;
      observer.disconnect();
      timeout = window.setTimeout(() => {
        const startedAt = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(value * eased));
          if (progress < 1) frame = window.requestAnimationFrame(tick);
        };
        frame = window.requestAnimationFrame(tick);
      }, delay);
    }, { threshold: 0.35 });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [delay, reducedMotion, value]);

  return <strong ref={ref} className="github-stat-value" aria-label={value === null ? "Unavailable" : `${value}${suffix}`}>
    {value === null ? "—" : `${(reducedMotion ? value : displayValue).toLocaleString()}${suffix}`}
  </strong>;
}
