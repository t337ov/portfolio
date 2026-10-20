import type { Metadata } from "next";

const origin = process.env.SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Roman Titov — Senior Product Designer",
  description: "Roman Titov is a senior product designer working on digital products, design systems and comics.",
  ...(origin ? {
    alternates: {
      canonical: origin,
      languages: { en: origin, ru: `${origin}/ru`, "x-default": origin },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: "Roman Titov — Senior Product Designer",
      description: "Roman Titov is a senior product designer working on digital products, design systems and comics.",
      url: origin,
      images: [`${origin}/img/compressed/Card%20notext.webp`],
    },
  } : {}),
};

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
