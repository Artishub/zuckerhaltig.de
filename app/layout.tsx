import type { Metadata } from "next";
import "./globals.css";

const description =
  "Vergleiche Zucker in Getränken aus Deutschland: pro 100 ml, pro Flasche oder Dose, mit Quellen, Nährwerten und verständlichen Zuckerwürfeln.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zuckerhaltig.de"),
  title: {
    default: "Zuckerhaltig.de",
    template: "%s | Zuckerhaltig.de",
  },
  description,
  openGraph: {
    title: "Zuckerhaltig.de",
    description,
    url: "https://zuckerhaltig.de/de",
    siteName: "Zuckerhaltig.de",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Zuckerhaltig.de - Zucker in Getränken vergleichen",
      },
    ],
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuckerhaltig.de",
    description,
    images: ["/opengraph-image"],
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
