import type { Metadata } from "next";
import TestHomePage from "./test/page";

export const metadata: Metadata = {
  title: "Zucker in Getränken: Cola, Eistee, Energy Drinks",
  description: "Wie viel Zucker hat dein Getränk? Vergleiche Cola, Energy Drinks, Eistee, Saft und Limo pro 100 ml, pro Packung und als Zuckerwürfel.",
  alternates: {
    canonical: "/de",
  },
};

export default function HomePage() {
  return <TestHomePage />;
}
