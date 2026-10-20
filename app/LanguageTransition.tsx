"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type MeasuredWord = {
  node: Text;
  start: number;
  end: number;
  text: string;
  top: number;
  left: number;
  right: number;
};

type PreparedText = { restore: () => void; duration: number };

const textBlocks = "h2, h3, p, figcaption";
const lineStaggerMs = 46;
const tintDurationMs = 700;
const snapshotKey = "portfolio-language-old-page";

function skipsTextBlock(block: HTMLElement, page: HTMLElement) {
  const hiddenParent = block.closest("[aria-hidden='true']");
  return !!block.closest(".languageSwitch, .comicsSection") || (!!hiddenParent && hiddenParent !== page);
}

function getTextBlockLineCounts(page: HTMLElement) {
  const blocks = Array.from(page.querySelectorAll<HTMLElement>(textBlocks));
  const range = document.createRange();

  return blocks.map((block) => {
    if (skipsTextBlock(block, page)) return 0;

    let fallbackTop = Math.round(block.getBoundingClientRect().top);
    const tops: number[] = [];
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const pattern = /\S+/gu;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(textNode.data))) {
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + match[0].length);
        const rect = Array.from(range.getClientRects()).find((item) => item.width > 0 && item.height > 0);
        const top = rect ? Math.round(rect.top) : fallbackTop;
        if (rect) fallbackTop = top;
        if (!tops.some((existingTop) => Math.abs(existingTop - top) <= 6)) tops.push(top);
      }
    }

    return tops.length;
  });
}

function prepareTextRows(page: HTMLElement, wordClass: string, blockLineOffsets: number[]): PreparedText {
  const blocks = Array.from(page.querySelectorAll<HTMLElement>(textBlocks));
  let nextLine = 0;
  let longestDelay = 0;
  const range = document.createRange();
  const measured: MeasuredWord[] = [];

  for (const [blockIndex, block] of blocks.entries()) {
    if (skipsTextBlock(block, page)) continue;

    const blockRect = block.getBoundingClientRect();
    let fallbackTop = Math.round(blockRect.top);
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const words: MeasuredWord[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const pattern = /\S+/gu;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(textNode.data))) {
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + match[0].length);
        const rect = Array.from(range.getClientRects()).find((item) => item.width > 0 && item.height > 0);
        const top = rect ? Math.round(rect.top) : fallbackTop;
        if (rect) fallbackTop = top;
        words.push({
          node: textNode,
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          top,
          left: rect?.left ?? blockRect.left,
          right: rect?.right ?? blockRect.left + 1,
        });
      }
    }

    const lineBounds: Array<{ top: number; left: number; right: number; line: number }> = [];
    const wordLines = new Map<MeasuredWord, (typeof lineBounds)[number]>();
    const blockLineOffset = blockLineOffsets[blockIndex] ?? nextLine;
    for (const word of words) {
      // Range rectangles can differ slightly for glyphs on the same baseline.
      // Cluster nearby tops so an entire visual row starts together.
      let line = lineBounds.find((candidate) => Math.abs(candidate.top - word.top) <= 6);
      if (!line) {
        line = { top: word.top, left: word.left, right: word.right, line: blockLineOffset + lineBounds.length };
        lineBounds.push(line);
      } else {
        line.left = Math.min(line.left, word.left);
        line.right = Math.max(line.right, word.right);
      }
      wordLines.set(word, line);
    }
    nextLine = blockLineOffset + lineBounds.length;

    for (const word of words) {
      const line = wordLines.get(word)!;
      const delay = line.line * lineStaggerMs;
      longestDelay = Math.max(longestDelay, delay);
      measured.push({ ...word, top: delay, left: word.left - line.left, right: line.right - line.left });
    }
  }

  // Split each text node from right to left so the measured offsets stay valid.
  const byNode = new Map<Text, MeasuredWord[]>();
  for (const word of measured) {
    const list = byNode.get(word.node) ?? [];
    list.push(word);
    byNode.set(word.node, list);
  }

  for (const [textNode, words] of byNode) {
    for (const word of words.sort((a, b) => b.start - a.start)) {
      textNode.splitText(word.end);
      const token = textNode.splitText(word.start);
      const span = document.createElement("span");
      span.className = wordClass;
      span.textContent = word.text;
      span.dataset.transitionWord = word.text;
      span.style.setProperty("--line-delay", `${word.top}ms`);
      span.style.setProperty("--line-width", `${Math.max(1, word.right)}px`);
      span.style.setProperty("--word-offset", `${word.left}px`);
      token.replaceWith(span);
    }
  }

  return {
    duration: longestDelay + tintDurationMs,
    restore() {
      page.querySelectorAll<HTMLElement>(`.${wordClass}`).forEach((word) => {
        word.replaceWith(document.createTextNode(word.textContent ?? ""));
      });
      page.normalize();
    },
  };
}

function restoreTransitionUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("languageTransition")) return;
  url.searchParams.delete("languageTransition");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function saveCurrentPageSnapshot() {
  const page = document.querySelector<HTMLElement>("main.page");
  if (!page) return;
  const snapshot = page.cloneNode(true) as HTMLElement;
  snapshot.querySelectorAll(".languageTransitionWord, .languageTransitionOldWord").forEach((word) => {
    word.replaceWith(document.createTextNode(word.textContent ?? ""));
  });
  snapshot.normalize();
  try {
    sessionStorage.setItem(snapshotKey, snapshot.outerHTML);
  } catch {}
}

function attachOldPageSnapshot() {
  const existing = document.querySelector<HTMLElement>(".languageTransitionSnapshot");
  if (existing) return existing;
  let markup: string | null = null;
  try {
    markup = sessionStorage.getItem(snapshotKey);
  } catch {}
  if (!markup) return null;

  const template = document.createElement("template");
  template.innerHTML = markup;
  const snapshot = template.content.querySelector<HTMLElement>("main.page");
  if (!snapshot) return null;

  snapshot.classList.add("languageTransitionSnapshot");
  snapshot.setAttribute("aria-hidden", "true");
  snapshot.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  snapshot.querySelectorAll("script").forEach((element) => element.remove());
  const snapshotTopbar = snapshot.querySelector<HTMLElement>(".topbar");
  if (snapshotTopbar) snapshotTopbar.style.visibility = "hidden";
  snapshot.querySelectorAll<HTMLElement>("img, video, iframe, canvas").forEach((element) => {
    element.style.visibility = "hidden";
  });
  snapshot.style.position = "absolute";
  snapshot.style.top = "0";
  snapshot.style.left = "0";
  snapshot.style.width = "100%";
  snapshot.style.zIndex = "10";
  snapshot.style.pointerEvents = "none";
  document.body.append(snapshot);
  return snapshot;
}

