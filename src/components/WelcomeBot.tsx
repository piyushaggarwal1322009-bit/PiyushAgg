"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const actions = [
  { label: "Technical Arsenal", href: "#arsenal" },
  { label: "Projects", href: "#work" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

function BotMark() {
  return (
    <span className="bot-mark" aria-hidden="true">
      <span className="bot-antenna" />
      <span className="bot-face">
        <i />
        <i />
        <b />
      </span>
    </span>
  );
}

export function WelcomeBot() {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => setShowFollowup(true), 1800);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  const closeAssistant = () => {
    setIsOpen(false);
    setHasDismissed(true);
  };

  const openAssistant = () => {
    setShowFollowup(true);
    setIsOpen(true);
  };

  const panel = (
    <motion.section
      key="assistant-panel"
      className="bot-panel"
      aria-label="Portfolio guide"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
    >
      <BotMark />
      <div className="bot-copy">
        <div className="bot-heading">
          <div>
            <span className="bot-online"><i /> PORTFOLIO GUIDE</span>
            <strong>Hey there!</strong>
          </div>
          <button
            className="bot-close"
            type="button"
            aria-label="Dismiss portfolio assistant"
            onClick={closeAssistant}
          >
            <X size={16} />
          </button>
        </div>
        <p>Welcome to Piyush&apos;s corner of the internet.</p>
        <AnimatePresence>
          {showFollowup && (
            <motion.p
              className="bot-followup"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            >
              Want to see what he&apos;s building?
            </motion.p>
          )}
        </AnimatePresence>
        <nav className="bot-actions" aria-label="Quick navigation">
          {actions.map((action) => (
            <a key={action.href} href={action.href} onClick={closeAssistant}>
              {action.label}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </nav>
      </div>
    </motion.section>
  );

  const launcher = (
    <motion.button
      className="bot-launcher"
      type="button"
      aria-label="Reopen portfolio assistant"
      title="Open portfolio guide"
      onClick={openAssistant}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
    >
      <BotMark />
    </motion.button>
  );

  return (
    <>
      {!hasDismissed && (
        <div className="welcome-bot is-inline">
          <AnimatePresence>{isOpen && panel}</AnimatePresence>
        </div>
      )}
      {hasDismissed && typeof document !== "undefined" &&
        createPortal(
          <div className={`welcome-bot is-floating ${isOpen ? "is-open" : ""}`}>
            <AnimatePresence>{isOpen && panel}</AnimatePresence>
            {!isOpen && launcher}
          </div>,
          document.body,
        )}
    </>
  );
}