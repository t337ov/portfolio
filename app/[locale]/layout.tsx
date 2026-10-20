import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, portfolio, type Locale } from "@/content/portfolio";

export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) return {};
  const locale = rawLocale as Locale;
  const content = portfolio[locale];
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  const localeUrl = locale === "en" ? origin : `${origin}/${locale}`;
  const alternates = origin ? {
    canonical: localeUrl,
    languages: { en: origin, ru: `${origin}/ru`, "x-default": origin },
  } : undefined;
  return {
    title: content.title,
    description: content.description,
    alternates,
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      title: content.title,
      description: content.description,
      ...(origin ? { url: localeUrl, images: [`${origin}/img/compressed/Card%20notext.webp`] } : {}),
    },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: rawLocale } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  return children;
}
