"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ComicBook.module.css";

type ComicBookProps = {
  title: string;
  cover: string;
  firstPage: string;
  locale: "en" | "ru";
  aspectRatio?: string;
};

export function ComicBook({ title, cover, firstPage, locale, aspectRatio = "832 / 1280" }: ComicBookProps) {
  const [hovered, setHovered] = useState(false);
  const [tappedOpen, setTappedOpen] = useState(false);
  const lastPointerType = useRef<string | null>(null);
  const isOpen = hovered || tappedOpen;

  return (
    <div className={`${styles.book} ${isOpen ? styles.open : ""}`} style={{ aspectRatio }}>
      <div className={styles.pages} aria-hidden="true">
        <div className={styles.firstPage}>
          <Image src={firstPage} alt="" fill sizes="(max-width: 700px) 42vw, 238px" />
          <div className={styles.coverCastShadow} />
        </div>
      </div>

      <div className={styles.cover} aria-hidden="true">
        <div className={styles.coverFace}>
          <Image src={cover} alt="" fill sizes="(max-width: 700px) 42vw, 238px" />
          <img className={styles.layerSoftLight} src="/img/comic-layers/spine-soft-light.png" alt="" width={604} height={906} />
          <img className={styles.layerMultiply} src="/img/comic-layers/spine-multiply.png" alt="" width={604} height={906} />
          <img className={styles.layerNormal} src="/img/comic-layers/spine-normal.png" alt="" width={604} height={906} />
        </div>
        <div className={styles.coverOpenGradient} />
      </div>

      <button
        className={styles.hitArea}
        type="button"
        aria-label={tappedOpen
          ? (locale === "ru" ? `Закрыть обложку: ${title}` : `Close cover: ${title}`)
          : (locale === "ru" ? `Открыть обложку: ${title}` : `Open cover: ${title}`)}
        aria-pressed={tappedOpen}
        onPointerDown={(event) => { lastPointerType.current = event.pointerType; }}
        onClick={(event) => {
          if (lastPointerType.current === "touch" && event.detail > 0) {
            setTappedOpen((open) => !open);
          }
        }}
        onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
        onPointerLeave={(event) => { if (event.pointerType !== "touch") setHovered(false); }}
        onFocus={() => { if (lastPointerType.current !== "touch") setHovered(true); }}
        onBlur={() => setHovered(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setHovered(true);
        }}
      />
    </div>
  );
}
