"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Mic, Users, Sparkles } from "lucide-react";

interface ProjectCardData {
  id: "grillr" | "synkro";
  title: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  accent: string;
  url: string;
  image: string;
  logoType: "svg" | "png";
  logoSrc: string;
  features: string[];
}

const CARDS: ProjectCardData[] = [
  {
    id: "grillr",
    title: "Grillr",
    tagline: "Voice-First Interview Practice",
    badge: "AI Interviewer",
    badgeColor: "#3b82f6",
    accent: "#60a5fa",
    url: "https://grillr3.vercel.app",
    image: "/images/grillr-live.png",
    logoType: "svg",
    logoSrc: "/images/grillr-logo.svg",
    features: ["Speech-to-text feedback", "Role-specific questions", "Live coaching loop"],
  },
  {
    id: "synkro",
    title: "SYNKRO",
    tagline: "Real-time Team Workspace",
    badge: "Live Collab",
    badgeColor: "#14b8a6",
    accent: "#2dd4bf",
    url: "https://collab-workspace-three.vercel.app",
    image: "/images/synkro-live.png",
    logoType: "png",
    logoSrc: "/images/synkro-icon.png",
    features: ["Shared rooms & invite codes", "Multi-user presence", "Zero-collision edits"],
  },
];

export function HeroProjectStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleCardClick = (url: string) => {
    if (isDraggingRef.current) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const frontIndex = activeIndex;
  const backIndex = activeIndex === 0 ? 1 : 0;

  const frontCard = CARDS[frontIndex];
  const backCard = CARDS[backIndex];

  return (
    <div className="hero-stack-container" aria-label="Interactive project showcase: Grillr and SYNKRO">
      <div className="hero-stack-deck">
        {/* BACK CARD */}
        <motion.div
          key={backCard.id + "-back"}
          className={`hero-project-card card-${backCard.id} is-back`}
          initial={false}
          animate={{
            scale: 0.94,
            rotate: 4,
            x: 20,
            y: 16,
            zIndex: 1,
            opacity: 0.88,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 24,
            duration: reducedMotion ? 0 : undefined,
          }}
          onClick={handleNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNext();
            }
          }}
          aria-label={`Switch to ${backCard.title}`}
        >
          <CardInner card={backCard} isFront={false} />
        </motion.div>

        {/* FRONT CARD (Interactive & Draggable) */}
        <motion.div
          key={frontCard.id + "-front"}
          className={`hero-project-card card-${frontCard.id} is-front`}
          drag={reducedMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragStart={(_, info) => {
            isDraggingRef.current = false;
            dragStartPosRef.current = { x: info.point.x, y: info.point.y };
          }}
          onDrag={(_, info) => {
            const distance = Math.hypot(
              info.point.x - dragStartPosRef.current.x,
              info.point.y - dragStartPosRef.current.y
            );
            if (distance > 6) {
              isDraggingRef.current = true;
            }
          }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 75 || Math.abs(info.velocity.x) > 350) {
              handleNext();
            }
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 50);
          }}
          initial={false}
          animate={{
            scale: 1,
            rotate: -1.5,
            x: 0,
            y: 0,
            zIndex: 2,
            opacity: 1,
          }}
          whileHover={{
            scale: 1.015,
            rotate: 0,
            transition: { duration: 0.2 },
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 22,
            duration: reducedMotion ? 0 : undefined,
          }}
          onClick={() => handleCardClick(frontCard.url)}
        >
          <CardInner card={frontCard} isFront={true} />
        </motion.div>
      </div>

      {/* FOOTER CONTROLS & PAGINATION */}
      <div className="hero-stack-controls">
        <button
          type="button"
          className="hero-stack-btn"
          onClick={handleNext}
          aria-label="Previous project card"
          title="Switch card"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <div className="hero-stack-indicators" role="tablist" aria-label="Selected project">
          {CARDS.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              className={`hero-stack-dot ${idx === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show ${card.title}`}
              role="tab"
              aria-selected={idx === activeIndex}
            >
              <span>{card.title}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="hero-stack-btn"
          onClick={handleNext}
          aria-label="Next project card"
          title="Switch card"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function CardInner({ card, isFront }: { card: ProjectCardData; isFront: boolean }) {
  return (
    <div className="hero-card-content">
      {/* CARD HEADER */}
      <div className="hero-card-header">
        <div className="hero-card-identity">
          <div className="hero-card-icon" style={{ borderColor: `${card.accent}33` }}>
            {card.logoType === "svg" ? (
              <Image src={card.logoSrc} alt="" width={22} height={22} className="hero-card-logo-img" />
            ) : (
              <Image src={card.logoSrc} alt="" width={22} height={22} className="hero-card-logo-img" />
            )}
          </div>
          <div>
            <div className="hero-card-title-row">
              <h3 className="hero-card-title">{card.title}</h3>
              <span className="hero-card-badge" style={{ backgroundColor: `${card.badgeColor}22`, color: card.accent }}>
                <span className="hero-card-badge-dot" style={{ backgroundColor: card.badgeColor }} />
                {card.badge}
              </span>
            </div>
            <p className="hero-card-tagline">{card.tagline}</p>
          </div>
        </div>

        <span className="hero-card-explore-pill" title="Open live site in new tab">
          Explore <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      </div>

      {/* REAL WEBSITE PREVIEW WINDOW */}
      <div className="hero-card-preview-frame">
        <div className="hero-card-browser-bar">
          <div className="hero-card-browser-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="hero-card-browser-url">{card.url.replace("https://", "")}</span>
          <span className="hero-card-live-indicator">
            <span className="live-pulse" /> Live
          </span>
        </div>

        <div className="hero-card-image-wrap">
          <Image
            src={card.image}
            alt={`Real screenshot of deployed ${card.title} website`}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className="hero-card-img"
            priority={card.id === "grillr"}
          />
          <div className="hero-card-image-overlay" />
        </div>

        {/* SUBTLE INTERACTIVE MOTION ACCENTS SPECIFIC TO EACH PRODUCT */}
        {card.id === "grillr" && (
          <div className="hero-card-product-accent accent-grillr" aria-hidden="true">
            <div className="grillr-wave-bars">
              <Mic size={12} className="grillr-wave-mic" />
              <span>Coaching waveform</span>
              <div className="wave-bars-anim">
                <i /><i /><i /><i /><i /><i /><i /><i />
              </div>
            </div>
          </div>
        )}

        {card.id === "synkro" && (
          <div className="hero-card-product-accent accent-synkro" aria-hidden="true">
            <div className="synkro-collab-strip">
              <Users size={12} className="synkro-collab-icon" />
              <span>Room: SYNK-842</span>
              <div className="synkro-presence-dots">
                <span className="p-dot p-1">PA</span>
                <span className="p-dot p-2">SM</span>
                <span className="p-dot p-3">AK</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CARD FEATURE HIGHLIGHTS */}
      <div className="hero-card-footer">
        <ul className="hero-card-features">
          {card.features.map((feat, i) => (
            <li key={i}>
              <Sparkles size={11} style={{ color: card.accent }} aria-hidden="true" />
              {feat}
            </li>
          ))}
        </ul>
        <span className="hero-card-hint">
          {isFront ? "Drag or click to visit ↗" : "Click to view"}
        </span>
      </div>
    </div>
  );
}

