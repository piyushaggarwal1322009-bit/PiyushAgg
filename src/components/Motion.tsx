"use client";

import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useRef } from "react";

export function FadeIn({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function EntranceNav({ children, ...props }: PropsWithChildren<HTMLMotionProps<"nav">>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.nav>
  );
}

export function Reveal({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="motion-reveal"
      initial={{ opacity: 0.92, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollExit({ children }: PropsWithChildren) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.66, 0.92, 1], [1, 1, 0.85, 0.85]);
  const y = useTransform(scrollYProgress, [0.66, 0.92], [0, -24]);

  return (
    <motion.div ref={targetRef} className="activity-exit" style={{ "--exit-opacity": opacity, y } as MotionStyle}>
      {children}
    </motion.div>
  );
}

export function MagneticLink({
  children,
  ...props
}: PropsWithChildren<HTMLMotionProps<"a">>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.a whileHover={reducedMotion ? undefined : { y: -2 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} {...props}>
      {children}
    </motion.a>
  );
}