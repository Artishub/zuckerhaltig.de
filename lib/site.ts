import type { Metadata } from "next";

export const siteUrl = "https://www.zuckerhaltig.de";

export function pageMetadata(title: string, description: string, canonical: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Zuckerhaltig.de",
      locale: "de_DE",
      type: "website",
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${title} | Zuckerhaltig.de`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
