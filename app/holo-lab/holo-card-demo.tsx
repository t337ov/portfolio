"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { portfolio } from "@/content/portfolio";
import styles from "./holo-card-demo.module.css";

export function HoloCardDemo() {
  const [intensity, setIntensity] = useState(100);
  const [spotRadius, setSpotRadius] = useState(43);
  const [noiseOpacity, setNoiseOpacity] = useState(10);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const [foilEnabled, setFoilEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const pointerTarget = useRef({ x: 50, y: 50, backgroundX: 50, backgroundY: 50, rotateX: 0, rotateY: 0, opacity: 0 });
  const pointerCurrent = useRef({ x: 50, y: 50, backgroundX: 50, backgroundY: 50, rotateX: 0, rotateY: 0, opacity: 0 });
  const animationFrame = useRef<number | null>(null);
  const leaveTimeout = useRef<number | null>(null);
  const content = portfolio.ru;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const animatePointer = useCallback(() => {
    animationFrame.current = null;
    const card = cardRef.current;
    if (!card) return;

    const current = pointerCurrent.current;
    const target = pointerTarget.current;
    current.x += (target.x - current.x) * 0.16;
    current.y += (target.y - current.y) * 0.16;
    current.backgroundX += (target.backgroundX - current.backgroundX) * 0.16;
    current.backgroundY += (target.backgroundY - current.backgroundY) * 0.16;
    current.rotateX += (target.rotateX - current.rotateX) * 0.16;
    current.rotateY += (target.rotateY - current.rotateY) * 0.16;
    current.opacity += (target.opacity - current.opacity) * 0.16;
    card.style.setProperty("--pointer-x", `${current.x}%`);
    card.style.setProperty("--pointer-y", `${current.y}%`);
    card.style.setProperty("--shine-x", `${25 + current.x * 0.5}%`);
    card.style.setProperty("--shine-y", `${25 + current.y * 0.5}%`);
    card.style.setProperty("--background-x", `${current.backgroundX}%`);
    card.style.setProperty("--background-y", `${current.backgroundY}%`);
    card.style.setProperty("--pointer-from-center", `${Math.min(1, Math.hypot(current.x - 50, current.y - 50) / 50)}`);
    card.style.setProperty("--rotate-x", `${current.rotateX}deg`);
    card.style.setProperty("--rotate-y", `${current.rotateY}deg`);
    card.style.setProperty("--card-opacity", `${current.opacity}`);

    const remaining = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.backgroundX - current.backgroundX) + Math.abs(target.backgroundY - current.backgroundY) + Math.abs(target.rotateX - current.rotateX) + Math.abs(target.rotateY - current.rotateY) + Math.abs(target.opacity - current.opacity);
    if (remaining > 0.04) animationFrame.current = window.requestAnimationFrame(animatePointer);
  }, []);

  useEffect(() => () => {
    if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    if (leaveTimeout.current !== null) window.clearTimeout(leaveTimeout.current);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;
    const rect = card.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    if (leaveTimeout.current !== null) {
      window.clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
    const pointerX = x * 100;
    const pointerY = y * 100;
    pointerTarget.current = {
      x: pointerX,
      y: pointerY,
      backgroundX: 37 + x * 26,
      backgroundY: 33 + y * 34,
      rotateX: (-(pointerX - 50) / 3.5) * (tiltEnabled ? 1 : 0),
      rotateY: ((pointerY - 50) / 3.5) * (tiltEnabled ? 1 : 0),
      opacity: 1,
    };
    card.dataset.active = "true";
    if (animationFrame.current === null) animationFrame.current = window.requestAnimationFrame(animatePointer);
  }, [animatePointer, reducedMotion, tiltEnabled]);

  const resetPointer = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.dataset.active = "false";
    if (leaveTimeout.current !== null) window.clearTimeout(leaveTimeout.current);
    leaveTimeout.current = window.setTimeout(() => {
      pointerTarget.current = { x: 50, y: 50, backgroundX: 50, backgroundY: 50, rotateX: 0, rotateY: 0, opacity: 0 };
      leaveTimeout.current = null;
      if (animationFrame.current === null) animationFrame.current = window.requestAnimationFrame(animatePointer);
    }, 500);
  }, [animatePointer]);

  return <section className={styles.demo} aria-labelledby="demo-title">
    <div className={styles.intro}>
      <p className={styles.eyebrow}>Интерактивный прототип</p>
      <h1 id="demo-title" className={styles.title}>Голографическая карточка</h1>
      <p className={styles.description}>Белый блик проходит по всей карточке, а радужная голограмма проявляется только внутри маски.</p>
    </div>

    <div className={styles.workspace}>
      <div className={styles.stage}>
        <article
          ref={cardRef}
          className={styles.card}
          data-active="false"
          data-foil={foilEnabled}
          tabIndex={0}
          aria-label="Портретная карточка с голографическим эффектом. Наведите указатель или коснитесь карточки."
          onPointerEnter={handlePointerMove}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          onFocus={() => {
            if (reducedMotion || !cardRef.current) return;
            cardRef.current.dataset.active = "true";
            pointerTarget.current.opacity = 1;
            if (animationFrame.current === null) animationFrame.current = window.requestAnimationFrame(animatePointer);
          }}
          onBlur={resetPointer}
          style={{ "--foil-strength": foilEnabled ? intensity / 100 : 0, "--spot-radius": `${spotRadius}cqw`, "--noise-opacity": noiseOpacity / 100 } as React.CSSProperties}
        >
          <Image src="/img/compressed/Card%20notext.webp" alt="" fill priority sizes="(max-width: 760px) 78vw, 380px" className={styles.artwork} />
          <div className={styles.copy}>
            <h2>{content.name}</h2>
            <p className={styles.role}>{content.role}</p>
            <div className={styles.bio}>{content.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <div className={styles.shine} aria-hidden="true" />
          <div className={styles.glare} aria-hidden="true" />
          <div className={styles.noise} aria-hidden="true" />
          <span className={styles.srOnly}>Эффект меняется при движении указателя по карточке.</span>
        </article>
      </div>

      <aside className={styles.controls} aria-label="Настройки эффекта">
        <div className={styles.controlsHeader}>
          <h2>Настройки</h2>
          <span>LIVE</span>
        </div>

        <label className={styles.rangeLabel} htmlFor="foil-intensity">
          <span>Сила голограммы</span>
          <output htmlFor="foil-intensity">{intensity}%</output>
        </label>
        <input id="foil-intensity" className={styles.range} type="range" min="0" max="100" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
        <div className={styles.rangeEnds}><span>Тонко</span><span>Ярко</span></div>

        <label className={styles.rangeLabel} htmlFor="spot-radius">
          <span>Радиус блика</span>
          <output htmlFor="spot-radius">{spotRadius}%</output>
        </label>
        <input id="spot-radius" className={styles.range} type="range" min="20" max="60" value={spotRadius} onChange={(event) => setSpotRadius(Number(event.target.value))} />
        <div className={styles.rangeEnds}><span>Компактно</span><span>Шире</span></div>

        <label className={styles.rangeLabel} htmlFor="noise-opacity">
          <span>Прозрачность шума</span>
          <output htmlFor="noise-opacity">{noiseOpacity}%</output>
        </label>
        <input id="noise-opacity" className={styles.range} type="range" min="0" max="30" value={noiseOpacity} onChange={(event) => setNoiseOpacity(Number(event.target.value))} />
        <div className={styles.rangeEnds}><span>Незаметно</span><span>Заметно</span></div>

        <label className={styles.toggle}>
          <span><strong>3D-наклон</strong><small>Следует за указателем</small></span>
          <input type="checkbox" checked={tiltEnabled} onChange={(event) => setTiltEnabled(event.target.checked)} />
          <i aria-hidden="true" />
        </label>
        <label className={styles.toggle}>
          <span><strong>Радужная плёнка</strong><small>Цветной блик поверх изображения</small></span>
          <input type="checkbox" checked={foilEnabled} onChange={(event) => setFoilEnabled(event.target.checked)} />
          <i aria-hidden="true" />
        </label>

        <p className={styles.hint}>{reducedMotion ? "В системе включено уменьшение движения: наклон отключён." : "На телефоне коснитесь карточки и проведите по ней пальцем."}</p>
      </aside>
    </div>

    <footer className={styles.footer}><span className={styles.legend}><i /> наклон&nbsp; + &nbsp;блик&nbsp; + &nbsp;цветовая интерференция</span><span>Прототип · вне основного сайта</span></footer>
  </section>;
}
