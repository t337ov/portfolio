import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Language transition prototype",
  robots: { index: false, follow: false },
};

export default function AnimationLabLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
