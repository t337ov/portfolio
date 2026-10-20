"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { CardScrollEffect } from "@/app/CardScrollEffect";

type ProfileCardProps = {
  name: string;
  role: string;
  intro: readonly string[];
  locale: "ru" | "en";
};

type PointerState = {
  x: number;
  y: number;
  backgroundX: number;
  backgroundY: number;
  rotateX: number;
  rotateY: number;
  opacity: number;
};

const centeredPointer: PointerState = {
  x: 50,
  y: 50,
  backgroundX: 50,
  backgroundY: 50,
  rotateX: 0,
  rotateY: 0,
  opacity: 0,
};

export function ProfileCard({ name, role, intro, locale }: ProfileCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const target = useRef<PointerState>({ ...centeredPointer });
  const current = useRef<PointerState>({ ...centeredPointer });
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedMotion.current = media.matches; };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const animate = useCallback(() => {
    frame.current = null;
    const card = cardRef.current;
    if (!card) return;

    const next = current.current;
    const goal = target.current;
    next.x += (goal.x - next.x) * 0.16;
    next.y += (goal.y - next.y) * 0.16;
    next.backgroundX += (goal.backgroundX - next.backgroundX) * 0.16;
    next.backgroundY += (goal.backgroundY - next.backgroundY) * 0.16;
    next.rotateX += (goal.rotateX - next.rotateX) * 0.16;
    next.rotateY += (goal.rotateY - next.rotateY) * 0.16;
    next.opacity += (goal.opacity - next.opacity) * 0.16;

    card.style.setProperty("--pointer-x", `${next.x}%`);
    card.style.setProperty("--pointer-y", `${next.y}%`);
    card.style.setProperty("--background-x", `${next.backgroundX}%`);
    card.style.setProperty("--background-y", `${next.backgroundY}%`);
    card.style.setProperty("--pointer-from-center", String(Math.min(1, Math.hypot(next.x - 50, next.y - 50) / 50)));
    card.style.setProperty("--rotate-x", `${next.rotateX}deg`);
    card.style.setProperty("--rotate-y", `${next.rotateY}deg`);
    card.style.setProperty("--card-opacity", String(next.opacity));

    const remaining = Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y) + Math.abs(goal.backgroundX - next.backgroundX) + Math.abs(goal.backgroundY - next.backgroundY) + Math.abs(goal.rotateX - next.rotateX) + Math.abs(goal.rotateY - next.rotateY) + Math.abs(goal.opacity - next.opacity);
    if (remaining > 0.04) frame.current = window.requestAnimationFrame(animate);
  }, []);

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
  }, []);

  const handlePointer = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || reducedMotion.current) return;
    const rect = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    target.current = {
      x: x * 100,
      y: y * 100,
      backgroundX: 37 + x * 26,
      backgroundY: 33 + y * 34,
      rotateX: -((x * 100 - 50) / 3.5),
      rotateY: (y * 100 - 50) / 3.5,
      opacity: 1,
    };
    card.dataset.active = "true";
    if (frame.current === null) frame.current = window.requestAnimationFrame(animate);
  }, [animate]);

  const resetPointer = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.dataset.active = "false";
    target.current = { ...centeredPointer };
    if (frame.current === null) frame.current = window.requestAnimationFrame(animate);
  }, [animate]);

  const activateFromFocus = useCallback(() => {
    const card = cardRef.current;
    if (!card || reducedMotion.current) return;
    card.dataset.active = "true";
    target.current.opacity = 1;
    if (frame.current === null) frame.current = window.requestAnimationFrame(animate);
  }, [animate]);

  return <article
    ref={cardRef}
    className="profileCard"
    data-active="false"
    tabIndex={0}
    aria-label={locale === "ru" ? "Портретная карточка с голографическим эффектом" : "Portrait card with a holographic effect"}
    onPointerEnter={handlePointer}
    onPointerMove={handlePointer}
    onPointerLeave={resetPointer}
    onFocus={activateFromFocus}
    onBlur={resetPointer}
  >
    <CardScrollEffect />
    <Image className="profileArtwork" src="/img/compressed/Card%20notext.webp" alt={locale === "ru" ? "Коллекционная карточка с портретом дизайнера" : "Collectible card portrait of the designer"} fill priority sizes="(max-width: 700px) 64.5vw, 440px" />
    <div className="profileCopy">
      <h1 id="profile-name">{name}</h1>
      <p className="role">{role}</p>
      <div className="bio">{intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </div>
    <div className="profileFoil" aria-hidden="true" />
    <div className="profileGlare" aria-hidden="true" />
  </article>;
}
