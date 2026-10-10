"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";

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

export function Reveal({ children, delay = 0 }: PropsWithChildren<{ delay?: number }>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="motion-reveal"
      initial={reducedMotion ? false : { opacity: 0.86, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
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