import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zuckerhaltig.de"),
  title: {
    default: "Zuckerhaltig.de",
    template: "%s | Zuckerhaltig.de",
  },
  description: "Eine öffentliche Datenbank über Zucker in Getränken in Deutschland.",
  openGraph: {
    title: "Zuckerhaltig.de",
    description: "Zuckerwerte in Getränken schnell vergleichen.",
    url: "https://zuckerhaltig.de/de",
    siteName: "Zuckerhaltig.de",
    locale: "de_DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
