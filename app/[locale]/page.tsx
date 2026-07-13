import { pageMetadata } from "@/lib/site";
import TestHomePage from "./test/page";

export const metadata = pageMetadata("Zucker in Getränken: Cola, Eistee, Energy Drinks", "Wie viel Zucker hat dein Getränk? Vergleiche Cola, Energy Drinks, Eistee, Saft und Limo pro 100 ml, pro Packung und als Zuckerwürfel.", "/de");

export default function HomePage() {
  return <TestHomePage />;
}
