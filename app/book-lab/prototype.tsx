"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import styles from "./prototype.module.css";

const cover = "/img/compressed/Cyberpunk 2077 - Big City Dreams-000.webp";
const inside = "/img/compressed/Cyberpunk 2077 - Where's Johnny-0000.webp";

export default function BookLab() {
  const [angle, setAngle] = useState(70);
  const [duration, setDuration] = useState(720);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isOpen = hovered || pinnedOpen;

  const bookStyle = {
    "--open-angle": `${angle}deg`,
    "--flip-duration": `${duration}ms`,
    "--page-duration": `${Math.round(duration * 0.78)}ms`,
    "--second-page-duration": `${Math.round(duration * 0.42)}ms`,
    "--second-page-delay": "0ms",
  } as CSSProperties;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/">← Вернуться на сайт</Link>
        <p className={styles.kicker}>ИЗОЛИРОВАННЫЙ ПРОТОТИП</p>
        <h1>Книга при наведении</h1>
        <p className={styles.lede}>Наведи курсор на обложку. Нажми, чтобы зафиксировать состояние и сравнить.</p>
      </header>

      <section className={styles.demo} aria-label="Интерактивный прототип обложки">
        <div className={styles.stage}>
          <div className={`${styles.bookWrap} ${isOpen ? styles.open : ""}`} style={bookStyle}>
            <div className={styles.pages} aria-hidden="true">
              <div className={styles.secondPage} />
              <div className={styles.insidePage}>
                <div className={styles.pageHeader}><span>CYBERPUNK 2077</span><span>01 / 02</span></div>
                <div className={styles.panelLarge}>
                  <Image src={inside} alt="" fill sizes="260px" priority />
                </div>
                <div className={styles.panelRow}>
                  <div className={styles.panelSmall}>
                    <Image src={cover} alt="" fill sizes="130px" />
                  </div>
                  <div className={styles.captionLines}><i /><i /><i /><i /><i /></div>
                </div>
                <div className={styles.pageNumber}>12</div>
                <div className={styles.coverCastShadow} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.cover} aria-hidden="true" style={bookStyle}>
              <span className={styles.coverArt}>
                <Image src={cover} alt="" fill sizes="280px" priority />
                <span className={styles.coverShine} aria-hidden="true" />
                <span className={styles.coverSpine} aria-hidden="true">
                  <img src="/img/comic-layers/spine-soft-light.png" alt="" />
                  <img src="/img/comic-layers/spine-multiply.png" alt="" />
                  <img src="/img/comic-layers/spine-normal.png" alt="" />
                </span>
              </span>
              <span className={styles.coverOpenGradient} aria-hidden="true" />
            </div>
            <button
              className={styles.hitArea}
              type="button"
              aria-label={pinnedOpen ? "Закрыть обложку" : "Открыть и зафиксировать обложку"}
              aria-pressed={pinnedOpen}
              onClick={() => setPinnedOpen((open) => !open)}
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            />
          </div>
          <p className={styles.hint}>Нажми на книгу, чтобы {pinnedOpen ? "снять фиксацию" : "закрепить раскрытие"}</p>
        </div>

        <aside className={styles.controls} aria-label="Параметры анимации">
          <div className={styles.controlHeading}>
            <h2>Параметры</h2>
            <button type="button" className={styles.reset} onClick={() => { setAngle(70); setDuration(720); setPinnedOpen(false); }}>Сбросить</button>
          </div>
          <label className={styles.control}>
            <span><strong>Угол раскрытия</strong><output>{angle}°</output></span>
            <input type="range" min="70" max="172" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
            <small>Можно настроить от 70° до почти полного раскрытия</small>
          </label>
          <label className={styles.control}>
            <span><strong>Скорость</strong><output>{duration} мс</output></span>
            <input type="range" min="280" max="1400" step="20" value={duration} onChange={(event) => setDuration(Number(event.target.value))} />
            <small>Время поворота обложки</small>
          </label>
          <p className={styles.note}>Внутренняя страница здесь собрана из доступных обложек как временный макет разворота.</p>
        </aside>
      </section>
    </main>
  );
}
