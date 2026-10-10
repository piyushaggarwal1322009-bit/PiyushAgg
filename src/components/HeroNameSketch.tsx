"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function HeroNameSketch() {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const timer = window.setTimeout(() => setReady(true), 1450);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const isReady = ready;

  return (
    <h1 className={`sketch-name ${isReady ? "is-ready" : ""}`} aria-label="Piyush Aggarwal">
      <motion.span
        className="sketch-line sketch-first"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut" }}
      >
        Piyush
      </motion.span>
      <motion.span
        className="sketch-line sketch-last"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: reducedMotion ? 0 : 0.95, delay: reducedMotion ? 0 : 0.38, ease: "easeInOut" }}
      >
        Aggarwal
      </motion.span>
      {!isReady && <span className="sketch-sweep" aria-hidden="true" />}
    </h1>
  );
}