function animateTranslatedText() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    try { sessionStorage.removeItem(snapshotKey); } catch {}
    document.querySelector(".languageTransitionSnapshot")?.remove();
    delete document.documentElement.dataset.languageTransition;
    delete document.documentElement.dataset.languagePending;
    restoreTransitionUrl();
    return () => {};
  }

  const page = document.querySelector<HTMLElement>("main.page");
  if (!page) {
    delete document.documentElement.dataset.languageTransition;
    delete document.documentElement.dataset.languagePending;
    return () => {};
  }

  // Keep translated copy hidden while we measure and wrap it, then let each
  // line reveal from its own animation. This closes the one-frame text flash.
  document.documentElement.dataset.languageTransition = "true";
  const oldPage = attachOldPageSnapshot();
  // Measure in layout coordinates: the card's rotation otherwise makes words
  // on one baseline appear to have different screen-space heights.
  document.documentElement.dataset.languageTransitionFreeze = "true";
  document.documentElement.dataset.languageTransitionMeasure = "true";
  const newLineCounts = getTextBlockLineCounts(page);
  const oldLineCounts = oldPage ? getTextBlockLineCounts(oldPage) : [];
  const blockLineOffsets: number[] = [];
  let nextSharedLine = 0;
  for (let index = 0; index < newLineCounts.length; index++) {
    blockLineOffsets[index] = nextSharedLine;
    nextSharedLine += Math.max(newLineCounts[index] ?? 0, oldLineCounts[index] ?? 0);
  }
  const newText = prepareTextRows(page, "languageTransitionWord", blockLineOffsets);
  const oldText = oldPage ? prepareTextRows(oldPage, "languageTransitionOldWord", blockLineOffsets) : null;
  delete document.documentElement.dataset.languageTransitionMeasure;
  // Commit the original transform while transitions are still disabled.
  void page.offsetHeight;
  delete document.documentElement.dataset.languageTransitionFreeze;
  delete document.documentElement.dataset.languageTransition;
  const duration = Math.max(newText.duration, oldText?.duration ?? 0);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const restore = (cleanUrl: boolean) => {
    if (timer) clearTimeout(timer);
    oldText?.restore();
    oldPage?.remove();
    newText.restore();
    delete document.documentElement.dataset.languageTransition;
    if (cleanUrl) {
      delete document.documentElement.dataset.languagePending;
      delete document.documentElement.dataset.languageSource;
      try { sessionStorage.removeItem(snapshotKey); } catch {}
      restoreTransitionUrl();
    }
  };

  timer = setTimeout(() => restore(true), duration + 80);
  return () => restore(false);
}

export function LanguageTransition() {
  const pathname = usePathname();
  const restoreRef = useRef<(() => void) | null>(null);
  const holdObserverRef = useRef<MutationObserver | null>(null);

  useLayoutEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(".languageSwitch a");
      if (!link || link.getAttribute("aria-current") === "page") return;
      restoreRef.current?.();
      restoreRef.current = null;
      holdObserverRef.current?.disconnect();
      saveCurrentPageSnapshot();
      const source = document.querySelector<HTMLElement>("main.page:not(.languageTransitionSnapshot)")?.lang;
      // Leave the actual current page untouched until the destination commits.
      // Swapping it for a clone at click time changes text rasterization.
      if (source && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.dataset.languageSource = source;
        document.documentElement.dataset.languagePending = "true";
        const hold = new MutationObserver(() => {
          const page = document.querySelector<HTMLElement>("main.page:not(.languageTransitionSnapshot)");
          if (!page || page.lang === source) return;
          document.documentElement.dataset.skipEntrance = "true";
          attachOldPageSnapshot();
          hold.disconnect();
        });
        holdObserverRef.current = hold;
        hold.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["lang"] });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      holdObserverRef.current?.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const route = pathname.split("/")[1];
    const locale = route === "ru" || route === "book-lab" || route === "holo-lab" ? "ru" : "en";
    document.documentElement.lang = locale;

    const url = new URL(window.location.href);
    const shouldAnimate = document.documentElement.dataset.languageTransition === "true" || url.searchParams.has("languageTransition");
    if (!shouldAnimate) return;

    let observer: MutationObserver | undefined;
    let frame = 0;
    const startWhenReady = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const page = document.querySelector<HTMLElement>("main.page:not(.languageTransitionSnapshot)");
        if (!page || page.lang !== locale) return;
        observer?.disconnect();
        document.documentElement.dataset.skipEntrance = "true";
        restoreRef.current = animateTranslatedText();
      });
    };

    // Pathname and streamed route content can commit separately. Keep the
    // outgoing layer visible until the destination page actually exists.
    document.documentElement.dataset.languageTransition = "true";
    document.documentElement.dataset.languagePending = "true";
    const destination = document.querySelector<HTMLElement>("main.page:not(.languageTransitionSnapshot)");
    if (destination?.lang === locale && destination.lang !== document.documentElement.dataset.languageSource) attachOldPageSnapshot();
    observer = new MutationObserver(startWhenReady);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["lang"] });
    startWhenReady();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      restoreRef.current?.();
      restoreRef.current = null;
    };
  }, [pathname]);

  return null;
}
