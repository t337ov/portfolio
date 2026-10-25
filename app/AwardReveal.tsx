"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AwardReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const root = document.documentElement;

    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let revealObserver: IntersectionObserver | null = null;
    const startReveal = () => {
      if (root.dataset.languageTransition === "true" || root.dataset.languagePending === "true") return false;
      if (revealObserver) return true;

      element.dataset.viewportReveal = "waiting";
      void element.offsetHeight;
      revealObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.viewportReveal = "visible";
          revealObserver?.unobserve(element);
        }
      });
      revealObserver.observe(element);
      return true;
    };

    if (startReveal()) return () => revealObserver?.disconnect();

    const transitionObserver = new MutationObserver(() => {
      if (startReveal()) transitionObserver.disconnect();
    });
    transitionObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-language-transition", "data-language-pending"],
    });

    return () => {
      transitionObserver.disconnect();
      revealObserver?.disconnect();
    };
  }, []);

  return <span className="award" ref={ref}><span className="awardLabel">{children}</span></span>;
}
