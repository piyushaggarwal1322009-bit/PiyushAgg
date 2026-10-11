"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  phase: number;
  color: string;
  stream?: boolean;
  direction?: number;
};

export function ContactArtwork() {
  const artworkRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const artwork = artworkRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!artwork || !image || !canvas || !context) return;

    const particles: Particle[] = [];
    const prefersReducedMotion = reducedMotion === true;
    let isVisible = false;
    let animationFrame = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;

    const sampleArtwork = () => {
      if (!image.complete || !image.naturalWidth || !canvasWidth || !canvasHeight) return;

      const maskWidth = 240;
      const maskHeight = Math.max(160, Math.round(maskWidth * canvasHeight / canvasWidth));
      const mask = document.createElement("canvas");
      mask.width = maskWidth;
      mask.height = maskHeight;
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;

      const scale = Math.max(maskWidth / image.naturalWidth, maskHeight / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      maskContext.drawImage(image, (maskWidth - drawnWidth) / 2, (maskHeight - drawnHeight) / 2, drawnWidth, drawnHeight);

      let pixels: Uint8ClampedArray;
      try {
        pixels = maskContext.getImageData(0, 0, maskWidth, maskHeight).data;
      } catch {
        return;
      }

      const candidates: Array<{ x: number; y: number }> = [];
      for (let y = 2; y < maskHeight - 2; y += 2) {
        for (let x = 2; x < maskWidth - 2; x += 2) {
          const pixelIndex = (y * maskWidth + x) * 4;
          const red = pixels[pixelIndex];
          const green = pixels[pixelIndex + 1];
          const blue = pixels[pixelIndex + 2];
          if (red > 105 && red < 240 && green > 65 && green < 205 && blue > 35 && red > green * 1.045 && green > blue * 1.035 && red - green > 12) {
            candidates.push({ x: x / maskWidth, y: y / maskHeight });
          }
        }
      }

      let seed = 137;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0x100000000;
      };
      for (let index = candidates.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
      }

      particles.length = 0;
      const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;
      const particleCount = Math.min(prefersReducedMotion ? 36 : isSmallScreen ? 48 : 112, candidates.length);
      for (let index = 0; index < particleCount; index += 1) {
        const point = candidates[index];
        particles.push({
          x: point.x,
          y: point.y,
          radius: 0.7 + random() * 1.4,
          opacity: 0.28 + random() * 0.56,
          phase: random() * Math.PI * 2,
          color: random() > 0.9 ? "105, 174, 226" : "255, 205, 132",
        });
      }

      if (!prefersReducedMotion) {
        for (let index = 0; index < 12; index += 1) {
          particles.push({
            x: 0.455 + random() * 0.09,
            y: 0.36 + random() * 0.055,
            radius: 0.7 + random() * 0.9,
            opacity: 0.32 + random() * 0.42,
            phase: random(),
            color: index % 5 === 0 ? "105, 174, 226" : "255, 218, 157",
            stream: true,
            direction: index % 2 === 0 ? 1 : -1,
          });
        }
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.globalCompositeOperation = "screen";
      const pointerX = pointer.current.active ? (pointer.current.x - 0.5) * 5 : 0;
      const pointerY = pointer.current.active ? (pointer.current.y - 0.5) * 5 : 0;

      for (const particle of particles) {
        const drift = prefersReducedMotion ? 0 : time * 0.00042 + particle.phase;
        let x = particle.x * canvasWidth + pointerX + Math.sin(drift) * 1.6;
        let y = particle.y * canvasHeight + pointerY + Math.cos(drift * 0.82) * 1.6;
        let opacity = particle.opacity * (prefersReducedMotion ? 0.66 : 0.58 + Math.sin(drift * 1.4) * 0.2);

        if (particle.stream && !prefersReducedMotion) {
          const progress = (time * 0.00012 + particle.phase) % 1;
          x += particle.direction! * (progress - 0.5) * 15;
          y -= progress * 5;
          opacity *= Math.sin(progress * Math.PI);
        }

        context.beginPath();
        context.fillStyle = `rgba(${particle.color}, ${Math.max(0, opacity)})`;
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      const bounds = artwork.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = bounds.width;
      canvasHeight = bounds.height;
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      sampleArtwork();
      if (prefersReducedMotion && particles.length) draw(0);
    };

    const animate = (time: number) => {
      if (!isVisible || prefersReducedMotion) return;
      draw(time);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleImageLoad = () => {
      resize();
      if (isVisible && !prefersReducedMotion && !animationFrame) animationFrame = window.requestAnimationFrame(animate);
    };
    image.addEventListener("load", handleImageLoad);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        return;
      }
      resize();
      if (prefersReducedMotion) draw(0);
      else if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
    }, { rootMargin: "100px 0px" });
    intersectionObserver.observe(artwork);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(artwork);
    if (image.complete) handleImageLoad();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      image.removeEventListener("load", handleImageLoad);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [reducedMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current.x = (event.clientX - bounds.left) / bounds.width;
    pointer.current.y = (event.clientY - bounds.top) / bounds.height;
    pointer.current.active = true;
  };

  const handlePointerLeave = () => {
    pointer.current.active = false;
  };

  return (
    <div
      ref={artworkRef}
      className="contact-artwork"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Image
        ref={imageRef}
        className="contact-hands-image"
        src="/images/reaching-hands-creation-of-adam.jpg"
        alt="Two hands reaching toward one another in Michelangelo's Creation of Adam."
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 980px) 90vw, 56vw"
        loading="lazy"
        fetchPriority="low"
      />
      <canvas ref={canvasRef} className="contact-particles" aria-hidden="true" />
      <span className="contact-art-credit">MICHELANGELO · PUBLIC DOMAIN</span>
    </div>
  );
}