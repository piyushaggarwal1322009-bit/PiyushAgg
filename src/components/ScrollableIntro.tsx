"use client";

import type { KeyboardEvent, ReactNode } from "react";

type ScrollableIntroProps = {
  children: ReactNode;
};

function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
  if (event.target !== event.currentTarget) return;

  const panel = event.currentTarget;
  const atTop = panel.scrollTop <= 0;
  const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
  const scrollDown = event.key === "PageDown" || event.key === "ArrowDown" || (event.key === " " && !event.shiftKey);
  const scrollUp = event.key === "PageUp" || event.key === "ArrowUp" || (event.key === " " && event.shiftKey);

  if ((scrollDown && atBottom) || (scrollUp && atTop)) {
    event.preventDefault();
    const direction = scrollDown ? 1 : -1;
    const distance = event.key === "ArrowDown" || event.key === "ArrowUp" ? 48 : window.innerHeight * 0.82;
    window.scrollBy({ top: direction * distance, behavior: "auto" });
  }
}

export function ScrollableIntro({ children }: ScrollableIntroProps) {
  return (
    <div className="intro-panel" role="region" aria-label="About and technical skills" tabIndex={0} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
