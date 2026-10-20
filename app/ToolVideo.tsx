"use client";

import { useEffect, useRef } from "react";

export function ToolVideo({ locale }: { locale: "en" | "ru" }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const frameElement = video?.parentElement;
    if (!video || !frameElement) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = frameElement.getBoundingClientRect();
      const center = bounds.top + bounds.height / 2;
      const centered = center >= window.innerHeight * .35 && center <= window.innerHeight * .65;
      if (centered && !reducedMotion.matches && !document.hidden) {
        if (video.paused) void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      reducedMotion.removeEventListener("change", schedule);
      video.pause();
    };
  }, []);

  return <figure className="toolDemo">
    <video ref={videoRef} src="/video/product-tool.webm" muted loop playsInline preload="metadata"
      aria-label={locale === "ru" ? "Демонстрация инструмента заполнения макетов реальными товарами" : "Demo of the tool that fills mockups with real products"} />
  </figure>;
}
