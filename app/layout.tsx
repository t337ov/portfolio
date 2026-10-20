import { EntranceGuard } from "@/app/EntranceGuard";
import { LanguageTransition } from "@/app/LanguageTransition";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roman Titov — Senior Product Designer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><Script id="portfolio-navigation-state" strategy="beforeInteractive">{`try { const path = location.pathname.replace(/\\/+$/, ""); document.documentElement.lang = ["/ru", "/book-lab", "/holo-lab"].includes(path) ? "ru" : "en"; const key = "portfolio-language-navigation"; const skip = sessionStorage.getItem(key); sessionStorage.removeItem(key); if (skip && performance.getEntriesByType("navigation")[0]?.type !== "reload") document.documentElement.dataset.skipEntrance = "true"; if (new URL(location.href).searchParams.has("languageTransition")) { document.documentElement.dataset.languageTransition = "true"; document.documentElement.dataset.languagePending = "true"; } } catch {}`}</Script></head><body><EntranceGuard /><LanguageTransition />{children}</body></html>;
}
