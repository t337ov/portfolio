import type { Metadata } from "next";
import BookLab from "./prototype";

export const metadata: Metadata = {
  title: "Прототип раскрывающейся обложки",
  robots: { index: false, follow: false },
};

export default function BookLabPage() {
  return <BookLab />;
}
