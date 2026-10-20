"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function EntranceGuard() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("portfolio-language-navigation")) {
        document.documentElement.dataset.skipEntrance = "true";
      }
    } catch {}
  }, [pathname]);
  return null;
}
