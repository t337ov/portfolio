import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holographic card prototype",
  robots: { index: false, follow: false },
};

export default function HoloLabLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
