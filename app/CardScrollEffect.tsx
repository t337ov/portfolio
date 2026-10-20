"use client";

import { useEffect, useRef } from "react";

export function CardScrollEffect() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const card = marker.current?.parentElement;
    if (!card) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      card.style.setProperty("--card-scroll-scale", String(reducedMotion.matches ? 1 : 1 - .7 * progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      observer.disconnect();
    };
  }, []);
  return <span ref={marker} hidden aria-hidden="true" />;
}
