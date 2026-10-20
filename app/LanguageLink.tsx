"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

export function LanguageLink(props: ComponentProps<typeof Link>) {
  const href = typeof props.href === "string" && props["aria-current"] !== "page"
    ? `${props.href}${props.href.includes("?") ? "&" : "?"}languageTransition=1`
    : props.href;

  return <Link {...props} href={href} onNavigate={(event) => {
    let prevented = false;
    props.onNavigate?.({ preventDefault: () => {
      prevented = true;
      event.preventDefault();
    } });
    if (prevented) return;

    try {
      sessionStorage.setItem("portfolio-language-navigation", "1");
    } catch {}
  }} />;
}
