import type { Metadata } from "next";

export const siteUrl = "https://www.zuckerhaltig.de";

type PageMetadataOptions = {
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  type?: "website" | "article";
};

export function pageMetadata(
  title: string,
  description: string,
  canonical: string,
  options: PageMetadataOptions = {},
): Metadata {
  const image = options.image ?? {
    src: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${title} | Zuckerhaltig.de`,
  };

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
      type: options.type ?? "website",
      images: [{
        url: image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.src],
    },
  };
}
