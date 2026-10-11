"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import type { PropsWithChildren } from "react";
import { useRef } from "react";

const photoSource = "https://commons.wikimedia.org/wiki/File:Yuki_Tsunoda_in_qualifying_for_the_2022_British_Grand_Prix.jpg";
const licenseSource = "https://creativecommons.org/licenses/by-sa/4.0/";

export function RacingTransition({ children }: PropsWithChildren) {
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: entranceProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "start start"],
  });
  const entranceOpacity = useTransform(entranceProgress, [0, 0.7, 1], [0, 0.86, 1]);
  const entranceY = useTransform(entranceProgress, [0, 1], [20, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.34, 0.68, 0.92], [1, 1, 0.62, 0]);
  const sceneOpacity = useTransform([entranceOpacity, sectionOpacity], ([entrance, section]: number[]) => entrance * section);
  const carX = useTransform(scrollYProgress, [0.28, 0.86], [0, -36]);
  const carScale = useTransform(scrollYProgress, [0.28, 0.86], [1, 0.98]);
  const sectionTitleOpacity = useTransform(scrollYProgress, [0.28, 0.7], [0.84, 0]);
  const titleOpacity = useTransform([entranceOpacity, sectionTitleOpacity], ([entrance, title]: number[]) => entrance * title);
  const contactOpacity = useTransform(scrollYProgress, [0.32, 0.66, 0.86], [0, 0.62, 1]);
  const creditVisibility = useTransform(scrollYProgress, [0, 0.04, 0.83, 0.85], ["hidden", "visible", "visible", "hidden"]);

  return (
    <section ref={storyRef} id="racing" className="race-story" aria-label="Racing showcase and contact">
      <div className="race-sticky">
        <motion.div className="race-atmosphere" style={{ "--scene-opacity": sceneOpacity, y: entranceY } as MotionStyle} aria-hidden="true">
          <motion.div className="race-car" style={{ x: carX, scale: carScale }}>
            <Image
              className="race-photo"
              src="/images/f1-action-yuki-tsunoda-2022.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 125vw, (max-width: 980px) 108vw, min(100vw, 1440px)"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
        <motion.div className="race-title" style={{ "--title-opacity": titleOpacity } as MotionStyle}>
          <span>ENGINEERING IN MOTION</span>
          <h2>BUILT TO<br />PERFORM.</h2>
        </motion.div>
        <motion.div className="race-credit" style={{ "--scene-opacity": sceneOpacity, "--credit-visibility": creditVisibility } as MotionStyle}>
          <a href={photoSource} target="_blank" rel="noreferrer">Photo: Timfilbert / Wikimedia Commons</a>
          <a href={licenseSource} target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
        </motion.div>
      </div>
      <motion.div className="race-contact-flow" style={{ "--contact-opacity": contactOpacity } as MotionStyle}>
        {children}
      </motion.div>
    </section>
  );
}
