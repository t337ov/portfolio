"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./transition-demo.module.css";

const copy = {
  en: {
    kicker: "PRODUCT DESIGNER · PORTFOLIO",
    title: "Design that makes complex things feel clear.",
    lines: [
      "I’m Roman, a product designer working at the intersection of strategy, craft, and technology.",
      "I turn intricate systems into experiences people can understand and enjoy.",
      "Over the last decade, I’ve shaped products, services, and teams — from a first idea to a thoughtful, useful experience.",
      "Good design is quiet when it should be, and memorable when it matters.",
    ],
    note: "Tap the language switch to replay",
    status: "Language changed",
  },
  ru: {
    kicker: "ПРОДУКТОВЫЙ ДИЗАЙНЕР · ПОРТФОЛИО",
    title: "Дизайн, который помогает сложному стать понятным.",
    lines: [
      "Я Роман, продуктовый дизайнер. Соединяю стратегию, визуальный язык и технологии.",
      "Превращаю сложные системы в понятные и приятные для людей продукты.",
      "За последние десять лет я работал над продуктами, сервисами и командами — от первой идеи до цельного и полезного опыта.",
      "Хороший дизайн незаметен, когда нужно, и запоминается, когда это важно.",
    ],
    note: "Нажмите на переключатель, чтобы повторить",
    status: "Язык переключён",
  },
} as const;

type Locale = keyof typeof copy;
const blockDelays = [120, 360, 600, 840, 1080] as const;
const rowStagger = 100;
const settleDelay = 2400;

function WrappedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className: string;
  delay?: number;
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [rows, setRows] = useState([text]);

  useLayoutEffect(() => {
    const measureRows = () => {
      const textNode = measureRef.current?.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

      const grouped: string[] = [];
      let previousTop: number | null = null;
      const range = document.createRange();
      const wordPattern = /\S+\s*/gu;
      let match: RegExpExecArray | null;

      while ((match = wordPattern.exec(text)) !== null) {
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + match[0].length);
        const rect = Array.from(range.getClientRects()).find((item) => item.height > 0);
        if (!rect) continue;
        const top = Math.round(rect.top);
        if (previousTop === null || Math.abs(top - previousTop) > 1) grouped.push(match[0]);
        else grouped[grouped.length - 1] += match[0];
        previousTop = top;
      }

      if (grouped.length) {
        setRows((current) => current.length === grouped.length && current.every((row, index) => row === grouped[index]) ? current : grouped);
      }
    };

    measureRows();
    const observer = new ResizeObserver(measureRows);
    if (measureRef.current?.parentElement) observer.observe(measureRef.current.parentElement);
    return () => observer.disconnect();
  }, [text]);

  return <span className={`${styles.wrappedText} ${className}`} aria-hidden={className !== styles.newLine}>
    <span className={styles.measureText} ref={measureRef} aria-hidden="true">{text}</span>
    <span className={styles.visualRows}>
      {rows.map((row, index) => <span className={styles.visualRow} key={`${index}-${row}`} style={{ "--row-delay": `${delay + index * rowStagger}ms` } as CSSProperties}>{row}</span>)}
    </span>
  </span>;
}

export function LanguageTransitionDemo() {
  const [locale, setLocale] = useState<Locale>("en");
  const [previousLocale, setPreviousLocale] = useState<Locale | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = copy[locale];
  const previous = previousLocale ? copy[previousLocale] : null;
  const rows = (text: typeof current) => [text.title, ...text.lines];

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  function switchLocale(next: Locale) {
    if (next === locale) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPreviousLocale(locale);
    setLocale(next);
    setIsAnimating(true);
    setAnnouncement(copy[next].status);
    timeoutRef.current = setTimeout(() => {
      setPreviousLocale(null);
      setIsAnimating(false);
    }, settleDelay);
  }

  const oldRows = previous ? rows(previous) : [];
  const newRows = rows(current);

  return <>
    <section className={styles.demo}>
      <div className={styles.demoHeader}>
        <div>
          <p className={styles.eyebrow}>A closer look at the language switch</p>
          <h1 className={styles.demoTitle}>One line at a time.</h1>
        </div>
        <div className={styles.switcher} role="group" aria-label="Choose preview language">
          {(["en", "ru"] as const).map((option, index) => <span className={styles.switchOption} key={option}>
            {index > 0 && <span className={styles.switchDivider} aria-hidden="true">·</span>}
            <button type="button" onClick={() => switchLocale(option)} aria-pressed={locale === option} className={locale === option ? styles.activeLanguage : ""}>
              {option.toUpperCase()}
            </button>
          </span>)}
        </div>
      </div>

      <article className={styles.sample} lang={locale}>
        <div className={styles.sampleMeta}>
          <span>{current.kicker}</span>
          <span className={styles.liveDot} aria-hidden="true" />
        </div>
        <div className={`${styles.copyBlock} ${isAnimating ? styles.animating : ""}`} aria-live="polite" aria-atomic="false">
          {newRows.map((line, index) => {
            const delay = blockDelays[index];
            return <div className={`${styles.line} ${index === 0 ? styles.headlineLine : styles.bodyLine}`} key={`${locale}-${index}`}>
              {isAnimating && previous && <WrappedText className={styles.oldLine} text={oldRows[index]} delay={delay} />}
              <WrappedText className={styles.newLine} text={line} delay={delay} />
              {isAnimating && <WrappedText className={styles.tintedLine} text={line} delay={delay} />}
            </div>;
          })}
        </div>
        <div className={styles.sampleFooter}>
          <span>{current.note}</span>
          <span className={styles.motionKey}><i /> SOFT FADE · LIFT</span>
        </div>
      </article>

      <p className={styles.caption}>Each line softly fades and lifts as the new language comes into focus.</p>
      <span className={styles.srOnly} aria-live="polite">{announcement}</span>
    </section>
    <footer className={styles.footer}>A small interaction study for the portfolio language switch.</footer>
  </>;
}
