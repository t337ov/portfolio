import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  if (!origin) return [];
  const alternates = {
    languages: { en: origin, ru: `${origin}/ru/`, "x-default": origin },
  };
  return [
    { url: origin, alternates, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/ru/`, alternates, changeFrequency: "monthly", priority: 1 },
  ];
}
