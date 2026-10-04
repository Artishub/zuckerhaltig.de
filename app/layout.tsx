import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const description =
  "Vergleiche Zucker in Getränken aus Deutschland: pro 100 ml, pro Packung, mit Quellen, Nährwerten und Zuckerwürfeln.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zuckerhaltig.de",
    template: "%s | Zuckerhaltig.de",
  },
  description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Zuckerhaltig.de",
    description,
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
